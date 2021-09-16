const socket=io('http://localhost:5000')

//intial handshake
socket.on('messageFromServer',(dataFromServer)=>{
    console.log(dataFromServer)
    socket.emit('messageFromClient',{data:"Hi server this is client"})
})

document.getElementById('message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage=document.getElementById('user-message').value
    socket.emit('messageToServer',{text:newMessage})
    document.getElementById('user-message').value=''
})

//on receiveng any mssg from the server
socket.on('messageToClient',(msg)=>{
    document.getElementById('message-list').innerHTML+=`<li>${msg.text}</li>`
})