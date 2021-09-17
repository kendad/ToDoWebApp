const express = require('express')
const axios = require('axios')
const app = express()
const path=require('path')
const cookieParser=require('cookie-parser')
const MongoClient=require('mongodb').MongoClient

const cors=require('cors')
const socketio=require('socket.io')

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'views')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({credentials: true, origin: true}))

//UNIVERSAL VALUES
const api_url='http://localhost:8000/api/v1/'
const mongo_url='mongodb+srv://ken:ken12345678@cluster0.h0xcl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

//Open MongoDb Connection
var database=null
MongoClient.connect(mongo_url, function(err, db) {
    if (err) throw err;
    database=db.db("chat")
  });


//HOME
app.get('/', (req,res)=>{
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

//TASK
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

//NOTE
app.get('/note/:TaskID/',(req,res)=>{
    axios.get(api_url+'note/'+req.params.TaskID,
    {
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{

       res.render('html/note',{'jsonData':response.data},(err,html)=>{
           res.send(html)
       })
    }).catch((err)=>{
        console.log(err)
    })
})

app.post('/add-note/:TaskID/',(req,res)=>{
    axios.post(api_url+'note/'+req.params.TaskID,
    {
        'title':req.body.title,
        'description':req.body.description
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

app.get('/edit-note/:NoteID/',(req,res)=>{
    axios.get(api_url+'edit-note/'+req.params.NoteID,
    {
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
       res.render('html/edit-note',{'jsonData':response.data})
    }).catch((err)=>{
        console.log(err)
    })
})

app.post('/edit-note/:NoteID/',(req,res)=>{
    axios.patch(api_url+'edit-note/'+req.params.NoteID,
    {
        'title':req.body.title,
        'description':req.body.description,
        'section':req.body.section
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

app.post('/delete-note/:NoteID',(req,res)=>{
    axios.delete(api_url+'edit-note/'+req.params.NoteID,
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
        res.cookie('Username',req.body.username)
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
        res.cookie('Username',req.body.username)
        res.redirect('/')
    }).catch((err)=>{
        res.redirect('/register')
    })
})

const expressServer=app.listen(process.env.PORT||5000)
const io=socketio(expressServer)

io.on('connection',(socket)=>{
    //get the noteID to create the room
    var result=null
    var room_id=null
    test_string=socket.handshake.headers.cookie.split(';')
    test_string.forEach((data)=>{
        if(data.match(/NoteID=/g)!==null){
            result=data
        }
    })
    if(result==null){
        room_id=null
    }else{
        room_id=result.substring(result.indexOf('=')+1)
    }

    //Get the TokeID to know who's the user
    var result=null
    var senders_id=null
    test_string=socket.handshake.headers.cookie.split(';')
    test_string.forEach((data)=>{
        if(data.match(/Token=/g)!==null){
            result=data
        }
    })
    if(result==null){
        senders_id=null
    }else{
        senders_id=result.substring(result.indexOf('=')+1)
    }

    socket.join(room_id)
    
    //intial handshake
    io.to(room_id).emit('messageFromServer','this is from server')
    socket.on('messageFromClient',(msg)=>{

        //Retreive the chat history from mongodb
        try {
            database.collection(room_id).find({}).toArray((err,result)=>{
                io.to(room_id).emit('chatHistory',{chatHistory:result})
            })
        } catch (error) {
            console.log(error)
        }
        console.log(msg)
    })
    
    //message received from clients
    socket.on('messageToServer',(msg)=>{
        
        //mongoDB
        //check if collection exists
        database.listCollections().toArray((err,info)=>{
            var collection_names=[]
            if(info.length===0){
                return
            }else{
                info.forEach((data)=>{
                    collection_names.push(data.name)
                })
            }
            //if collection not exist create anew
            if(collection_names.length===0 || collection_names.includes(room_id)===false){
                database.createCollection(room_id,(err,res)=>{
                    if(err) throw err;
                    console.log("new Collection created")
                })
            }
        })

        //once the collection is verfied enter the data
        database.collection(room_id).insertOne({message:msg.text,username:msg.username})

        //socket
        io.to(room_id).emit('messageToClient',{text:msg.text,sendersID:senders_id,otherUsername:msg.username})
    })

    //image received from clients
    socket.on('imageFromClient',(img)=>{
        //mongoDB
        //check if collection exists
        database.listCollections().toArray((err,info)=>{
            var collection_names=[]
            if(info.length===0){
                return
            }else{
                info.forEach((data)=>{
                    collection_names.push(data.name)
                })
            }
            //if collection not exist create anew
            if(collection_names.length===0 || collection_names.includes(room_id)===false){
                database.createCollection(room_id,(err,res)=>{
                    if(err) throw err;
                    console.log("new Collection created")
                })
            }
        })

        //once the collection is verfied enter the data
        database.collection(room_id).insertOne({image:img.imageData,username:img.username})
        io.to(room_id).emit('imageFromServer',{image:img})
    })
})