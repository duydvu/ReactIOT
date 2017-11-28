var express = require('express');
var socketio = require('socket.io');
var https = require('https');
var { Pool, Client } = require('pg');
var httpProxy = require('http-proxy');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var passport = require('passport');
var mqtt = require('mqtt');

var client = mqtt.connect({
  host: 'm14.cloudmqtt.com',
  port: 11486,
  username: 'ohkpjxcf',
  password: '_3KWZeUTV7qe'
})

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

const io = socketio(
  app.listen(port, function () {
    console.log('Node app is running on port', port);
  })
);

app.get('/', function (request, response) {
  response.render('pages/index', {
    title: 'React Internet of things'
  })
});

app.get('/db/:id', function (req, res) {
  const query = "select device.id, name, status, room_id, room_name from device inner join (select rooms.id, rooms.name as room_name from rooms inner join users on users.id=user_id and users.id=$1) as news on news.id=room_id;";
  const body = req.params;
  const values = [body.id];

  pool.query(query, values, (err, _res) => {

    if (err) {
      console.log(err.stack);
      res.send('Failed to fetch data!');
      return;
    } else {
      res.send(_res.rows);
    }
    
  });

});

app.post('/login', function(req, res) {
  const query = "select * from users where account = $1 and password = md5($2)";
  const body = req.body;
  const values = [body.account, body.password];

  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to fetch data!');
      return;
    } else {
      res.send(_res.rows);
    }
  });

});

app.post('/signup', function(req, res) {
  const query = "insert into users(name, account, password) values($1, $2, md5($3))";
  const body = req.body;
  const values = [body.name, body.account, body.password];

  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to insert user!');
    } else {
      res.send('Successfully inserted user!');
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
  console.log('Someone has connected!');
  socket.on('switch', function (body) {
    console.log(body);
    client.publish('demo/switch', body);
  });
});

client.on('connect', function () {
  console.log('Successfully Connected!');
  client.subscribe('demo/chrome_test');
  client.publish('demo/esp8266', 'off');
})

client.on('message', function (topic, message) {
  console.log(message.toString())
}) 