const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config({
    path:'./config/.env'
});