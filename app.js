const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const request = require('request-promise');
const bodyParser = require('body-parser');
const app = express();

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
} = process.env;

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,{ useNewUrlParser: true });

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// Cities
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true}));

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);

const citySchema = new mongoose.Schema({
    name : String 
});

const cityModel = mongoose.model('City', citySchema);


async function getWeather(cities) {
    const weather_data = [];

    for (const city_obj of cities) {
        const city = city_obj.name;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;

        const response_body = await request(url);

        const weather_json = JSON.parse(response_body);

        const weather = {
            city : city,
            temperature : Math.round(weather_json.main.temp),
            description : weather_json.weather[0].description,
            icon : weather_json.weather[0].icon
        };

        weather_data.push(weather);
    }

    return weather_data;
}


app.get('/', function(req, res) {

    cityModel.find({}, function(err, cities) {

        getWeather(cities).then(function(results) {

          const weather_data = {weather_data : results};

            res.render('weather', weather_data);

        });

    });      

});

app.post('/', function(req, res) {

  const newCity = new cityModel({name : req.body.city_name});
    newCity.save();

    res.redirect('/');

});



app.listen(5000);