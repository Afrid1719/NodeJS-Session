const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();

const User = require('./models/user');

const DB_URI = 'mongodb://127.0.0.1:27017/sessions';

mongoose.connect(DB_URI)
    .then(res => {
        app.listen(5000, () => {
            console.log('Listening on port 5000');
        });
    });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

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

app.get(['/', '/login'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.post('/register', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    
    User.find({username: username}, function(err, doc){
        if (err) return res.status(500, 'Something went wrong!');
        if (doc) return res.status(500, 'User already exists!');
    });

    bcrypt.hash(req.body.password, 6, function(err, hash) {
        if (err) return res.status(500, 'Something went wrong!');
        
        let user = new User({
            name: name,
            username: username,
            password: hash
        });

        user.save(function(err, res) {
            if (err) return res.status(500, 'Something went wrong!');        
        });
    });

    res.redirect(301, '/login');
})

app.post('/login', (req, res) => {
    let { username, password } = req.body;

    User.findOne({username: username}, function(err, user) {
        if (err) return res.status(401, 'Invalid credentials');

        bcrypt.compare(password, user.password, function(err, result) {
            if (err) return res.status(500, 'Something went wrong!');

            if (result) return res.send('Success');
            else return res.send('Invalid credentials!')
        })
    })
})