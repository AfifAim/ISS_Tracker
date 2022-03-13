const express = require("express");
const https = require('https');
const bodyParser= require("body-parser");
var moment = require('moment');
const { unlink } = require("fs");
 
const app = express();
app.use(bodyParser.urlencoded({extended :true}));

// Get the file index

app.get("/", function(req, res)
{
 res.sendFile(__dirname + "/index.html")

});


// Post the value

app.post("/result.html", function(req, res)

 {  var timeStamp= req.body.timestamp
    var myDate = new Date(timeStamp);
    var k=moment(timeStamp).unix();
    var myEpoch = myDate.getTime()/1000.0;
    var timestamp=myEpoch;

    //Add and Subtract Time
    var alltime = [];
    var ATime=[];
    ATime[0]=timeStamp;
    alltime[0]=timestamp;
    ATime[1]=moment(timeStamp).add(10, 'm');
    alltime[1]= Math.round(ATime[1] / 1000)
    ATime[2]=moment(timeStamp).add(20, 'm');
    alltime[2]= Math.round(ATime[2] / 1000)
    ATime[3]=moment(timeStamp).add(30, 'm');
    alltime[3]= Math.round(ATime[3]/ 1000)
    ATime[4]=moment(timeStamp).add(40, 'm');
    alltime[4]= Math.round(ATime[4] / 1000)
    ATime[5]=moment(timeStamp).add(50, 'm');
    alltime[5]= Math.round(ATime[5] / 1000)
    ATime[6]=moment(timeStamp).add(60, 'm');
    alltime[6]= Math.round(ATime[6]/ 1000);


    ATime[7]=moment(timeStamp).subtract(10, 'm');
    alltime[7]= Math.round(ATime[7] / 1000)
    ATime[8]=moment(timeStamp).subtract(20, 'm');
    alltime[8]= Math.round(ATime[8] / 1000)
    ATime[9]=moment(timeStamp).subtract(30, 'm');
    alltime[9]= Math.round(ATime[9]/ 1000)
    ATime[10]=moment(timeStamp).subtract(40, 'm');
    alltime[10]= Math.round(ATime[10] / 1000)
    ATime[11]=moment(timeStamp).subtract(50, 'm');
    alltime[11]= Math.round(ATime[11] / 1000)
    ATime[12]=moment(timeStamp).subtract(60, 'm');
    alltime[12]= Math.round(ATime[12]/ 1000);

    //Declare Array

    var info=[];
    var hinfo=[];

    // Get API Link

     var url="https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps="+alltime[0]+","+alltime[1]+","+alltime[2]+","+alltime[3]+","+alltime[4]+","+alltime[5]+","+alltime[6]+","+alltime[7]+","+alltime[8]+","+alltime[9]+","+alltime[10]+","+alltime[11]+","+alltime[12]+"&units=miles";

    // Get the  API info
    https.get(url, function(response)
     {  
           response.on("data", function(data)
           {
            
            res.write("<h1><center> RESULT OF ISS LOCATION BY DATE </center></h1>");


                for(let i = 0 ; i<13 ; i++)
                {  

                    const ISSdata= JSON.parse(data);
                    const latitude= ISSdata[i].latitude;
                    const longitude= ISSdata[i].longitude;
                    
                    const ttime= ATime[i];
                    var rrtime=moment(ttime).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
                    hinfo.push("Time: "+ rrtime +", Coordinate ISS : "+latitude+","+longitude);

                    var url_location="https://api.wheretheiss.at/v1/coordinates/"+latitude+","+ longitude;
  
                   https.get(url_location, function(response)
                   {
                       response.on("data", function(data)
                       {   
                           const Ttime= ATime[i];
                           var rtime=moment(Ttime).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
                           var ISSlocation= JSON.parse(data);
                           location = ISSlocation.timezone_id;

                           info.push("Time: "+ rtime +", Coordinate ISS : "+latitude+","+longitude+" and the location(City) at "+ location);
                           console.log("Result "+[i]+": " + info[i]);
                          
                       });
                 
                   });
                 
               }
              
                https.get(url_location, function(response)
                {
                    response.on("data", function(data)
                       {    
                           //output
                            res.write("<br><h3><u><center>Result: Timestamp and Coordinate(Latitude,Longitude)</center></u></h3>");
                            res.write("<p><center>"+hinfo[12]+"</center></p>");
                            res.write("<p><center>"+hinfo[11]+"</center></p>");
                            res.write("<p><center>"+hinfo[10]+"</center></p>");
                            res.write("<p><center>"+hinfo[9]+"</center></p>");
                            res.write("<p><center>"+hinfo[8]+"</center></p>");
                            res.write("<p><center>"+hinfo[7]+"</center></p>");
                            res.write("<p><center>"+hinfo[0]+"</center></p>");
                            res.write("<p><center>"+hinfo[1]+"</center></p>");
                            res.write("<p><center>"+hinfo[2]+"</center></p>");
                            res.write("<p><center>"+hinfo[3]+"</center></p>");
                            res.write("<p><center>"+hinfo[4]+"</center></p>");
                            res.write("<p><center>"+hinfo[5]+"</center></p>");
                            res.write("<p><center>"+hinfo[6]+"</center></p>");
                           
                            res.write("<br><h3><u><center>Result: Timestamp, Coordinate(Latitude,Longitude) and Location</center></u></h3>");
                            res.write("<p><center>"+info[12]+"</center></p>");
                            res.write("<p><center>"+info[11]+"</center></p>");
                            res.write("<p><center>"+info[10]+"</center></p>");
                            res.write("<p><center>"+info[9]+"</center></p>");
                            res.write("<p><center>"+info[8]+"</center></p>");
                            res.write("<p><center>"+info[7]+"</center></p>");
                            res.write("<p><center>"+info[0]+"</center></p>");
                            res.write("<p><center>"+info[1]+"</center></p>");
                            res.write("<p><center>"+info[2]+"</center></p>");
                            res.write("<p><center>"+info[3]+"</center></p>");
                            res.write("<p><center>"+info[4]+"</center></p>");
                            res.write("<p><center>"+info[5]+"</center></p>");
                            res.write("<p><center>"+info[6]+"</center></p>");
                            res.send()
                       });
                });             
           });
                
     });       
});

app.listen(process.env.PORT || 3000, function()
{
    console.log("Server is running on port 3000");
})