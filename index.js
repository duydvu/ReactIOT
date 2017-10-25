var express = require('express');
var { Pool, Client } = require('pg');
var httpProxy = require('http-proxy');

var app = express();
var pool = new Pool({
  user: "swkcgdxapapojz",
  password: "e2f595b6946c021e1f2ce02cd3852cdce6a5e391aa358e5ebc204dc3aa158e54",
  database: "d34l4ng8fd8g0a",
  port: 5432,
  host: "ec2-23-23-249-169.compute-1.amazonaws.com",
  ssl: true
}); 

const proxy = httpProxy.createProxyServer();
const isProduction = process.env.NODE_ENV === 'production';
const port = 3000;

// create Proxy to 8080 on development
if (!isProduction) {
  console.log('Build on development!');
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });
}
else {
  console.log('Build on production!');
}

app.set('port', (process.env.PORT || port));

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index', {
    title: 'React Internet of things'
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/db', function (req, res) {
  pool.query('SELECT * from Device', (err, re) => {
    res.send(re.rows);
  })

});

app.post('/insert', function(req, res) {
  const query = 'INSERT INTO Device(ID, name, latitude, longitude, status) VALUES($1, $2, $3, $4, $5)';
  const body = req.body;
  const values = [body.id, body.name, body.latitude, body.longitude, body.status];

  // callback
  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to insert data!');
    } else {
      res.send('Successfully inserted data!');
    }
  })
})

app.post('/delete', function(req, res) {
  const query1 = 'DELETE FROM PowerConsumption WHERE ID = $1';
  const query2 = 'DELETE FROM Device WHERE ID = $1';
  const body = req.body;
  const values = [body.id];

  // callback
  pool.query(query1, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to delete data!');
      return;
    } else {
   
      pool.query(query2, values, (err, _res) => {
        if (err) {
          console.log(err.stack);
          res.send('Failed to delete data!');
        } else {
          res.send('Successfully deleted data!');
        }
      });
    
    }
  })

})

app.post('/update', function(req, res) {
  const query1 = 'INSERT INTO PowerConsumption(ID, consumption, time) VALUES($1, $5, $6)';
  const query2 = 'UPDATE Device SET latitude = $2, longitude = $3, status = $4 WHERE ID = $1';
  const body = req.body;
  const values = [body.id, body.latitude, body.longitude, body.status, body.consumption, body.time];

  // callback
  pool.query(query1, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to update data!');
      return;
    } else {
   
      pool.query(query2, values, (err, _res) => {
        if (err) {
          console.log(err.stack);
          res.send('Failed to update data!');
        } else {
          res.send('Successfully updated data!');
        }
      });
    
    }
  })

})

