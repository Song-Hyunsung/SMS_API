var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var admin = require('firebase-admin');
let  serviceAccount =  process.env.FIREBASE_API_KEY;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});


import IndexMiddleWare, * as indexRouter from './routes/index';
import * as usersRouter from './routes/users';
import * as testAPIRouter from './routes/testAPI';
import CreateSessionController from './routes/createSession';
import AddStockToSessionController from './routes/addStocksToSession';
import { SetupService } from './routes/setupService';




var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var setupService = new SetupService();
var createSessionController = new CreateSessionController(setupService);
var addStockToSessionController = new AddStockToSessionController(setupService);

const cors = require('cors');
const corsOptions = {
	origin: 'https://aqueous-sands-65858.herokuapp.com',
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.options('*', cors());

app.use('/', indexRouter.default);

app.use('/users', usersRouter.default);

app.use("/testAPI", testAPIRouter.default);

app.use("/createSession", createSessionController.router);

app.use("/addStocks", addStockToSessionController.router)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

console.log("5");



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

console.log("5");


export = app;
