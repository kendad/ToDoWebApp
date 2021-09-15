
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
