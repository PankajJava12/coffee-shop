const mongoose = require('mongoose');

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

async function initDatabase() {
    const mongoConnectionURI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    
    try {
        return mongoose.connect(mongoConnectionURI);
    } catch (e) {
        console.log('Error while connecting to mongodb', e);
    }
}

module.exports = {
    initDatabase
}