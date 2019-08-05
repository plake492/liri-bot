const selection = process.argv[2]

switch (selection){
    case "movie-this":
        movieThis();
        addInput();
        break;

    case "concert-this":
        concertThis();
        addInput();
        break; 
     
    case "spotify-this":
        spotifyThis();
        addInput();
        break;
     
}

// -----------------------------ADD TO TXT-----------------------------//
function addInput() {
    const fs = require("fs");
    const text = process.argv.slice(3).join(" ")
    fs.appendFile("user-input.txt", text + ", ", function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Content Added!");
    }
    });
} // -----------------------------ADD TO TXT-----------------------------//



// -----------------------------SPOTIFY-----------------------------//
function spotifyThis() {
    require("dotenv").config();
    const keys = require("./keys.js");
    var Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);
    const song = process.argv.slice(3).join(" ")
 
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
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


// -----------------------------OMDB-----------------------------//
function movieThis () {
    const axios = require("axios");
    const movieName = process.argv.slice(3).join('+');
    const queryUrl = `http://www.omdbapi.com/?t="${movieName}&y=&plot=short&apikey=trilogy`;
    
    axios.get(queryUrl).then(
    function(response) {
        console.log("\n" +response.data.Title)
        console.log("Released in: " + response.data.Year)
        console.log("IMDB Ratig: " + response.data.Ratings[0].Value)
        console.log("Rotten Tomatos: " + response.data.Ratings[1].Value)
        console.log("Produced in: " + response.data.Country)
        console.log("Language : " + response.data.Language)
        console.log("\nPlot: " + response.data.Plot + "\n")
        console.log("Actors: " + response.data.Actors  + "\n")
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
    const artist = process.argv.slice(3).join(' ');
    const queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    
    axios.get(queryUrl).then(
    function(response) {
        console.log("\n" + artist + ":")
        console.log("--------------------------")
        //------------------- LOOP THROUGH THE RESPONCES -------------------//
        for (let i = 0; i < response.data.length; i ++){
            console.log("\nVeune: " + response.data[i].venue.name)
            console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country)
            console.log("Date & Time: " + moment(response.data[i].datetime).format("MM/DD/YYYY hh:mm:a") + "\n")
        }
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


