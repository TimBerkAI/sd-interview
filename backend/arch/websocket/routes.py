import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from arch.websocket.manage import manager

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int):
    await manager.connect(websocket, room_id)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            print(f"Received message in room {room_id}: {message}")

            response_message = {
                "type": f"{message['type']}_updated",
                "payload": message.get("payload", {}),
            }

            if message["type"] == "update_answer":
                response_message["type"] = "answer_updated"
                response_message["payload"] = {
                    "id": message["payload"]["answerId"],
                    "candidate_answer": message["payload"]["text"],
                }

            elif message["type"] == "update_score":
                response_message["type"] = "score_updated"
                response_message["payload"] = {
                    "answerId": message["payload"]["answerId"],
                    "mark": message["payload"]["score"],
                }

            elif message["type"] == "update_comment":
                response_message["type"] = "comment_updated"
                response_message["payload"] = {
                    "answerId": message["payload"]["answerId"],
                    "comment": message["payload"]["comment"],
                }

            await manager.broadcast_to_room(
                room_id, response_message, exclude=websocket
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        print(f"WebSocket disconnected from room {room_id}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)
