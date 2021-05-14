var express = require('express');
var app = express();
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.render('login.ejs');
});

app.get('/join', function (req, res){
    res.render('join.ejs')
})

app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM BOARD';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('list.ejs', {list : rows});
    });
});

app.get('/write', function (req, res) {
    res.render('write.ejs');
});

app.post('/writeAf1', function (req, res) {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO BOARD VALUES(NOW(), ?, ?, ?)';
    var params = [body.username, body.email, body.password];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/');
    });
});

app.listen(3000, () => console.log('Server is running on port 3000...'));