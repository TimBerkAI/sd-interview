import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from arch.websocket.manage import manager

router = APIRouter()


@router.websocket('/ws/tech/{room_id}/')
async def tech_websocket_endpoint(websocket: WebSocket, room_id: int):
    room_key = f'tech_{room_id}'
    await manager.connect(websocket, room_key)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            response_message: dict = {
                'type': f'{message["type"]}_updated',
                'payload': message.get('payload', {}),
            }

            if message['type'] == 'update_answer':
                response_message['type'] = 'answer_updated'
                response_message['payload'] = {
                    'id': message['payload']['answerId'],
                    'candidate_answer': message['payload']['text'],
                }
            elif message['type'] == 'update_score':
                response_message['type'] = 'score_updated'
                response_message['payload'] = {
                    'answerId': message['payload']['answerId'],
                    'score': message['payload']['score'],
                }
            elif message['type'] == 'update_comment':
                response_message['type'] = 'comment_updated'
                response_message['payload'] = {
                    'answerId': message['payload']['answerId'],
                    'comment': message['payload']['comment'],
                }

            await manager.broadcast_to_room(room_key, response_message, exclude=websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_key)
    except Exception as e:
        print(f'Tech WebSocket error: {e}')
        manager.disconnect(websocket, room_key)
