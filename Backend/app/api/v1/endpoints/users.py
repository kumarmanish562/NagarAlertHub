from fastapi import APIRouter, HTTPException, Body
from app.services.firebase_service import firebase_service
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class UserLocation(BaseModel):
    latitude: float
    longitude: float

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    mobile: str
    password: str # In production, hash this!
    role: str = "user" # 'user' or 'admin'
    department: Optional[str] = None # Only for admins
    address: Optional[str] = None
    zipCode: Optional[str] = None
    country: Optional[str] = None
    location: Optional[UserLocation] = None

class UserLogin(BaseModel):
    mobile: str
    password: str


@router.post("/register", status_code=201)
async def register_user(user: UserCreate):
    """
    Register User (Citizen) or Admin.
    Key is mobile number for uniqueness.
    """
    print(f"DEBUG REGISTER: Validating {user.mobile}")
    user_data = user.dict()
    # Use mobile as key
    user_id = user.mobile
    
    result = firebase_service.save_user(user_data, user_id=user_id)
    
    if "error" in result:
        print(f"DEBUG REGISTER ERROR: {result['error']}")
        raise HTTPException(status_code=500, detail=result["error"])
        
    print(f"DEBUG REGISTER SUCCESS: {user_id}")
    return {"message": "Registered successfully", "userId": user_id, "role": user.role}

@router.post("/login")
async def login_user(user: UserLogin):
    """
    Simple Login: Verify Mobile and Password
    """
    print(f"DEBUG LOGIN: Attempting login for {user.mobile}")
    users = firebase_service.get_users()
    if not users:
        print("DEBUG LOGIN: No users in DB")
        raise HTTPException(status_code=404, detail="User not found")
    
    print(f"DEBUG LOGIN: Users Keys: {list(users.keys()) if isinstance(users, dict) else 'Not a dict'}")

    # Find user by mobile (key or field)
    target_user = None
    if isinstance(users, dict):
        target_user = users.get(user.mobile)
        if not target_user:
            print(f"DEBUG LOGIN: Key lookup failed for {user.mobile}. Checking values...")
            # Search values
            for key, val in users.items():
                if val.get('mobile') == user.mobile:
                    target_user = val
                    break
            for key, val in users.items():
                if val.get('mobile') == user.mobile:
                    target_user = val
                    break
    
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Check Password (Plaintext for MVP)
    if target_user.get('password') != user.password:
         raise HTTPException(status_code=400, detail="Invalid credentials")
         
    return {
        "userId": user.mobile, 
        "name": f"{target_user.get('firstName', '')} {target_user.get('lastName', '')}",
        "role": target_user.get('role', 'user')
    }

@router.post("/update-location")
async def update_location(
    user_id: str = Body(..., embed=True), 
    latitude: float = Body(..., embed=True), 
    longitude: float = Body(..., embed=True)
):
    """
    Called by Mobile App background service to update Admin Map.
    """
    location_data = {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "lastActive": {".sv": "timestamp"}
    }
    firebase_service.save_user(location_data, user_id=user_id)
    return {"status": "updated"}

@router.get("/active")
async def get_active_users():
    return firebase_service.get_users()

@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    """Get single user profile"""
    users = firebase_service.get_users() # Optimization: Should fetch single, but using existing method
    # Filter manually for now as firebase_service.get_users() returns all
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if users is list or dict
    if isinstance(users, dict):
        user = users.get(user_id)
        if user:
            return user
            
        # Search by value if user_id is a key
        for key, val in users.items():
            if val.get('mobile') == user_id or key == user_id:
                return val
    
    raise HTTPException(status_code=404, detail="User not found")

@router.patch("/{user_id}")
async def update_user_profile(user_id: str, user_update: dict = Body(...)):
    """Update user profile"""
    return firebase_service.save_user(user_update, user_id=user_id)