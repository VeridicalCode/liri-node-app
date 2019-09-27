
// includes: env & file for masking keys, inquirer for prompts, spotify API for spotify, axios for other APIs, moment for date fixing
require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const moment = require('moment');

// function to look at user input and figure out which function to call.
//   we separate this out from the prompt promise because we also want to be able to //   call it on the contents of random.txt if random.txt was queried
const parseInputString = function (userString) {
	let searchKey = ""; // variable is a string, for safety
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
	else // if not a valid prompt, error out
	{
		console.log(`Sorry, I didn't understand that input. Try again?`);
		promptUserAction(); // call the parent function with prompt/promise
	}
}

// parent function to tell user what is possible and fire inquirer process
const promptUserAction = function () {
	// give instructions
	console.log(`\n'concert-this <artist name>' to find nearby concerts \n'spotify-this-song <song name>' to find album and artist information on a song \n'movie-this <movie>' to get IMDB information about a movie \n'do-what-it-says' to run the contents of the included text file \nYou may also type 'exit' to quit.`)

	inquirer.prompt([ // use inquirer module to ask user for a string
		{
			type: "input",
			name: "userInput"
		}
	]).then( // fires on the user's input
		function (inquirerResponse) {
			let userString = inquirerResponse.userInput; // store user input as var
			userString = userString.toLowerCase(); // unify case first

			if (userString.startsWith('do-what-it-says')) {
				fireRandom(); // call random.txt
			}
			else if (userString.startsWith('exit')) {
				return;
			}
			else { // if we didn't quit or call the text file, operate on the command itself
				parseInputString(userString);
			}
		});
}

// date-fixing function, using moment.js to make dates human-readable
const fixDate = function(dateVar){
	return moment(dateVar).format('MMMM Do YYYY, h:mm a');
}


// bands in town concert function. for some reason this doesn't always return the
//  same results as pasting literally the exact same url into a web browser.
const concertSearch = function (searchKey) {
	console.log(`Searching for nearby concerts...\n`);
	let urlVar = `https://rest.bandsintown.com/artists/${searchKey}/events?app_id=codingbootcamp`
	axios.get(urlVar)
		.then(function (response) {
			let bandJSON = response.data;

			if (!bandJSON[0].venue.city) { // bad data return is variable, but will at least always not have this property
				console.log(`Something went wrong. That band may not be touring right now, or may not be a real band.`);
			}
			else { // log to console/.txt file. We put these logs outside the FOR loop because we only want the header once
				console.log(`Upcoming ${searchKey} concerts:`);
				fs.appendFile('log.txt', `\n---- Upcoming ${searchKey} concerts: ----`, function (error) {
					if (error) {
						console.log(`AppendFile error: ${error}`);
					}
				}) // now we loop through the returned JSON and print every concert
				for (let i = 0; i < bandJSON.length; i++) {
					// fix the date
					let playDate = fixDate(bandJSON[i].datetime);

					// make a variable holding relevant data in a string
					let resultString = `\n${bandJSON[i].venue.name}`
					+ `\n${bandJSON[i].venue.city}`
					+ `\n${playDate}`;

					// log to console and log.txt
					console.log(resultString);
					fs.appendFile('log.txt', resultString, function (error) {
						if (error) {
							console.log(`AppendFile error: ${error}`);
						}
					})
				}
			} // once we're done, loop back to user prompt again
			promptUserAction();
		});
}

// movie searching function
const movieSearch = function (searchKey) {
	console.log(`Searching for movie data...\n`);
	// fallback search if movie string is null
	if (!searchKey){
		console.log(`No valid search key provided! Searching for a van Dormael classic.\n`);
		searchKey = 'Mr. Nobody';
	}

	// create valid url based on user input/fallback and feed to API via axios
	let urlVar = `http://www.omdbapi.com/?apikey=trilogy&t=${searchKey}`
	axios.get(urlVar)
		.then(function (response) {
			let movieJSON = response.data; // store response JSON as var
			//pull relevant data, save to string
			let resultString = `---- ${movieJSON.Title.toUpperCase()}`
			+ `----\nYear: ${movieJSON.Year}`
			+`\nCritical ratings: ${movieJSON.Ratings[0].Value} @IMDB, ${movieJSON.Ratings[1].Value} @Rotten Tomatoes`
			+`\nProduced in ${movieJSON.Country}`
			+`\nStarring ${movieJSON.Actors}`
			+`\n\n${movieJSON.Plot}`;

			// print string to console & log.txt
			console.log(resultString);
			fs.appendFile('log.txt', `\n\n${resultString}`, function (error) {
				if (error) {
					console.log(`AppendFile error: ${error}`);
				}
			}) // loop back to user prompt
			promptUserAction();
		});
}

// function for spotify search on song
const spotifySearch = function (searchKey) {
	console.log(`Searching for song data...\n`);
	// fallback search if song name is null
	if (!searchKey){
		console.log(`No valid search key was provided. Searching Ace of Base catalog instead.\n`);
		searchKey = '"the sign"';
	}

	// unique spotify API doesn't use axios and can just take search key straight up
	spotify.search({
		type: 'track',
		query: searchKey
		}).then(function(response) {

			// returned data is a bit of a mess; we want to drill down on the first entry in the first key
			let songJSON = response.tracks.items[0];
			
			// pull out relevant data and store it as a string
			let resultString = `---- ${songJSON.name.toUpperCase()} ----`
					+`\nArtist: ${songJSON.artists[0].name}`
					+`\nAlbum: ${songJSON.album.name}`
					+`\nPreview on Spotify: ${songJSON.external_urls.spotify}`

					// print to console and log.txt
					console.log(resultString);
					fs.appendFile('log.txt', `\n\n${resultString}`, 'utf8', function(error){
						if (error){
							console.log(`AppendFile error: ${error}`);
						}
					}); // loop back to user prompt
			promptUserAction();
			
		}).catch(function(error) { // spotify API provides an error throw, might as well catch it
    console.log(`Error in Spotify API: ${error}`);
  })

}

// function for reading the random.txt file
const fireRandom = function () {
	console.log(`Checking for external commands...`);
	fs.readFile('./random.txt', 'utf8', (error, contents) => {
		if (error) {
			console.log(`readFile error: ${error}`);
		}
		parseInputString(contents); // whatever we get back, feed it to the actual parse function. if it's not valid parseInputString() will catch that.
	});
}
// fire the parent prompt function once to get things going
promptUserAction();
