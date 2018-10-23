# Reddit Fetcher REST API

A simple REST API used to fetch simplified JSON data for the top posts in a given subreddit.

# Dependencies

The Reddit Fetcher API utilizes [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/) for handling server-side REST functionality, [body-parser](https://www.npmjs.com/package/body-parser) for parsing received JSON data, and [Request](https://github.com/request/request) for handling calls to Reddit's API.

# Documentation

## Running the Application

To run the Reddit Fetcher API locally, simply navigate to the directory in which you have `server.js` saved using the command shell of your choice and run it using the command `node server.js`.

## Calling the API

To use the API locally, it is recommended you download [Postman](https://www.getpostman.com/) or a similar API development environment. When running the API locally, the default port is 8080 if none is set manually.

The API can be accessed online at https://tranquil-mesa-89412.herokuapp.com. 

### Getting Subreddits

**URL:** `/api/:subreddit/`

**Method:** `GET`

**Optional URL Params:** ``limit=[integer]``

#### Success Response

**Code:** `200 OK`

**Content examples**

If successful, JSON data returned will be an array of posts in the following format:

```
{
	"subreddit": "news",
	"title": "Judge Upholds Verdict That Found Monsanto’s Roundup Caused a Man’s Cancer",
	"author": "davepilsner73",
	"score": 27332,
	"gilded": 0,
	"created_utc": 1540298040,
	"permalink": "/r/news/comments/9qoiw8/judge_upholds_verdict_that_found_monsantos/",
	"over_18": false,
	"num_comments": 1914
}
```
