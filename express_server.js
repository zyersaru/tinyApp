var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString(req) {
  var random = "";
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i=0; i < 6; i++) {
    random += charset.charAt(Math.floor(Math.random() * 6));
    }
  return random;
}
const newShortURL = generateRandomString();

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
  userName: req.cookies["username"] };
  res.render("urls_index", templateVars );
});

app.get("/urls/new", (req, res) => {
  let templateVars = { shortURL: req.params.id,
    address: urlDatabase[req.params.id],
    userName: req.cookies["username"] };
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
    address: urlDatabase[req.params.id],
    userName: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  // console.log(generateRandomString(req));  // debug statement to see POST parameters
  // const newShortURL = generateRandomString(req);
  // console.log(req.body);
  const longURL = req.body;
  urlDatabase[newShortURL] = req.body["longURL"];
  // console.log(urlDatabase);
  res.redirect("/urls");
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  // console.log(req.params.id)
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(delete urlDatabase[req.params.id]);
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const userName = req.body["username"];
  res.cookie("username", userName)
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body["username"]);
  res.redirect("/urls")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});