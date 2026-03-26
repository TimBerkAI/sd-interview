import json
from typing import Dict, List

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: int):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
        print(f'Client connected to room {room_id}. Total connections: {len(self.active_connections[room_id])}')

    def disconnect(self, websocket: WebSocket, room_id: int):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
                print(
                    f'Client disconnected from room {room_id}. Remaining connections: {len(self.active_connections[room_id])}'
                )

            if len(self.active_connections[room_id]) == 0:
                del self.active_connections[room_id]

    async def broadcast_to_room(self, room_id: int, message: dict, exclude: WebSocket | None = None):
        if room_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[room_id]:
                if connection != exclude:
                    try:
                        await connection.send_text(json.dumps(message))
                    except Exception as e:
                        print(f'Error sending message: {e}')
                        disconnected.append(connection)

            for conn in disconnected:
                self.disconnect(conn, room_id)


manager = ConnectionManager()
