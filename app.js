const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const PORT = process.env.port || 5555;

const navbar = [
    {
        Text: 'Home',
        Link: '/'
    }, {
        Text: 'Magasins',
        Link: '/magasins'
    }, {
        Text: 'Panier',
        Link: '/panier'
    }, {
        Text: 'Sign in / Sign up',
        Link: '/auth'
    }
];

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pfa_ecommerce"
});

con.connect((err) => {
    if(err)
        throw err;
    console.log("DB connected...");
});

app.use('/libs', express.static(__dirname + '/libs'));
app.use('/images', express.static(__dirname + '/images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'mall',
    saveUninitialized: false,
    resave: false
}));
require('./src/config/passport')(con, app);
app.use(bodyParser.json());
app.set('views', './src/views');
app.set('view engine', 'ejs');

const indexRouter = require('./src/routes/indexRoutes')(con, navbar);
const authRouter = require('./src/routes/authRoutes')(con, navbar);
const magasinsRouter = require('./src/routes/magasinsRoutes')(con, navbar);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/magasins', magasinsRouter);


app.get('/', (req,res) => {
    res.render('index', {
        nav: navbar,
        req: req
    });
});

app.listen(PORT, err => {
    if(!err) {
        console.log("Server running on port: " + PORT);
    }
});