const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const frontendPath = path.join(__dirname,'../frontend');





const db = require('./config/database');
const user = require('./models/user');
const todo = require('./models/Todo');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');


app.use(express.json());
app.use(cors());
app.use(express.static(frontendPath));

app.get('/', (req, res)=>{
    res.sendFile(path.join(frontendPath, 'forms', 'index.html'));
})


app.use('/api', userRoutes);
app.use('/api', todoRoutes);

//Assosiation
user.hasMany(todo, {foreignKey: 'userId',  onDelete: 'CASCADE'});
todo.belongsTo(user, {foreignKey: 'userId'});




db.sync({ alter: true }).then(()=>{
    console.log('database connected ');
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on ${process.env.PORT}`)
    })
}).catch(err=>{
    console.log("error in database connection: ", err);
})

