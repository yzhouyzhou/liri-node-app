var dotenv = require("dotenv").config();
var spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");

var commandsForLogging = "\nProcess the command ->>>  node liri.js ";

var spot = new spotify(keys.spotify);
var action = process.argv[2];
var value = process.argv.slice(3).join(" ");
logging(commandsForLogging + process.argv.slice(2).join(" ") + "\n");

// writing data into a log file while displaying it on the console
function logging(data) {
  fs.appendFile("log.txt", data, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  // fs.appendFileSync("log.txt", data);
  console.log(data);

}

function concertThis() {
  var queryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
  logging("queryUrl ->>> " + queryUrl + "\n");
  axios.get(queryUrl).then(
    function (response) {
      // console.log(JSON.stringify(response.data, null, 2));
      for (var i = 0; i < response.data.length; i++) {
        logging(
          "Name of the Venue: " + response.data[i].venue.name + "\n" +
          "Venue Location: " + response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country + "\n" +
          "Date of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n"
        );
      }
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logging("---------------Data---------------");
        logging(error.response.data);
        logging("---------------Status---------------");
        logging(error.response.status);
        logging("---------------Status---------------");
        logging(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        logging(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        logging("Error: " + error.message);
      }
      logging(error.config);
    });
}

function spotifyThisSong() {
  //if no song is provided, the depaul value is The Sign
  if (value.trim().length === 0) {
    value = "The Sign Ace of Base";
    logging("If no song is provided, using The Sign by Ace of Base instead\n");
  }
  spot.search({ type: 'track', query: value, limit: 1 }, function (err, response) {
    if (err) {
      return logging('Error occurred: ' + err);
    }

    // logging(JSON.stringify(response, null, 2));
    logging(
      "Artist: " + response.tracks.items[0].album.artists[0].name + " \n" +
      "The Song's name: " + response.tracks.items[0].name + " \n" +
      "A preview link of the song from Spotify URL: " + response.tracks.items[0].preview_url + " \n" +
      "The album that the song is from: " + response.tracks.items[0].album.name + " \n" +
      "The Song's Spotify URL: " + response.tracks.items[0].album.external_urls.spotify + " \n"
    );
  });
}

function movieThis() {
  //if movie was empty, depaul value is Mr. Nobody
  if (value.trim().length === 0) {
    value = "Mr. Nobody";
    logging("The movie name was not applied, using Mr. Nobody instead\n");
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";
  logging(queryUrl);

  axios.get(queryUrl).then(
    function (response) {
      // logging(JSON.stringify(response.data, null, 2));
      var imdbRating = "N/A";
      var rottenTomatoesRating = "N/A";
      for (var i in response.data.Ratings) {
        if ("Internet Movie Database".indexOf(response.data.Ratings[i].Source) !== -1) {
          imdbRating = response.data.Ratings[i].Value;
        }
        if ("Rotten Tomatoes".indexOf(response.data.Ratings[i].Source) !== -1) {
          rottenTomatoesRating = response.data.Ratings[i].Value;
        }
      }
      logging(
        "\nTitle of the movie: " + response.data.Title + " \n" +
        "Year the movie came out: " + response.data.Released + " \n" +
        "IMDB Rating of the movie: " + imdbRating + " \n" +
        "Rotten Tomatoes Rating of the movie: " + rottenTomatoesRating + " \n" +
        "Country where the movie was produced: " + response.data.Country + " \n" +
        "Language of the movie: " + response.data.Language + " \n" +
        "Plot of the movie: " + response.data.Plot + " \n" +
        "Actors in the movie: " + response.data.Actors + " \n"
      );
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logging("---------------Data---------------");
        logging(error.response.data);
        logging("---------------Status---------------");
        logging(error.response.status);
        logging("---------------Status---------------");
        logging(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        logging(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        logging("Error: " + error.message);
      }
      logging(error.config);
    });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return logging(error);
    }
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    logging(dataArr + "\n");
    action = dataArr[0];
    value = dataArr[1];
    processAction();
  });
}

function processAction() {
  switch (action) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this-song":
      spotifyThisSong();
      break;
    case "movie-this":
      movieThis();
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      logging("Wrong action, please try it again!");
  }
}

processAction();


