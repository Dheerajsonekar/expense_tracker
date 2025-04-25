const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const user = require('./models/user');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/registration', userRoutes);





db.sync().then(()=>{
    console.log('database connected ');
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on ${process.env.PORT}`)
    })
}).catch(err=>{
    console.log("error in database connection: ", err);
})

