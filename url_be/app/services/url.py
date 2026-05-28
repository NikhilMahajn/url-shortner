import string
import random
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import os 

from app.schemas.url import UrlCreate
from app.models.url import Url
from app.db.database import SessionLocal





class UrlService:
    
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
    
    @staticmethod
    def _get_cipher():
        """Get Fernet cipher instance for encryption"""
        return Fernet(UrlService.ENCRYPTION_KEY)
    
    @staticmethod
    def _encrypt_url(url: str) -> str:
        """Encrypt the original URL"""
        cipher = UrlService._get_cipher()
        encrypted_bytes = cipher.encrypt(url.encode())
        return encrypted_bytes.decode()
    
    @staticmethod
    def _decrypt_url(encrypted_url: str) -> str:
        """Decrypt the original URL"""
        cipher = UrlService._get_cipher()
        decrypted_bytes = cipher.decrypt(encrypted_url.encode())
        return decrypted_bytes.decode()
    
    @staticmethod
    def _generate_short_code(length: int = 6) -> str:
        """Generate a random 6-letter short code"""
        characters = string.ascii_uppercase
        return ''.join(random.choice(characters) for _ in range(length))
    
    @staticmethod
    def _ensure_unique_short_code(db: Session, max_attempts: int = 10) -> str:
        """Generate a unique short code"""
        for _ in range(max_attempts):
            short_code = UrlService._generate_short_code()
            existing = db.query(Url).filter(Url.short_code == short_code).first()
            if not existing:
                return short_code
        raise Exception("Failed to generate unique short code")
    
    @staticmethod
    def create_url(url_data: UrlCreate, db: Session = None) -> Url:
        """
        Create a new shortened URL
        
        Args:
            url_data: UrlCreate schema with the original URL
            user_id: ID of the user creating the URL
            db: Database session
            
        Returns:
            Url: Created Url object
        """
        try:
            
            encrypted_url = UrlService._encrypt_url(url_data.url)
            
            short_code = UrlService._ensure_unique_short_code(db)
            
            # Create new URL entry
            new_url = Url(
                original_url=encrypted_url,
                short_code=short_code,
                user_id=url_data.user_id,
                created_at=datetime.utcnow(),
                click_count=0,
                expiry_date=datetime.now() + timedelta(days=7),
            )
            
            db.add(new_url)
            db.commit()
            db.refresh(new_url)

            new_url.original_url = UrlService._decrypt_url(new_url.original_url)
            
            return new_url
        
        except IntegrityError as e:
            db.rollback()
            raise Exception("Error creating URL in database")
        except Exception as e:
            db.rollback()
            raise e
    
    @staticmethod
    def get_url_by_short_code(short_code: str, db: Session = None) -> Url:
        """Get URL by short code and increment click count"""
      
        url = db.query(Url).filter(Url.short_code == short_code).first()

        if url:
            # Increment click count
            url.click_count += 1
            db.commit()
            db.refresh(url)
        
        return url
    
    @staticmethod
    def get_original_url(short_code: str, db: Session = None) -> str:
        """Get decrypted original URL by short code"""
        
        url = UrlService.get_url_by_short_code(short_code, db)
        
        if url:
            # Check if URL has expired
            if url.expiry_date and url.expiry_date < datetime.utcnow():
                raise Exception("URL has expired")
            decrypted = UrlService._decrypt_url(url.original_url)
            
            return decrypted
        
        return None
    
    @staticmethod
    def get_user_urls(user_id: int, db: Session = None) -> list:
        """Get all URLs created by a user"""
        
        urls = db.query(Url).filter(Url.user_id == user_id).all()

        return [{
                "id": url.id,
                "original_url": UrlService._decrypt_url(url.original_url),
                "short_url": url.short_code,
                "created_at": url.created_at,
                "expiry_date": url.expiry_date
            }
            for url in urls]
    
    @staticmethod
    def delete_url(url_id: int, user_id: int, db: Session = None) -> bool:
        """Delete a URL (only by the user who created it)"""
        if db is None:
            db = SessionLocal()
        
        url = db.query(Url).filter(
            Url.id == url_id,
            Url.user_id == user_id
        ).first()
        
        if url:
            db.delete(url)
            db.commit()
            return True
        
        return False