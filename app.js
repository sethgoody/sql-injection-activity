const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log('Username:', username);
    console.log('Password:', password);
  
    // Constructing a SQL query with direct concatenation (intentionally vulnerable to SQL injection)
    const query = "SELECT title FROM user WHERE username = '" + username + "' AND password = '" + password + "'";
  
    console.log('SQL Query:', query);

    // Execute the query
    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send(`Hello <b>${row.title}</b><br />
            This file contains all your secret data: <br /><br />
            SECRETS <br /><br /> MORE SECRETS <br /><br />
            <a href="/index.html">Go back to login</a>`);
        }
    });
  });

const PORT = 3000; // Or any other preferred port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});