var express = require('express');
var pg = require('pg');

var app = express();
var client = new pg.Client({
  user: "swkcgdxapapojz",
  password: "e2f595b6946c021e1f2ce02cd3852cdce6a5e391aa358e5ebc204dc3aa158e54",
  database: "d34l4ng8fd8g0a",
  port: 5432,
  host: "ec2-23-23-249-169.compute-1.amazonaws.com",
  ssl: true
}); 

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

app.get('/db', function (req, res) {
  client.connect();
  client.query('SELECT * from test_table', (err, re) => {
    res.send(re);
    client.end();
  })

});
