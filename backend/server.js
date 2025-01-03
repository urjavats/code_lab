//mongoDb
require('./config/db')


const app = require('express')();
const port = 3000;

const userRouter=require('./api/User');
//for accepting post form data
const bodyParser=require('express').json;
app.use(bodyParser());

app.use('/user',userRouter)

app.listen(port,()=>{
    console.log(`Server Running on Port ${port}`);
})