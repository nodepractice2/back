var express = require('express');
var app = express();
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');
var a = 0; // 글번호
var msg = require('dialog');

db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(__dirname + '/views'));

function alertMessage(messageObject) {
    alert(messageObject);
    return true;
    }
    app.get('/', function (req, res) {
        res.render('main.ejs');
    });
app.get('/login', function (req, res) {
    res.render('login.ejs');
});

app.get('/join', function (req, res){
    res.render('join.ejs')
});

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

app.post('/delete' , function( req, res) {
    var body = req.body;
    var query = req.query;
    console.log(req.query);
    console.log(req.num);
    console.log(body.num);

    var sql = 'delete from BOARD where rownum = ?';
    var params = [body.rownum] ;
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/list');
    })

})

app.post('/writeAf', function (req, res) {
    var sql = 'SELECT MAX(rownum) as max FROM BOARD';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else console.log(a=rows[0].max);
        a++;
        console.log(a);

        var body = req.body;
        sql = 'INSERT INTO BOARD VALUES(?, NOW(), ?, ?, ?)';
        var params = [body.id, body.title, a, body.content];
        console.log(sql);
        conn.query(sql, params, function(err) {
            if(err) console.log('query is not excuted. insert fail...\n' + err);
             else res.redirect('/list');
        });
    });

    
});

// app.post('/join', function (req, res) {
//     var body = req.body;
//     console.log(body);
//     console.log(params);
//     if(body.password != body.apassword){
//         res.send("incorrect");
//     }

//     var sql = 'INSERT INTO user VALUES(?, ?, ?)';
//     var params = [body.username, body.password, body.email];
//     console.log(sql);
//     conn.query(sql, params, function(err) {
//         if(err) console.log('query is not excuted. insert fail...\n' + err);
//         else res.redirect('/login');
//     });
// });

app.post('/join', function(req,res){
    var id = req.body.id;
    var password = req.body.password;
    var email = req.body.email;

    if(!id || !password || !email || !apassword){
        //하나라도 누락된 경우
        msg.info('모든 정보를 입력해 주세요');
        return;
    }

    var sql = 'insert into user (id,password,email) values(?,?,?)';
    var params = [id,password,email];

    conn.query(sql,params,function(err,rows,fields){
        if(err)
        console.log(err);
        else{
            console.log(rows);
            res.redirect('/login');
        }
    });
});

app.post('/wndqhr',function(req,res){
    var id = req.body.id;
    var password = req.body.password;
    var email = req.body.email;
    var sql = 'insert into user (id,password,email) values(?,?,?)';
    var params = [id,password,email];
    conn.query(sql,params,function(err,rows,fields){
        var user = rows[0];
        if(user.email === email )
        msg.info('사용불가능');
        else{
            msg.info('사용가능');
        }
    });
});
app.post('/login', function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var sql = 'select * from user where email = ?'
    var params = [email];

    conn.query(sql,params, function(err,rows,fields){
        var user = rows[0];
        console.log(rows);
        // if(rows === 0){
        //     console.log('s');
        // }
        if(rows.length == 0){
            //이메일이 존재하지 않으면
            msg.info('존재 하지 않는 이메일 입니다.');
        } else if(user.password !== password){
            //패스워드 틀리면
            msg.info('패스워드를 확인해주세요');
            } else{
            //이메일 패스워드 둘다 맞으면
                res.redirect('/');
            }
    });
});


app.listen(3000, () => console.log('Server is running on port 3000...'));
