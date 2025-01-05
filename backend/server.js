//mongoDb
require('./config/db')


const app = require('express')();
const port = 5000;
const cors = require('cors');
const userRouter=require('./api/User');
const roomRouter=require('./api/Room');
//for accepting post form data
const bodyParser=require('express').json;
app.use(bodyParser());
app.use(cors());
app.use('/user',userRouter)
app.use('/room',roomRouter)
// Allow CORS so that backend and frontend could be put on different servers

app.listen(port,()=>{
    console.log(`Server Running on Port ${port}`);
})

