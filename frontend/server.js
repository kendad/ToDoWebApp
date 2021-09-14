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

app.get('/', async (req,res)=>{
    axios.get(api_url,{
        headers:{
            'Authorization':'Token '+req.cookies['Token']
        }
    }).then((response)=>{
        //res.send(response.data)
        res.render('html/index',{'jsonData':response.data})
        console.log(response.data)
    }).catch((err)=>{
        console.log(err)
    })

})


app.listen(process.env.PORT||5000)