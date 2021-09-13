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

app.get('/sample-form',(req,res)=>{
    res.render('html/sample_form.ejs',{'kela':''})
})

app.post('/sample-form',(req,res)=>{

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
        //res.send(response.data)
        res.render('html/sample_form',{'kela':response.data.key})
    }).catch((err)=>{
        console.log(err)
    })

    //res.render('html/sample_form.ejs',{'kela':req.body})
})

app.get('/sample-ajax',(req,res)=>{
    res.render('html/sample-ajax.ejs')
})

app.get('/sample-ajax-kela', async (req,res)=>{
    axios.get(api_url,{
        headers:{
            'Authorization':'Token d46c29adcec96b2370f1080d52f49c8c81105ac1'
        }
    }).then((response)=>{
        //res.send(response.data)
        res.render('html/kela_ajax.ejs',{'jsonData':response.data},(err,html)=>{
            res.send(html)
        })
    }).catch((err)=>{
        console.log(err)
    })

})


app.listen(process.env.PORT||5000)