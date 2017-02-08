var express = require("express");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", (err) => {
    console.log("DB ERROR", error)
});


app.get("/", (req, res) => {
    res.send("WHAT UP?")
})

app.get("/all", (req, res) => {
    db.scrapedData.find({}, (err, found) => {
        if (err) {

            console.log(err);
        }
        else {
            console.log(found)
            res.json(found)
        }
    })
})



app.get("/scrape", (req, res) => {

    request("http://cnn.com/", (error, response, html) => {
        var $ = cheerio.load(html);
        // console.log(html)
        // $('.cd__headline-icon').each(function (i, element) {
        //     var a = $(this).prev();
$('.cd__headline').each(function(i, elm) {
    var a = $(this).text() // for testing do text() 

            console.log("test" + a)
            var link = a.attr('href');
            var title = a.text();

            if (title && link) {

                db.scrapedData.save({
                    title: title,
                    link: link
                }),
                    (error, saved) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log(saved);
                        }
                    }
            }


            else {
                console.log(error)
            }
        })
    })
    res.send("Scrape complete")

})


app.listen(3000, () => {
    console.log("listening")
})