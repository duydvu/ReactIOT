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

app.get('/room/:name/:id', function (request, response) {
  response.render('pages/index', {
    title: 'React Internet of things'
  })
});

app.get('/db/:id', function (req, res) {
  const query1 = "select count(case when status=true then 1 end) as active, count(status) as total, room_id, room_name from device inner join (select rooms.id, rooms.name as room_name from rooms inner join users on users.id=user_id and users.id=$1) as news on news.id=room_id group by room_id, room_name";
  const query2 = "select rooms.id, rooms.name as room_name from rooms inner join users on users.id=user_id and users.id=$1";
  const body = req.params;
  const values = [body.id];

  pool.query(query1, values, (err, _res1) => {

    if (err) {
      console.log(err.stack);
      res.send('Failed to fetch data!');
      return;
    } else {
      
      pool.query(query2, values, (err, _res2) => {

        if (err) {
          console.log(err.stack);
          res.send('Failed to fetch data!');
          return;
        } else {
          res.send({data1: _res1.rows, data2: _res2.rows});
        }

      });
    }
    
  });

});

app.get('/db/device/:id', function (req, res) {
  const query = "select * from device where room_id = $1";
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

app.post('/addroom', function (req, res) {
  const query = "insert into rooms(user_id, name) values($1, $2)";
  const body = req.body;
  const values = [body.user_id, body.name];

  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to insert room!');
    } else {
      res.send('Successfully inserted room!');
    }
  });

});

app.get('/insert/:id-:name-:status-:room_id-:timer_status', function(req, res) {
  const query = 'INSERT INTO device(id, name, status, room_id, timer_status) VALUES($1, $2, $3, $4, $5)';
  const body = req.params;
  const values = [body.id, body.name, body.status, body.room_id, body.timer_status];

  // callback
  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to insert data!');
    } else {
      res.send('Successfully inserted data!');
    }
  });
})

app.get('/delete/device/:id', function (req, res) {
  const query = 'DELETE FROM device WHERE id = $1';
  const body = req.params;
  const values = [body.id];

  // callback
    pool.query(query, values, (err, _res) => {
      if (err) {
        console.log(err.stack);
        res.send('Failed to delete data!');
      } else {
        res.send('Successfully deleted data!');
      }
    });
})

app.get('/delete/room/:id', function (req, res) {
  const query1 = 'DELETE FROM device WHERE room_id = $1';
  const query2 = 'DELETE FROM rooms WHERE id = $1';
  const body = req.params;
  const values = [body.id];

  // callback
  pool.query(query1, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send('Failed to delete data!');
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
  });
})

app.get('/update/device/:id/:status', function (req, res) {
  const query = 'UPDATE device SET status = $2 WHERE id = $1';
  const body = req.params;
  const values = [body.id, body.status];

  // callback
  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send({ success: false });
    } else {
      console.log('Successfully updated status!');
      res.send({ success: true });
    }
  });
})

app.get('/update/room/:id/:status', function (req, res) {
  const query = 'UPDATE device SET status = $2 WHERE room_id = $1';
  const body = req.params;
  const values = [body.id, body.status];

  // callback
  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send({ success: false });
    } else {
      console.log('Successfully updated status!');
      res.send({ success: true });
    }
  });
})

app.get('/update_timer/device/:id/:status', function (req, res) {
  const query = 'UPDATE device SET timer_status = $2 WHERE id = $1';
  const body = req.params;
  const values = [body.id, body.status];

  // callback
  pool.query(query, values, (err, _res) => {
    if (err) {
      console.log(err.stack);
      res.send({ success: false });
    } else {
      console.log('Successfully updated timer status!');
      res.send({ success: true });
    }
  });
})













/* 
    Socket connection
*/
io.on('connection', function (socket) {
  console.log('Someone has connected!');
  socket.on('switch', function (body) {
    console.log(body);
    client.publish('demo/switch', body);
  });
});














/*
    MQTT connection
*/
client.on('connect', function () {
  console.log('Successfully Connected!');
  client.subscribe('Server/esp8266');
  client.publish('ESP8266', 'off');
})

client.on('message', function (topic, message) {
  console.log(message.toString())
}) 