
// includes: env & file for masking keys, inquirer for prompts, spotify API for spotify, axios for other APIs
require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const keys = require("./keys.js");
//const spotify = new Spotify(keys.spotify);

// parent function to tell user what is possible and fire inquirer process
const promptUserAction = function () {
	// give instructions
	console.log(`Welcome to LIRI! Try typing one of the following: \n'concert-this <artist name>' to find nearby concerts \n'spotify-this-song <song name>' to find album and artist information on a song \n'movie-this <movie>' to get IMDB information about a movie \n'do-what-it-says' to run the contents of the included text file \nYou may also type 'exit' to quit.`)

	inquirer.prompt([
		{
			type: "input",
			name: "userInput"
		}
	]).then(
		function (inquirerResponse) {
			let userString = inquirerResponse.userInput;
			let searchKey = "";
			if (userString.startsWith('concert-this')) {
				searchKey = userString.slice(13);
				concertSearch(searchKey); // call concert function
			}
			else if (userString.startsWith('movie-this')) {
				searchKey = userString.slice(11);
				movieSearch(searchKey); // call imdb function
			}
			else if (userString.startsWith('spotify-this-song')) {
				searchKey = userString.slice(18);
				spotifySearch(searchKey); // call spotify function
			}
			else if (userString.startsWith('do-what-it-says')) {
				searchKey = userString.slice(16);
				fireRandom(); // call random.txt
			}
			else if (userString.toLowerCase() == 'exit') {
				exitProgram = true;
			}
			else // if not a valid prompt, error out
			{
				console.log(`Sorry, I didn't understand that input. Try again?`);
			}
		});
}

const concertSearch = function (searchKey) {
	console.log(`Searching for nearby concerts...`);
}

const movieSearch = function (searchKey) {
	console.log(`Searching for movie data...`);
}

const spotifySearch = function (searchKey) {
	console.log(`Searching for song data...`);
}

const fireRandom = function (searchKey) {
	console.log(`Checking for external commands...`);
}

promptUserAction();
/* take these commands:
concert-this

This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
	Name of the venue
	Venue location
	Date of the Event (use moment to format this as "MM/DD/YYYY")

spotify-this-song
This will show the following information about the song in your terminal/bash window

	Artist(s)
	The song's name
	A preview link of the song from Spotify
	The album that the song is from
	If no song is provided then your program will default to "The Sign" by Ace of Base.
	You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.
	The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a client id and client secret:
	Step One: Visit https://developer.spotify.com/my-applications/#!/
	Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.
	Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
	Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.

movie-this

This will output the following information to your terminal/bash window:

  * Title of the movie.
  * Year the movie came out.
  * IMDB Rating of the movie.
  * Rotten Tomatoes Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie.
	If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

	You'll use the axios package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.

do-what-it-says
Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

	It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
	Edit the text in random.txt to test out the feature for movie-this and concert-this.


In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

Make sure you append each command you run to the log.txt file.
*/