from pydantic import BaseModel
from datetime import datetime


class UrlCreate(BaseModel):
    url: str
    user_id:int

class UrlResponse(BaseModel):
    id: int
    original_url: str
    short_url: str
    created_at: datetime | None
    expiry_date: datetime| None

    class Config:
        from_attributes = True
        