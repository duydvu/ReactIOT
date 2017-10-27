var express = require('express');
var { Pool, Client } = require('pg');
var httpProxy = require('http-proxy');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var passport = require('passport');

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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
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
  
  pool.query("SELECT id, name, location, status, array_agg(consumption) AS consumption, array_agg(time) AS time FROM device INNER JOIN power ON id = device_id WHERE time >= now() - interval '1 day' GROUP BY id ORDER BY id", 
  (err, _res) => {

    if (err) {
      console.log(err.stack);
      res.send('Failed to fetch data!');
      return;
    } else {
      res.send(_res.rows);
    }
    
  });

});

app.get('/insert/:id-:name-:location-:status-:consumption-:year.:month.:day.:hour.:minute.:second', function(req, res) {
  const query1 = 'INSERT INTO device(id, name, location, status) VALUES($1, $2, $3, $4)';
  const query2 = 'INSERT INTO power(id, consumption, time) VALUES($1, $2, $3)';
  const body = req.params;
  const time = `${body.year}-${body.month}-${body.day} ${body.hour}:${body.minute}:${body.second}`;
  const values1 = [body.id, body.name, body.location, body.status];
  const values2 = [body.id, body.consumption, time];

  // callback
  pool.query(query1, values1, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to insert data!');
      return;
    } else {

      pool.query(query2, values2, (err, _res) => {
        if (err) {
          console.log(err.stack);
          res.send('Failed to insert data!');
        } else {
          res.send('Successfully inserted data!');
        }
      });

    }
  })
})

app.get('/delete/:id', function (req, res) {
  const query1 = 'DELETE FROM power WHERE id = $1';
  const query2 = 'DELETE FROM device WHERE id = $1';
  const body = req.params;
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

app.get('/update/:id-:name-:location-:status-:consumption-:year.:month.:day.:hour.:minute.:second', function (req, res) {
  const query1 = 'UPDATE device SET name = $2, location = $3, status = $4 WHERE id = $1';
  const query2 = 'INSERT INTO power(id, consumption, time) VALUES($1, $2, $3)';
  const body = req.params;
  const time = `${body.year}-${body.month}-${body.day} ${body.hour}:${body.minute}:${body.second}`;
  const values1 = [body.id, body.name, body.location, body.status];
  const values2 = [body.id, body.consumption, time];

  // callback
  pool.query(query1, values1, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to update data!');
      return;
    } else {

      pool.query(query2, values2, (err, _res) => {
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

app.post('/switch', function(req, res) {
  const query = 'UPDATE device SET status = $2 WHERE id = $1';
  const body = req.body.data;console.log(body);
  const values = [body.id, body.status];

  // callback
  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to update data!');
    } else {
      res.send('Successfully updated data!');
    }
  });
  
})