"""
WebSocket endpoint for real-time alert notifications
Handles client connections and manages subscriptions
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services.websocket_manager import manager

router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time alerts
    
    Connect: ws://your-api/api/v1/ws/{user_id}
    
    Messages:
    1. Subscribe to areas: {"type": "subscribe", "areas": ["Area1", "Area2"]}
    2. Receives alerts as: {"type": "alert", "timestamp": "...", "data": {...}}
    """
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "subscribe":
                # User subscribing to areas
                areas = data.get("areas", [])
                await manager.subscribe_to_area(user_id, areas)
                await websocket.send_json({
                    "type": "subscription_confirmed",
                    "areas": areas,
                    "message": f"Subscribed to {len(areas)} area(s)"
                })
            
            elif data.get("type") == "ping":
                # Keep-alive ping
                await websocket.send_json({"type": "pong"})
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"WebSocket disconnected: {user_id}")
    except Exception as e:
        print(f"WebSocket error for {user_id}: {e}")
        manager.disconnect(user_id)


@router.get("/ws/status")
async def websocket_status():
    """Get current WebSocket connection status"""
    return {
        "connected_users": manager.get_connected_users_count(),
        "user_list": manager.get_connected_users()
    }
