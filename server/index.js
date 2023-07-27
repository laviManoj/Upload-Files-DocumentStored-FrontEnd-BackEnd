const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose') 
const cors = require('cors');
const crypto = require('crypto');

const routes = require('./routes/FileUpload')

const app = express();
const PORT = 5000;
// const url = 'mongodb://127.0.0.1:27017/ServerBank'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(cors());

app.use('/', routes);

app.listen(PORT, function(err) {
    if(err) throw err;
    console.log("Server Listening on Port", PORT)
})