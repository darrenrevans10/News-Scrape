var cheerio = require("cheerio");
var request = require("request");

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var db = require("./models");


var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  //useMongoClient: true
});


app.get("/", function(req, res) {
	
	db.Article.find({isSaved: false})
	.then(function(dbArticle) {
		var hbsObject = {
			articles: dbArticle
		};
		// res.json(hbsObject);
		res.render("home", hbsObject);
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.get("/saved", function(req, res) {
	
	db.Article.find({isSaved: true})
	.populate("comments")
	.then(function(dbArticle) {
		var hbsObject = {
			articles: dbArticle
		};
		// res.json(hbsObject);
		res.render("saved", hbsObject);
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.get("/articles/:id", function(req, res) {

	db.Article.findOne({_id: req.params.id})
		.populate("comments")
		.then(function(dbArticle) {
			var hbsObject = {
				article: dbArticle
			};
			// res.json(hbsObject);
			res.render("saved", hbsObject);
		})
		.catch(function(err) {

			res.json(err);
		});
});

app.post("/save/:id", function(req, res) {
	db.Article.update({_id: req.params.id}, {isSaved: true})
	.then(function(dbArticle) {
		
		res.redirect("/");
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.post("/delete/:id", function(req, res) {
	db.Article.update({_id: req.params.id}, {isSaved: false})
	.then(function(dbArticle) {

		res.redirect("/saved");
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.post("/articles/:id", function(req, res) {

	db.Comment.create(req.body)
		.then(function(dbComment) {

			return db.Article.findOneAndUpdate({ _id: req.params.id}, {comments: dbComment._id}, {new: true});
		})
		.then(function(dbArticle) {

			res.json(dbArticle);
		})
		.catch(function(err) {

			res.json(err);
		});
});


app.get("/scrape", function(req, res) {

  	request("https://www.espn.com", function(error, response, html) {

	    var $ = cheerio.load(html);

	    $("div.contentItem__contentWrapper").each(function(i, element) {
	      
			var result = {};
		     
		    result.headline = $(element).children("h1").text();
		    result.summary = $(element).children("p").text();
		    result.link = "www.espn.com" + $(element).parent("a").attr("href");


		    if (result.link && result.headline && result.summary) {
		        
		        db.Article.create(result)
		            .then(function(dbArticle) {
		          		console.log(dbArticle);
		        	})
		        	.catch(function(err) {
		          		return res.json(err);
		        });
		    }
		});
  
  		res.redirect("/");
  	});
});



app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});