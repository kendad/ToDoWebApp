
document.querySelectorAll('.see-notes').forEach((item)=>{
    item.addEventListener('click',(event)=>{
        var xhttp=new XMLHttpRequest()
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            document.getElementById('notes-container').innerHTML=this.responseText
        }
    }
    xhttp.open('GET',"/note/"+item.value,true)
    xhttp.send()
    })
})

window.onload=function(){
    if(window.localStorage.getItem("noteID")!==null){
        var note_id=window.localStorage.getItem("noteID")
    }else{
        note_id=document.querySelectorAll('.see-notes')[0].value
    }
    var xhttp=new XMLHttpRequest()
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            document.getElementById('notes-container').innerHTML=this.responseText
        }
    }
    document.cookie="NoteID="+note_id
    xhttp.open('GET',"/note/"+note_id,true)
    xhttp.send()
}

document.querySelectorAll('.see-notes').forEach((item)=>{
    item.addEventListener('click',(event)=>{
       if(window.localStorage.getItem("noteID")!==null){
           window.localStorage.removeItem("removeID")
       }
       window.localStorage.setItem("noteID",item.value)
       document.cookie="NoteID="+item.value
    })
})
