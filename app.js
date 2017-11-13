const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
var models = require('./models');
const routes = require('./routes/index');
const bodyparser = require('body-parser');

var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);


models.db.sync({})
.then(function () {
    // make sure to replace the name below with your express app
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use('/', routes);
app.use(express.static('views'));

