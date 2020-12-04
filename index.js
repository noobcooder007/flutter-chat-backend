const express = require('express');
const path = require('path');
require('dotenv').config();

require('./database/config').dbConnection();

const app = express();
app.use(express.json());

const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./services/socket');

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.use('/api/login', require('./routes/auth'));

server.listen(process.env.PORT, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log('listen on port', process.env.PORT);
});