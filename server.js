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

app.get("/empty", (req, res)=>{
    db.scrapedData.remove({
        
    })
    res.send("OH YEAH")
});


app.get("/scrape", (req, res) => {

    request("https://news.google.com/", (error, response, html) => {
        var $ = cheerio.load(html);

        $('.esc-lead-article-title').each(function (i, element) {
            var a = $(this).children("a").text();
            var b = $(this).children("a").attr("href")
            if (a && b) {

                db.scrapedData.save({
                    title: a,
                    link: b
                    
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