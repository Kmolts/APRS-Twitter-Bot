var updates = 0;
var notSame = true;
var sent = false;

//APRS Info
var aprskey = "74095.iNU13g1dI0h9tKX";
var callsign = "KC1DFW";
//Twitter Info
var twitterKey = 'EucuOJvdhEuOdTsM4t2Y1Wzjv';
var twitterSecret = 'Kuaed9MZAwOZ6iWVjor6Fd9YG5Bjgy6MrRUujs6CFg8toHOiMR';
var twitterCallBack = 'http://yoururl.tld/something'; 
var accessToken = "3120100293-uwDbOuROVcTz7aH8EVNqOzXj6wrePqte0jHQPgh";
var accessTokenSecret = "hX4UD9SyeCYxZVhtnIiR7yffoyILQo3zARmq8ThSZTzRz";


var getLocation = function() {
	
	client.get("http://api.aprs.fi/api/get?name="+callsign+"&what=loc&apikey="+aprskey+"&format=json", function(data, response){
    	notSame = true;
        
    	if((this.lat === data["entries"][0]["lat"])  && (this.lng === data["entries"][0]["lng"])) {
			notSame = false;
		}
   		// parsed response body as js object 
    	this.lat = data["entries"][0]["lat"];
    	this.lng = data["entries"][0]["lng"];
      this.altitude = data["entries"][0]["altitude"];
    	console.log("Update " + updates);
    	updates++;
   		if(notSame) {
      		sent = false;
       		//sendToTwitter("~Current Location~ \n Latitude: " + this.lat + "\n Longitude: " + this.lng + "\n Altitude: " + this.altitude + " meters \n http://tinyurl.com/JagSat-Map \n #JagSat");
    	} else {
       		if(!sent) {
       			sent = true;
    	   		//sendToTwitter("Likely over the Atlatic Ocean, updates will resume over land.");
       		}
    	}
	});
}
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: this.twitterKey,
    consumerSecret: this.twitterSecret,
    callback: this.twitterCallBack
});
var requestToken;
var requestTokenSecret;
twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
        console.log("Error getting OAuth request token : " + error);
    } else {
        this.requestToken = requestToken;
        this.requestTokenSecret = requestTokenSecret;
    }
});
var Client = require('node-rest-client').Client;
client = new Client();
var lat;
var lng;
getLocation();
setInterval(function() {
	getLocation();
}, (900000));

var sendToTwitter = function(stat) {
	if(accessToken) {
		twitter.statuses("update", {
        	status: stat
    		},
    		accessToken,
    		accessTokenSecret,
    		function(error, data, response) {
        		if (error) {
        			console.log(error);
        		} 
  			}
		);
	}

}
