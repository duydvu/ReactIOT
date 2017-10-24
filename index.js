var express = require('express');
var pg = require('pg');

var app = express();
var client = new pg.Client({
  connectionString: 'postgres://swkcgdxapapojz:e2f595b6946c021e1f2ce02cd3852cdce6a5e391aa358e5ebc204dc3aa158e54@ec2-23-23-249-169.compute-1.amazonaws.com:5432/d34l4ng8fd8g0a',
})

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

console.log(process.env.DATABASE_URL);

app.get('/db', function (req, res) {
  client.query('SELECT * from test_table', (err, res) => {
    console.log(err, res);
    client.end();
  })

});
