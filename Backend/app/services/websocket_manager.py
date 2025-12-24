"""
WebSocket Manager for Real-Time Alert Broadcasting
Handles WebSocket connections and manages alert notifications
"""
from typing import List, Set, Dict
import json
from fastapi import WebSocket
from datetime import datetime


class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        # Store active connections with user_id as key
        self.active_connections: Dict[str, WebSocket] = {}
        # Map user_id to their subscribed areas
        self.user_subscriptions: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"✅ User {user_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, user_id: str):
        """Remove a disconnected user"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.user_subscriptions:
            del self.user_subscriptions[user_id]
        print(f"❌ User {user_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def subscribe_to_area(self, user_id: str, areas: List[str]):
        """Subscribe a user to alerts in specific areas"""
        self.user_subscriptions[user_id] = areas
        print(f"📍 User {user_id} subscribed to areas: {areas}")
    
    async def broadcast_alert(self, alert_data: dict, target_area: str = None):
        """
        Broadcast an alert to all connected users
        If target_area is provided, only broadcast to users subscribed to that area
        """
        message = {
            "type": "alert",
            "timestamp": datetime.now().isoformat(),
            "data": alert_data
        }
        
        disconnected_users = []
        
        for user_id, websocket in self.active_connections.items():
            try:
                # Check if user is subscribed to this area
                if target_area:
                    subscribed_areas = self.user_subscriptions.get(user_id, [])
                    if target_area.lower() not in [area.lower() for area in subscribed_areas]:
                        continue
                
                await websocket.send_json(message)
                print(f"📤 Alert sent to {user_id}")
            except Exception as e:
                print(f"❌ Error sending to {user_id}: {e}")
                disconnected_users.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected_users:
            self.disconnect(user_id)
    
    async def send_location_update(self, user_id: str, location_data: dict):
        """Broadcast location update to admin users"""
        message = {
            "type": "location_update",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "data": location_data
        }
        
        # Only send to admin users for now
        for admin_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                print(f"Error sending location to {admin_id}: {e}")
    
    async def send_notification(self, user_id: str, notification: dict):
        """Send a notification to a specific user"""
        if user_id not in self.active_connections:
            print(f"User {user_id} not connected")
            return False
        
        message = {
            "type": "notification",
            "timestamp": datetime.now().isoformat(),
            "data": notification
        }
        
        try:
            await self.active_connections[user_id].send_json(message)
            return True
        except Exception as e:
            print(f"Error sending notification to {user_id}: {e}")
            self.disconnect(user_id)
            return False
    
    def get_connected_users_count(self) -> int:
        """Get count of connected users"""
        return len(self.active_connections)
    
    def get_connected_users(self) -> List[str]:
        """Get list of connected user IDs"""
        return list(self.active_connections.keys())


# Global connection manager instance
manager = ConnectionManager()
