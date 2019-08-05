// eliminate the need for - in between the first two words
const selection = process.argv.slice(2,4).join(" ");
const input = process.argv.slice(4).join(" ");

switch (selection){
    case "movie this":
        movieThis();
        addInput();
        break;

    case "concert this":
        concertThis();
        addInput();
        break; 
     
    case "spotify this":
        spotifyThis();
        addInput();
        break; 

    case "delete file":
        clearFile();
        break; 

    case "read file":
        readFile();
        break

    // case "set up":
    //     setUp();
    //     break; 
}


// function setUp() {
//     const inquirer = require("inquirer");
//     inquirer
        
//     .prompt([
//         {
//         type: "input",
//         message: "What is your name?",
//         name: "username"
//         },
//         {
//         type: "password-mask",
//         message: "Set your password",
//         name: "password"
//         },
//         {
//         type: "confirm",
//         message: "Are you sure about your password?",
//         name: "confirm",
//         default: true
//         }
//     ])
//     .then(function(inquirerResponse) {
//         if (inquirerResponse.confirm) {
//         console.log("\nWelcome " + inquirerResponse.username);
//         } else {
//         console.log("\nThat's okay " + inquirerResponse.username + ", your password was pretty shitty\n");
//         }
//     });
// }


// -----------------------------ADD TO TXT-----------------------------//
function addInput() {
    const fs = require("fs");
    const text = input;
    fs.appendFile("user-input.txt", "{" + selection.split("-").shift() + ": " + text + "}, ", function(err) {
        if (err) {
            console.log(err);
        }
    });
} // -----------------------------ADD TO TXT-----------------------------//

// -----------------------------SPOTIFY-----------------------------//
function spotifyThis() {
    require("dotenv").config();
    const keys = require("./keys.js");
    var Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);
    const song = input;

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            spotifyThisErr()
            return console.log('\nThat song does not exist');
        }
        console.log("--------------------------");
        console.log("\nTop 3 results for " + song + "\n");
        console.log("--------------------------");

        for (let i = 0; i < 3; i ++){
            console.log("\nArtist: " + data.tracks.items[i].artists[0].name);
            console.log("Song Name: " +data.tracks.items[i].name);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("Song Preview : " +data.tracks.items[i].preview_url + "\n"); 
        }
    });

} // -----------------------------SPOTIFY-----------------------------//

// -----------------------------SPOTIFY  ERROR-----------------------------//
function spotifyThisErr() {
    require("dotenv").config();
    const keys = require("./keys.js");
    var Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);
    const song = "bohemian rhapsody"

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return
        }
        console.log("\nLet's try " + song + " instead, which does exist\n");
        console.log("--------------------------");
            console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
            console.log("Song Name: " +data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Song Preview : " +data.tracks.items[0].preview_url + "\n"); 
        
    });

}
// -----------------------------SPOTIFY  ERROR-----------------------------//

// -----------------------------OMDB-----------------------------//
function movieThis () {
    const axios = require("axios");
    const movieName = input;

    const queryUrl = `http://www.omdbapi.com/?t="${movieName}&y=&plot=short&apikey=trilogy`;
    
    axios.get(queryUrl).then(
    function(response) {

        console.log("\n--------------------------");
        console.log("\n" +response.data.Title)
        console.log("Released in: " + response.data.Year)
        console.log("IMDB Ratig: " + response.data.Ratings[0].Value)
        console.log("Rotten Tomatos: " + response.data.Ratings[1].Value)
        console.log("Produced in: " + response.data.Country)
        console.log("Language : " + response.data.Language)
        console.log("\nPlot: " + response.data.Plot + "\n")
        console.log("Actors: " + response.data.Actors  + "\n")
        console.log("--------------------------\n");

    })
    .catch(function(error) {
        if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
        } else if (error.request)  {
        console.log(error.request);
        } else {
        console.log("Error", error.message);
        }
        console.log(error.config);
    });
} // -----------------------------OMDB-----------------------------//

// -----------------------------BANDS IN TOWN-----------------------------//
function concertThis() {
    const axios = require("axios");
    const moment = require('moment');
    const artist = input;

    const queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    
    axios.get(queryUrl).then(
    function(response) {
        
        console.log("\n" + artist + ":")
        //------------------- LOOP THROUGH THE RESPONCES -------------------//
        for (let i = 0; i < response.data.length; i ++){
            
            let location = response.data[i].venue.city + ", " + response.data[i].venue.country
            // -----------------------------WEATHER FORCAST-----------------------------//
            var weather = require("weather-js");
            weather.find({ search: location, degreeType: "F" }, function(err, result) {
                if (err) {
                    console.log(err);
                }
                console.log("\n-----------------------------------")
                console.log("\nVeune: " + response.data[i].venue.name)
                console.log("Location: " + location)
                console.log("Date & Time: " + moment(response.data[i].datetime).format("MM/DD/YYYY hh:mm:a") + "\n")
                console.log("Current Five Day Forcast at Venue: ")   
                    
                for (let j = 0; j < result[0].forecast.length; j ++) {
                        
                        console.log(JSON.stringify(result[0].forecast[j].day))
                        console.log("Low Temp: " + JSON.stringify(result[0].forecast[j].low))
                        console.log("high Temp: " + JSON.stringify(result[0].forecast[j].high))
                        console.log("Precipitation: " + JSON.stringify(result[0].forecast[j].precip) + "\n")
                }
            // -----------------------------WEATHER FORCAST-----------------------------//
            });
        }
        console.log("Number of Results: " + response.data.length)

    })
    .catch(function(error) {
        if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
        } else if (error.request)  {
        console.log(error.request);
        } else {
        console.log("Error", error.message);
        }
        console.log(error.config);
    });
} // -----------------------------BANDS IN TOWN-----------------------------//

// -----------------------------DELETE TXT FILE-----------------------------//
function clearFile () {
    var fs = require('fs')
    var inquirer = require("inquirer");
    inquirer
    .prompt([
      {
      type: "confirm",
      message: "Are you sure you want to delete all user inputs?:",
      name: "confirm",
      default: true
    }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            console.log("You have choosen to delete all user input data")
            fs.truncate('user-input.txt', 0, function(){console.log('done')})
        }
        else {
      console.log("You have choosen not to delete all user input data");
        }
    });
}
// -----------------------------DELETE TXT FILE-----------------------------//

// -----------------------------READTXT FILE-----------------------------//
function readFile() {
    const fs = require("fs");

    fs.readFile("user-input.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      const dataArr = data.split(",");
      console.log(dataArr.join('\r\n'));
    });
}// -----------------------------READTXT FILE-----------------------------//
