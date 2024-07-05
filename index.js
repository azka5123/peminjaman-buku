const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const routes = require('./routes');
const api = require('./routes/api/api');

const envFiles = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFiles });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
    .use(expressLayouts)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .set('layout', 'layouts/layout');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

app.use('/', api);

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;