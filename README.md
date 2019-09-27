# liri-node-app

## What is this?
LIRI Node is a small app that allows users to pull information about the music they like, the movies they watch, or even find upcoming concerts by the artists they love.

## How does it work?
A simple command line interface runs the entire system. Simply open the file in node and the app will lead you forward, with straightforward instructions on the four commands it understands.

![Running the app](/assets/demo-screencap.gif)

### concert-this
By using axios and the Bands in Town API, this command is able to search for upcoming concerts featuring whatever band the user indicates, and print the results to the console. Because the Bands In Town returns date information in a somewhat awkward format, moment.js is also used to generate more readable dates

### spotify-this-song
This command uses Spotify's custom API to gather artist and album data on the user's indicated song. Album selection can be quirky and often returns Best Of albums instead of original release albums, an issue we're working on fixing in a future patch.

### movie-this
Via axios and the Open Movie Database API, this command prints plot summaries, headlining actors, and even multiple user ratings for the movie the user searches.

### do-what-it-says
Included with the app is a file simply named **random.txt**, the contents of which can be edited to include any valid command or search. When the user types the *do-what-it-says* command, LIRI node will use node.js' built-in fs module to read the contents of the file and try to execute whatever it finds there.

### Open strings versus quotes
When giving search commands, an entry such as **movie-this October Sky** will usually return the expected result, but for best and most reliable function, adding quotes to titles with multiple words, ie **movie-this "October Sky"**, is recommended.

### Reading returned data at your leisure
Each command prints not only to the console, but to a text file in the LIRI node folder named *log.js*, which will be created if it does not already exist. This file can be examined at the user's leisure, potentially allowing for a more comfortable reading experience than the console. However, due to the variable nature of line breaks across operating systems and word processing applications, some users may find that the formatting in *log.js* has failed.

![The log file](/assets/log-screencap.jpg)

## Who are we?
We are Mars Getsoian, author of code and capturer of gifs, and the University of Oregon Coding Boot Camp, conceptualizer of app function and appraiser of modules.