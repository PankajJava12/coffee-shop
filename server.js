const dotenv = require('dotenv');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const itemRoutes = require('./routes/item');

// config to use .env for environment variables
dotenv.config();
const port = process.env.NODE_SERVER_PORT

app.use(bodyParser.json()) // for parsing application/json

app.use('/api', itemRoutes);

// Error Handling
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    
    if (err.code === 11000) {
        res.json({ error: 'Item already exist' });
    }

    res.json({ error: err.message });
});

const { initDatabase } = require('./config/dbconn.js');

// initiate the database and start the web server
initDatabase().then(() => {
    app.listen(port, () => {
        console.log(`node server listening at http://localhost:${port}`);
        console.log(`You will be notify here once order will be ready`)
    })
});

app.use(function (req, res) {
    res.status(404).send('Api does not exist, please check uri');
});
