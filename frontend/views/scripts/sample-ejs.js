const Button = document.getElementById("ajax-button")

Button.addEventListener('click',(event)=>{
    var xhttp=new XMLHttpRequest()
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            document.getElementById('ajax-container').innerHTML=this.responseText
        }
    }
    xhttp.open('GET',"/sample-ajax-kela",true)
    xhttp.send()
})