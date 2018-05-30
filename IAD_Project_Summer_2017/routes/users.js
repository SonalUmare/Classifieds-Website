var express = require('express');
var router = express.Router();
var Db = require("DbfetchAdd");
/* GET users listing. */
router.get('/', function (req, res)
{
    var users = Db.fetch("members");
    for (var i = 0; i < users.length; i++)
    {
        delete users[i].password;
    }
    res.send(JSON.stringify(users));
});

router.post('/login', function (req, res)
{
    console.log("login");
    var session = req.session;
    var users = Db.fetch("members");
    var user;
    for (var i = 0; i < users.length; i++)
    {
        if (users[i].name == req.body.name && users[i].password == req.body.password)
        {
            var user = users[i];
            break;
        }
    }
    if (user) {
        session.loginAs = user.name;
        delete user.password;
        res.send(JSON.stringify(user));
    }
    else
    {
        res.send("Enter a valid username or password");
    }
});
router.get('/currentuser', function (req, res) {
    var session = req.session;
    var users = Db.fetch("members");
    console.log("currentuser");
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == session.loginAs) {
            var user = users[i];
            delete users[i].password;
            res.send(JSON.stringify(user));
            return;
        }
    }
    
    res.send("No user");
});

router.post("/register", function (req, res)
{
    var session = req.session;
    var users = Db.fetch("members");
    var username = req.body.name;
    if (!username)
    {
        res.send("Enter a valid username");
        return;
    }
    if (!req.body.password || !req.body.password2 || req.body.password.length < 5) {

        res.send("Invalid password");
        return;
    }
    if (req.body.password != req.body.password2) 
    {
         res.send("Password do not match");
         return;
    }
    for (var i = 0; i < users.length; i++)
    {
        if (users[i].name.toUpperCase() == username.toUpperCase())
        {
            res.send("Username already exists");
            return;
        }
    }
    var user = {
        name: username,
        password: req.body.password,
        email: req.body.email
    };
    users.push(user);
    Db.save("members", users);
    session.loginAs = user.name;   
    res.send("New user added");
});

router.get("/Logout", function (req, res) {
    var session = req.session;
    var user = session.loginAs;
    if (user) {
        session.loginAs = "";
        console.log("logout");
        res.send("Logged Out");
    }
    else
    {
        res.send("No user");
    }

    
});

router.get("/:username", function (req, res) {
    console.log("router");
    var session = req.session;
    var users = Db.fetch("members");
    var user = session.loginAs;
    var username = req.params.username;
    if (user)
    {
        for (var i = 0; i < users.length; i++)
        {
            console.log("for");
            if (users[i].name == username)
            {
                console.log(users[i].email);
                res.send(users[i].email);
            }
        }
    }
});



module.exports = router;