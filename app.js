const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { request } = require("http");
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); //to get data from html form
app.use(express.static("public")); //to apply static files to our site
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  var firstname = req.body.fname; //getting fname from html form
  var lastname = req.body.Lname; //getting lname from html form
  var emailid = req.body.email1; //getting email1 from html form
  var data = {
    //creating object of data
    members: [
      {
        email_address: emailid,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };
  //coverting data object into string and storing in jsondata
  var jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/03e5bf0184";
  const options = {
    method: "POST",
    auth: "nikhil123:8ed3a1e87866e3235ebf708ec4e5e0d9-us21", //username:password
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // response.on("data", function (data) {
    //   console.log(JSON.parse(data)); //logging data from mailchimp server
    // });
  });
  request.write(jsonData); //passing jsondata to mailchimp server
  request.end();
});
// Redirectiong to signup page
app.post("/failure", function (req, res) {
  res.redirect("/");
});

// Creating express server
app.listen(process.env.PORT || 3000, function () {
  //Dynamic port that heroku use
  console.log("ready");
});

// Api key
// 8ed3a1e87866e3235ebf708ec4e5e0d9-us21---->put last number 21 in url
// List id
// 03e5bf0184
