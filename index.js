const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

const DB_URI = 'mongodb://127.0.0.1:27017/sessions';

mongoose.connect(DB_URI)
    .then(res => {
        app.listen(5000, () => {
            console.log('Listening on port 5000');
        });
    });

const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'mySessions'
});

app.use(session({
    secret: 'Multiverse is real',
    saveUninitialized: false,
    resave: false,
    store: store
}));

app.get('/', (req, res) => {
    req.session.isAuth = true;
    res.status(200).send('Here\'s your gift')
});