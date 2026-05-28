from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.url import UrlCreate, UrlResponse
from app.services.url import UrlService
from app.models.url import Url

router = APIRouter(prefix="/urls", tags=["urls"])


@router.post("/", response_model=UrlResponse, status_code=status.HTTP_201_CREATED)
def create_url(
    url_data: UrlCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new shortened URL
    
    - **url_data**: Contains the original URL to be shortened
    - **user_id**: ID of the user creating the shortened URL
    """
    try:
        new_url = UrlService.create_url(url_data, db)
        return {
            "id": new_url.id,
            "original_url": new_url.original_url,
            "short_url": new_url.short_code,
            "created_at": new_url.created_at,
            "expiry_date": new_url.expiry_date
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{short_code}", response_model=dict)
def get_original_url(
    short_code: str,
    db: Session = Depends(get_db)
):
    """
    Get the original URL by short code
    
    - **short_code**: The 6-character short code
    """
    try:
        original_url = UrlService.get_original_url(short_code, db)
        if not original_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Short URL not found"
            )

        return {
            "original_url":original_url,
            "short_code": short_code,
        }
    except HTTPException as e:
        raise
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/user/{user_id}", response_model=List[UrlResponse])
def get_user_urls(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all shortened URLs created by a specific user
    
    - **user_id**: ID of the user
    """
    try:
        urls = UrlService.get_user_urls(user_id, db)
        if not urls:
            return []
    
        return urls
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{url_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_url(
    url_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a shortened URL (only the creator can delete)
    
    - **url_id**: ID of the URL to delete
    - **user_id**: ID of the user (must be the creator)
    """
    try:
        success = UrlService.delete_url(url_id, user_id, db)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this URL or URL not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

