const express = require('express');
const app = express();
const cors = require('cors');
const { connectDatabase } = require('./config/connectDatabase');
const { userRouter } = require('./routes');
require('dotenv').config({
    path:'./config/.env'
});
const port = process.env.PORT || 8080;
connectDatabase()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`server is running`);
})