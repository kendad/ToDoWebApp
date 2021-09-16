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

//Sending Images
document.getElementById('send-data').addEventListener('change',(event)=>{
    var imageFile=event.target

    var reader=new FileReader()

     reader.onload = function(){
      var dataURL = reader.result;
    socket.emit('imageFromClient',{imageData:dataURL})
    };

    reader.readAsDataURL(imageFile.files[0])
})

//On Receiveing image from the server
socket.on('imageFromServer',(image)=>{
    var image_container=document.getElementById('image-container')
    image_tag=document.createElement('img')
    image_tag.src=image.image['imageData']
    image_container.appendChild(image_tag)
})