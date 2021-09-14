const express = require('express')
const axios = require('axios')
const app = express()
const path=require('path')
const cookieParser=require('cookie-parser')

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'views')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

api_url='http://localhost:8000/api/v1/'

//HOME
app.get('/', async (req,res)=>{
    axios.get(api_url,{
        headers:{
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
        res.render('html/index',{'jsonData':response.data})
    }).catch((err)=>{
        res.redirect('/login')
    })

})

//EDIT-TASK
app.get('/edit-task/:TaskID',(req,res)=>{
    
    var users_list=null

    axios.get(api_url+'users-list/',{
        headers:{
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
       users_list=response.data
    }).catch((err)=>{
        res.redirect('/login')
    })

    axios.get(api_url+'edit-task/'+req.params.TaskID,{
        headers:{
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
        res.render('html/edit-task',{'jsonData':response.data,'TaskID':req.params.TaskID,'usersList':users_list})
    }).catch((err)=>{
        res.redirect('/login')
    })
})

app.post('/add-task',(req,res)=>{
    axios.post(api_url,
    {
        'title':req.body.title,
    },
    {
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})

app.post('/edit-task/:TaskID/:ownersID',(req,res)=>{

    try {
        var owners_list_updated=req.body['users-list']
        var owners_list_original=req.params.ownersID.split(',')
        var owner=[...owners_list_updated,...owners_list_original]
    } catch (error) {
        var owner=req.params.ownersID.split(',')
    }

    axios.patch(api_url+'edit-task/'+req.params.TaskID,
    {
        'title':req.body.title,
        'owner':owner
    },
    {
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})

app.post('/delete-task/:TaskID',(req,res)=>{

    axios.delete(api_url+'edit-task/'+req.params.TaskID,
    {
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})


//LOGIN
app.get('/login',(req,res)=>{
    res.render('html/login')
})

app.post('/login',(req,res)=>{
    axios.post(api_url+'auth/login/',
    {
        'username':req.body.username,
        'password':req.body.password
    },
    {
        headers:{
            'Content-Type':'application/json'
        }
    }).then((response)=>{
        res.cookie('Token',response.data.key)
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})

//REGISTER
app.get('/register',(req,res)=>{
    res.render('html/register')
})

app.post('/register',(req,res)=>{
    axios.post(api_url+'auth/register/',
    {
        'username':req.body.username,
        'email':req.body.email,
        'password1':req.body.password1,
        'password2':req.body.password2,
    },
    {
        headers:{
            'Content-Type':'application/json'
        }
    }).then((response)=>{
        res.cookie('Token',response.data.key)
        res.redirect('/')
    }).catch((err)=>{
        res.redirect('/register')
    })
})

app.listen(process.env.PORT||5000)