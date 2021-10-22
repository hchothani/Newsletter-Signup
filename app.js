const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded());
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName + lastName + email);

  const data = {

        status: "subscribed",
        email_address: email,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }


  }
  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/c689c6b6d5/members?skip_merge_validation=false";
  const options = {
    auth: "harsh:81d2b1732ef9f63716200ba43bffaab8-us5",
    method: "POST"
  }

  const request = https.request(url, options, function(response){
   response.on("data", function(data){
     if(response.statusCode === 200){
       res.sendFile(__dirname + "/success.html");
     }
     else{
       res.sendFile(__dirname + "/failure.html");
     }
     console.log(JSON.parse(data));
   })
  });
request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started... ")
})
