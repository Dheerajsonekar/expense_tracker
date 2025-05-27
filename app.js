const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();
const frontendPath = path.join(__dirname,'./frontend');


const db = require('./config/database');
const user = require('./models/user');
const todo = require('./models/Todo');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

const forgetPasswordRoutes = require('./routes/forgetPasswordRoutes');

const expense = require('./models/Expense');
const expenseRoutes = require('./routes/expenseRoutes');

const order = require('./models/order');
const paymentRoutes = require('./routes/paymentRoutes');

const leaderboardRoutes = require('./routes/leaderboardRoutes');







app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", 
        "https://cdn.jsdelivr.net",
        "https://sdk.cashfree.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", 
        "https://fonts.googleapis.com"
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'self'", "https://sdk.cashfree.com"],
      connectSrc: ["'self'", "https://sdk.cashfree.com"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flag: 'a'});

app.use(morgan('combined', {stream: accessLogStream} ));

app.use(express.json());
app.use(cors());
app.use(express.static(frontendPath));

app.get('/', (req, res)=>{
    res.sendFile(path.join(frontendPath, 'forms', 'index.html'));
})
app.get('/forget-password', (req, res)=>{
    res.sendFile(path.join(frontendPath, 'forms', 'forgetPassword.html'));
})

app.get('/pdf', (req, res) => {
  res.sendFile(path.join(frontendPath, 'forms', 'pdf.html'));
});


app.use('/api', userRoutes);
app.use('/api', forgetPasswordRoutes);
app.use('/api', todoRoutes);
app.use('/api', expenseRoutes);
app.use('/api', paymentRoutes);
app.use('/api', leaderboardRoutes);


//Assosiation
user.hasMany(todo, {foreignKey: 'userId',  onDelete: 'CASCADE'});
todo.belongsTo(user, {foreignKey: 'userId'});

user.hasMany(expense, {foreignKey: 'userId', onDelete:'CASCADE'});
expense.belongsTo(user, {foreignKey: 'userId'});

user.hasMany(order, {foreignKey: 'userId', onDelete:'CASCADE'});
order.belongsTo(user, {foreignKey: 'userId'});


db.sync(
    {alter:true}
).then(()=>{
    console.log('database connected ');
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running  ${process.env.PORT}`)
    })
}).catch(err=>{
    console.log("error in database connection: ", err);
})

