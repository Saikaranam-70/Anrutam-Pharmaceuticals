//Imports---------------------------
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv')
const bodyparser = require('body-parser')

const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes')
const doctorRoutes = require('./routes/doctorRoutes')



const app = express()


dotEnv.config();
app.use(cors());
app.use(bodyparser.json())

app.use('/appointments', appointmentRoutes);
app.use('/user', userRoutes)
app.use('/doctors', doctorRoutes)



const PORT = 5000;




//Database Connection --------------
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database connected successfully")
}).catch((error)=>console.log(error))

//Routes----------------


//PORT SETUP----------------------
app.listen(PORT, (req, res)=>{
    console.log(`Server started and running at ${PORT}`)
})

//Main Path------------------------
app.use('/', (req, res)=>{
    res.send("<h1>HELLO</H1>")
})