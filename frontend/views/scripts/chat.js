const socket=io('http://localhost:5000')

//intial handshake
socket.on('messageFromServer',(dataFromServer)=>{
    console.log(dataFromServer)
    socket.emit('messageFromClient',{data:"Hi server this is client"})
})

document.getElementById('message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage=document.getElementById('user-message').value
    socket.emit('messageToServer',{text:newMessage,username:getCookie("Username")})
    document.getElementById('user-message').value=''
})

//on receiveng any mssg from the server
socket.on('messageToClient',(msg)=>{
    if(msg.sendersID===getCookie("Token")){
        // document.getElementById('message-list').innerHTML+=`<li> ${getCookie("Username")}: ${msg.text}</li>`
        document.getElementById('chat-container').innerHTML+=`<div class="my-message d-flex align-items-center push-left">
        <img src="./icons/cute-pumpkin.png" class="img-fluid other-side-messsage-icon">
        <p class="my-message-text">${getCookie("Username")}: ${msg.text}</p> </div>`
        
    }else{
        // document.getElementById('message-list').innerHTML+=`<li> ${msg.otherUsername}: ${msg.text}</li>`
        document.getElementById('chat-container').innerHTML+=`<div class="other-side-message d-flex align-items-center">
        <img src="./icons/cute-hamster.png" class="img-fluid other-side-messsage-icon">
        <p class="other-side-message-text">${msg.otherUsername}: ${msg.text}</p> </div>`
        
    }
    document.getElementById('chat-container').scrollTop=document.getElementById('chat-container').scrollHeight
})

//Sending Images
document.getElementById('send-data').addEventListener('change',(event)=>{
    var imageFile=event.target

    var reader=new FileReader()

     reader.onload = function(){
      var dataURL = reader.result;
    socket.emit('imageFromClient',{imageData:dataURL,username:getCookie("Username")})
    };

    reader.readAsDataURL(imageFile.files[0])
})

//On Receiveing image from the server
socket.on('imageFromServer',(image)=>{
    if(image.image['username']===getCookie("Username")){
        document.getElementById('chat-container').innerHTML+=`<div class="my-message-image d-flex align-items-center push-left">
        <img src="./icons/cute-pumpkin.png" class="img-fluid other-side-messsage-icon">
        <img src="${image.image['imageData']}" class="img-fluid img-thumbnail" title="${image.image['username']}">
    </div>`
    
    }else{
        document.getElementById('chat-container').innerHTML+=`<div class="my-message-image d-flex align-items-center">
        <img src="./icons/cute-hamster.png" class="img-fluid other-side-messsage-icon">
        <img src="${image.image['imageData']}" class="img-fluid img-thumbnail" title="${image.image['username']}">
    </div>`
    
    }
    document.getElementById('chat-container').scrollTop=document.getElementById('chat-container').scrollHeight
})

//On receiving Chat History from the server
socket.on('chatHistory',(msg)=>{
    msg.chatHistory.forEach((data)=>{
        if("message" in data){
            // document.getElementById('message-list').innerHTML+=`<li> ${data.username}: ${data.message}</li>`
            if(data['username']===getCookie("Username")){
                document.getElementById('chat-container').innerHTML+=`<div class="my-message d-flex align-items-center push-left">
        <img src="./icons/cute-pumpkin.png" class="img-fluid other-side-messsage-icon">
        <p class="my-message-text">${data.username}: ${data.message}</p> </div>`
        
            }else{
                document.getElementById('chat-container').innerHTML+=`<div class="other-side-message d-flex align-items-center">
        <img src="./icons/cute-hamster.png" class="img-fluid other-side-messsage-icon">
        <p class="other-side-message-text">${data.username}: ${data.message}</p> </div>`
        
            }
        }
        if("image" in data){
            if(data['username']===getCookie("Username")){
                document.getElementById('chat-container').innerHTML+=`<div class="my-message-image d-flex align-items-center push-left">
                <img src="./icons/cute-pumpkin.png" class="img-fluid other-side-messsage-icon">
                <img src="${data.image}" class="img-fluid img-thumbnail" title="${data.username}">
            </div>`
            
            }else{
                document.getElementById('chat-container').innerHTML+=`<div class="my-message-image d-flex align-items-center">
                <img src="./icons/cute-hamster.png" class="img-fluid other-side-messsage-icon">
                <img src="${data.image}" class="img-fluid img-thumbnail" title="${data.username}">
            </div>`
            
            }
        }
        
    })
    document.getElementById('chat-container').scrollTop=document.getElementById('chat-container').scrollHeight
})

//Function from W3School to get cookie by KEY
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }