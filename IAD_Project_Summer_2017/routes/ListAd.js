var express = require('express');
var router = express.Router();
var Db = require("DbfetchAdd");

router.post("/AddNewads", function (req, res) {
    console.log("add");
    var session = req.session;
    var user = session.loginAs;
    var index = 0;
    if (user) {
        console.log(user);
        var session = req.session;
        if (req.body.itemname && +req.body.price > 0) {
            var images = [];
            if (req.body.image instanceof Array) {
                for (var i = 0; i < req.body.image.length; i++) {
                    if (typeof req.body.image[i] == "string") {
                        images.push(req.body.image[i]);
                    }
                }
            }
            
            var items = Db.fetch("ListOfAds");
            if (req.body.id != undefined) {
                
                for (var i = 0; i < items.length; i++) {
                    if (req.body.id == items[i].id) {

                        var item = {
                            id: +req.body.id,
                            username: session.loginAs,
                            itemname: String(req.body.itemname),
                            description: String(req.body.description),
                            price: +req.body.price,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            emailid: req.body.emailid,
                            city: req.body.city,
                            contactno: req.body.contactno,
                            image: images,
                            status: req.body.status,
                            created: new Date().toLocaleDateString()
                        };
                        index = i;
                       
                    }
                  
                }
                var list = [];
                var slice = items.slice(index, index + 1);
                for (var i = 0; i < items.length; i++)
                {
                    if (items[i].id == slice[0].id) {
                        list.push(item);
                    }
                    else
                    {
                        list.push(items[i]);
                    }
                }
                Db.save("ListOfAds", list);               
                res.send("Ad updated");
                return;

            }
            else
            {
                var item = {
                    id: items.length + 1,
                    username: session.loginAs,
                    itemname: String(req.body.itemname),
                    description: String(req.body.description),
                    price: +req.body.price,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    emailid: req.body.emailid,
                    city: req.body.city,
                    contactno: req.body.contactno,
                    image: images,
                    status: req.body.status,
                    created: new Date().toLocaleDateString()
                };
                items.push(item);
                Db.save("ListOfAds", items);
                res.send(JSON.stringify(item));
                return;
            }
        }
        res.send("Failed to create an ad");
    }
});

router.get("/list", function (req, res) {
    var session = req.session;
    var user = session.loginAs;
   
    if (user)
    {
          var items = Db.fetch("ListOfAds");
            res.send(JSON.stringify(items));
    } 
});

router.get("/userAds", function (req, res) {
    var session = req.session;
    var user = session.loginAs;
   
    if (user) {
        var items = [];
        var ads = Db.fetch("ListOfAds");
        
        for (var i = 0; i < ads.length; i++) {

            if (ads[i].username == user)
            {
                
                items.push(ads[i]);
            }           
        }       
        res.send(items);
    }
});

router.get("/username", function (req, res) {
    var session = req.session;
    var user = session.loginAs;
    if (user) {
        var items = [];
        var ads = Db.fetch("DeactivatedAds");

        for (var i = 0; i < ads.length; i++) {

            if (ads[i].username == user) {
                
                items.push(ads[i]);
            }
        }

        res.send(items);
    }
});

router.post("/:id", function (req, res) {
    
    var session = req.session;
    var user = session.loginAs;
    if (user) {
        var itemsActive = Db.fetch("ListOfAds");
        var itemsDeactive = Db.fetch("DeactivatedAds");
        var itemId = req.params.id;
       

        if (req.body.name == "deactive") {
         
            for (var i = 0; i < itemsActive.length; i++) {
                if (itemId == itemsActive[i].id) {
                    
                    Db.delete("ListOfAds", "DeactivatedAds", itemId);
                    res.send("done");
                }
            }
        }
        else if (req.body.name == "activate") {
            for (var i = 0; i < itemsDeactive.length; i++) {
                if (itemId == itemsDeactive[i].id) {
                    
                    Db.delete("DeactivatedAds", "ListOfAds", itemId);
                    res.send("done");
                }
            }
        }
        else {
            var item = null;
            for (var i = 0; i < itemsActive.length; i++) {
                if (itemsActive[i].id == itemId) {
                    item = itemsActive[i];
                }
            }
            res.send(item);            
        }
    }
});


        
module.exports = router;