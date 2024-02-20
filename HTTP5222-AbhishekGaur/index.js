/**I am gonna make 
 * a website on the 
 * Recipe Blog
 * Where I am using EJS as view engine
 * BootStrap as CSS styling framework
 */
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash =require("connect-flash");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3500;

app.use(express.urlencoded( { extended: true} ));
app.use(express.static("public"));
app.use(expressLayouts);


app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}))
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./backEnd/routes/recipeRoute.js');
app.use('/', routes);

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})