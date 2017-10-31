var fs = require('fs');
var express = require('express');
var https = require('https');
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
const port = process.env.PORT || 3000;

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


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(port, function() {
  console.log('Node app is running on port', app.get('port'));
});

const io = require('socket.io')(app);


app.get('/', function (request, response) {
  response.render('pages/index', {
    title: 'React Internet of things'
  })
});

app.get('/db', function (req, res) {
  const query1 = "SELECT id, name, location, status, final.consumption, final.time FROM device INNER JOIN (select power.device_id, array_agg(power.consumption) as consumption, array_agg(power.time) as time from power inner join (select device_id, array_agg(time order by time desc) as time from power group by device_id) as grouped on grouped.device_id = power.device_id and array_position(grouped.time, power.time) between 1 and 3 group by power.device_id) as final ON device.id = final.device_id ORDER BY id";
  const query2 = "SELECT * from device";
  pool.query(query2, 
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


io.on('connection', function (socket) {
  socket.emit('connect', { message: 'connected!' });
  socket.on('insertDevice', function (body) {
      const query = 'INSERT INTO device(id, name, location, status) VALUES($1, $2, $3, $4)';
      const values = [body.id, body.name, body.location, body.status];

      // callback
      pool.query(query, values, (err, _res) => {
        if (err) {
          console.log(err.stack);
        } else {
              console.log('Successfully insert device!');
        }
      });

  });

  socket.on('insertPower', function (body) {
    const query = 'INSERT INTO power(id, consumption, time) VALUES($1, $2, $3)';
    const time = `${body.year}-${body.month}-${body.day} ${body.hour}:${body.minute}:${body.second}`;
    const values = [body.id, body.consumption, time];

    // callback
    pool.query(query, values, (err, _res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log('Successfully insert power!');
      }
    });

  });

  socket.on('update', function (body) {

    socket.broadcast.emit('connect', { body: body });

  });

  socket.on('switch', function (body) {

    console.log(body);
    socket.broadcast.emit('switch', { body: body });

  });


});