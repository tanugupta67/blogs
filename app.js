//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");
const path=require("path");
homeStartingContent="The first step to make a change in your life, to get what you want from life, to make your life better is to first specifically decide what it is you want. Unless you know what you want you will never arrive because you have no final destination. "
const aboutContent = "We all have to start somewhere, and doing something is better than nothing at all. Start small so you don't get discouraged and give up. Remember it is all about consistency.";
const contactContent = "Taking responsibility - practicing 100 percent responsibility every day - is about seeing ourselves not as right or wrong, but as an agent, chooser, problem solver, and learner in the complex interrelationships of our lives so that we can better integrate with the people and world around us. When we do this, we enjoy a better and more productive way to live and lead.";
let port=process.env.PORT || 3000;
const hostname='0.0.0.0';
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
// mongoose.connect("mongodb://localhost:27017/blogDB");
// mongoose.connect("mongodb+srv://Tanu_gupta:boNc5CZUQhgqo6vX@atlascluster.4dfjiks.mongodb.net/BLogDB");
const connectDb=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
  }catch(error){
    console.log(error);
    process.exit(1);
  }
}
const postSchema = {
 title: String,
 content: String
};
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

 
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

post.save(function(err){
  if(!err){
    res.redirect("/");
  }
});

  // res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
Post.findOne({_id: requestedPostId}, function(err, post){
res.render("post", {
    title: post.title,
    content: post.content
  });

});
});





connectDb().then(()=>{
  app.listen(port,hostname, function() {
    console.log("Server started on port 3000");
  });
});

