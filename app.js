const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 5000;
//const bodyParser = require('body-parser');
const moment = require('moment')
app.locals.moment = moment;

// template engine  
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))
app.set('views', path.join(__dirname, 'views'));

app.set('view engine','ejs')

app.use(express.urlencoded({ extended: true }));
app.use('/',require('./routes/news'))

app.set('views','./views')

//Routes pages in  front-end to view   

app.get('/', (req, res) => {
  res.render('news');
});

app.get('/aboutus', (req, res) => {
  res.render('aboutus');
});

app.get('/weather', (req, res) => {
  res.render('weather');
});

app.get('/tvchannel', (req, res) => {
  res.render('tvchannel');
});


app.listen(port,()=> console.log("server is started !"))