from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.router.user import router as user_router
from app.router.url import router as url_router
from app.db.database import get_db
from app.services.url import UrlService
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(url_router)


@app.get("/{short_code}")
def redirect_short_url(
    short_code: str,
    db: Session = Depends(get_db)
):
    """
    Root-level redirect endpoint for shortened URLs
    
    Usage: Redirect directly from {host}/{short_code}
    
    - **short_code**: The 6-character short code
    """
    try:
        original_url = UrlService.get_original_url(short_code, db)
        
        if not original_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shortened URL not found"
            )
        
        # Return a temporary redirect (307) to the original URL
        return RedirectResponse(url=original_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)
    
    except HTTPException as e:
        raise
    except Exception as e:
        print(f"Redirect error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=str(e)
        )