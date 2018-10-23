'use strict';

// Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

// Application settings initialization
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

app.use('/api', router);

app.listen(port);

console.log('Running on port ' + port);

router.get('/:subreddit', function (req, res) { // Fetch subreddit data
    var subreddit = req.params.subreddit;
    var postCount = null;

    // Use post count when provided
    if (!isNaN(req.query.limit)) {
        var limit = Number(req.query.limit);

        if (limit < 1) {
            console.log('Rejected post count of ' + limit);
            return res.status(400).send({ // Return code 400 for post counts under 1
                success: 'false',
                message: 'requested post count must be greater than zero'
            });
        }

        postCount = limit;
    }

    request.get('https://reddit.com/r/' + subreddit + '/.json' + (postCount ? '?limit=' + postCount : ''),
        (serverError, response, body) => {
            if (serverError) { // Error connecting to reddit servers
                res.status(500).send({
                    success: 'false',
                    message: 'could not connect to reddit servers'
                });
                console.log('Failed to connect to reddit servers');
            } else { // Data retrieval succeeded
                var data = JSON.parse(body);
                try {
                    if (data.reason && data.reason === 'quarantined') { // Subreddit is quarantined
                        res.status(400).send({
                            success: 'false',
                            message: '/r/' + subreddit + ' is quarantined'
                        })
                        console.log('Detected that /r/' + subreddit + ' is quarantined');
                    } else if (!data.data) { // Subreddit provided is invalid
                        res.status(400).send({
                            success: 'false',
                            message: '/r/' + subreddit + ' is an invalid name'
                        });
                        console.log('Detected that /r/' + subreddit + ' is an invalid name');
                    } else if (Number(data.data.dist) == 0) { // Data is empty, so subreddit must not exist
                        res.status(400).send({
                            success: 'false',
                            message: '/r/' + subreddit + ' is nonexistent or empty'
                        });
                        console.log('Detected that /r/' + subreddit + ' is either empty or does not exist');
                    } else { // Data present, subreddit exists
                        var postList = data.data.children;
                        var trimmedList = [];
                        try { // Check if each post is valid
                            postList.forEach(post => { // Create condensed version of post JSON data
                                trimmedList.push(trimPost(post.data));
                            });

                            res.status(200).json(trimmedList);
                            console.log('Returned top' + (postCount ? ' ' + postCount : '') + ' posts for /r/' + subreddit);

                        } catch (postError) { // One or more posts are not valid
                            console.log(postError.message);
                            res.status(500).send({
                                success: 'false',
                                message: 'failed to evaluate post content'
                            });
                        }
                    }
                } catch (internalError) { // A field is not present or some other error
                    console.log(internalError.message);
                    res.status(500).send({
                        success: 'false',
                        message: 'an unexpected error occurred'
                    });
                }
            }
        });
})

router.get('/', function (req, res) { // Return that server is running
    res.sendStatus(200);
})

/**
 * @desc Produces a trimmed version of a reddit post's JSON data
 * @param {Object} post The reddit post to be trimmed
 * @returns An object representing the trimmed JSON data
 * @throws An error if the post is undefined or null
 */
function trimPost(post) {
    if (post === undefined || post === null) {
        throw 'Parameter is not a valid post';
    }
    var trimmedPost = {};

    trimmedPost.subreddit = post.subreddit;
    trimmedPost.title = post.title;
    trimmedPost.author = post.author;
    trimmedPost.score = post.score;
    trimmedPost.gilded = post.gilded;
    trimmedPost.created_utc = post.created_utc;
    trimmedPost.permalink = post.permalink;
    trimmedPost.over_18 = post.over_18;
    trimmedPost.num_comments = post.num_comments;

    return trimmedPost;
}
