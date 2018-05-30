var express = require('express');
var router = express.Router();
var Db = require("DbfetchAdd");

router.post('/newmsg', function (req, res) {
    var msg = Db.fetch("InboxMessage");
    var data = {
        id:msg.length+1,
        from: req.body.from,
        to: req.body.to,
        message: req.body.message
    };
    msg.push(data);
    Db.save("InboxMessage", msg);
    res.send('message sent');
});
router.get('/getmessage', function (req, res) {
    console.log("router");
    var session = req.session;
    var user = session.loginAs;
    var msgs = Db.fetch("InboxMessage");
    var retreivemsg = [];
    for (var i = 0; i < msgs.length; i++)
    {
        if (msgs[i].to == user)
        {
            retreivemsg.push(msgs[i]);
        }
    }
    console.log(retreivemsg);
    res.send(retreivemsg);
});
module.exports = router;