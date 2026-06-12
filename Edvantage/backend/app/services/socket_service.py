from app import socketio
from flask_socketio import emit

@socketio.on('message')
def handle_message(data):
    print(f"Received message: {data}")
    emit('message', data, broadcast=True)

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")
