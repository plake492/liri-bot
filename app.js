const inquirer = require("inquirer");

function start() {
    inquirer
    .prompt([
            {
                type: "input",
                message: "What is your name?",
                name: "user_name",
            }
        ])
    .then(({user_name}) => {
        console.log("\n--------------------------------------")
        console.log("\nHello " + user_name + ", I'm LIRI.\n")
        console.log("--------------------------------------\n")

        runLIRI()
    })

    const password = "coding492"
    const question1 = [
        {
            type: "list",
            message: "\nWhat would you like me to do?",
            choices: ["Movie Info? ","Concert Info? ", "Song Info? ", "Read Search History? ", "Delete Search History? "],
            name: "query"
        },
    ]
    const question2 = [
        {
            type: "input",
            message: "Please enter search item: ",
            name: "search_item"
        }
    ]

    function confrim() {
        inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to do something else?:",
                name: "run_again",
                default: true
            }
        ])
        .then(({run_again}) => {
            checkRunAgain(run_again)
        })
    }

    function checkRunAgain(x, goodbye) {
        if (x === true) {
            runLIRI();
            return;
        } else  {
            console.log("\n--------------------------------------")
            console.log("\nGoodbye, I hope to see you soon.\n")
            console.log("\n--------------------------------------")
            return
        }
    }

    function askPassword() {
        inquirer
        .prompt([
            {
                type: "password",
                message: "Enter Password",
                mask: '*',
                name: "password",
            }
        ])
        .then(({password}) => {
            checkPassword(password)
        })
    }

    function checkPassword (key) {
        if (key === password) {
            clearFile();
        } else {
            console.log("Invalid password")
            confrim()
        }
    }


    function runLIRI () {
        inquirer
        .prompt(question1)
        .then(({query}) => {

            switch (query){
                case "Movie Info? ":
                    movieThis();
                    break;
            
                case "Concert Info? ":
                    concertThis();
                    break; 
                
                case "Song Info? ":
                    spotifyThis();
                    break; 
            
                case "Delete Search History? ":
                    askPassword()
                    break; 
            
                case "Read Search History? ":
                    readFile();
                    break
            }

            // -----------------------------ADD TO TXT-----------------------------//
            function addInput(input) {
                const fs = require("fs");
                fs.appendFile("user-input.txt", "{" + query.split(" ").shift() + ": " + input + "}, ", function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            } // -----------------------------ADD TO TXT-----------------------------//


            // -----------------------------SPOTIFY-----------------------------//
            function spotifyThis() {

                inquirer
                .prompt(question2)
                .then(({search_item}) => {

                    require("dotenv").config();
                    const keys = require("./keys.js");
                    const Spotify = require('node-spotify-api');
                    const spotify = new Spotify(keys.spotify);
                    const song = search_item;

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
                        confrim()
                    });
                    addInput(song);

                })
            } // -----------------------------SPOTIFY-----------------------------//

            // -----------------------------SPOTIFY-ERROR-----------------------------//
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
                        confrim()

                    
                });

            }
            // -----------------------------SPOTIFY-ERROR-----------------------------//


            // -----------------------------OMDB-----------------------------//
            function movieThis () {
                inquirer
                .prompt(question2)
                .then(({search_item}) => {
                    const axios = require("axios");
                    const movieName = search_item;
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
                        confrim()
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
                        confrim()

                    });
                    addInput(movieName);
                }) // -----------------------------OMDB-----------------------------//
            }


            // -----------------------------BANDS IN TOWN-----------------------------//
            function concertThis() {
                inquirer
                .prompt(question2)
                .then(({search_item}) => {

                    const axios = require("axios");
                    const moment = require('moment');
                    const artist = search_item;
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
                                    confrim()

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
                        confrim()
                        // ********************** NEED TO FIX CONFIRM() LOCATION ******************************//
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
                        confrim()


                    });
                    addInput(artist);
                }) // -----------------------------BANDS IN TOWN-----------------------------//

            }


            // -----------------------------READTXT FILE-----------------------------//
            function readFile() {
                const fs = require("fs");

                fs.readFile("user-input.txt", "utf8", function(error, data) {
                if (error) {
                    return console.log(error);
                }
                const dataArr = data.split(",");
                console.log(dataArr.join('\r\n'));
                confrim()
                });
            }// -----------------------------READTXT FILE-----------------------------//

        })
    }
    // -----------------------------DELETE TXT FILE-----------------------------//
    function clearFile() {

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
            } else {
                console.log("You have choosen not to delete all user input data");
            }
            confrim()
        });
    }
// -----------------------------DELETE TXT FILE-----------------------------//
}

start()

     

