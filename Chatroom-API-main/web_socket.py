from flask_socketio import SocketIO,join_room,leave_room
import json
from database_interface import addMessage,getChatroomsFromUserId

socketio = SocketIO()

@socketio.on('connect')
def handle_connect():
    socketio.emit('connect_ACK',json.dumps({'response':'ACK'}))
@socketio.on('connection_token')
def handle_connect_validation(data):
    try:
        token_data=json.loads(data)
        token=token_data['socket_message']
        rooms=getChatroomsFromUserId(token)
        for room in rooms:
            join_room(room['id'])
        socketio.emit('connect_clear',json.dumps(rooms))
    except Exception as e:
        socketio.emit('connect_fail',json.dumps({'error':str(e)}))
@socketio.on('message')
def handle_message(data):
    message_data=json.loads(data)
    user_message=message_data['user_message']
    chatroom_id=message_data['user_chatroom']
    
    socketio.emit('message',json.dumps({'user_message':'BACKEND_PARSED: '+user_message}))
