var socket = io.connect('http://127.0.0.1:5000/');
let chatroom_id="abd2233"
let token='token'
socket.on('connect', () => {
    socket.emit(JSON.stringify({'socket_message':'Successfull connection!'}))
    message=document.createElement('h5')
    message.innerHTML='Welcome user!'
    document.getElementById('chat_box').appendChild(message)
})
socket.on('connect_ACK',()=>{
    socket.emit('connection_token',JSON.stringify({'socket_message':token}))
    message=document.createElement('h5')
    message.innerHTML='Connection successfull!'
    document.getElementById('chat_box').appendChild(message)
})

socket.on('message',(data)=>{
    response_data=JSON.parse(data)
    parsed_message=response_data['user_message']
    message=document.createElement('h7')
    message.innerHTML=parsed_message
    document.getElementById('chat_box').appendChild(message)
})
document.getElementById('chat_submit_button').addEventListener('click',()=>{
    event.preventDefault()
    message_input=document.getElementById('message_input')
    message_text=message_input.value;
    console.log('sending message '+message_text)
    socket.emit('message',JSON.stringify({'user_message':message_text,'user_chatroom':"abd2233"}))
    message_input.value=''
})