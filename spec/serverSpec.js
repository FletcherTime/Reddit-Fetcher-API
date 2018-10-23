var request = require('request');

var baseUrl = 'http://localhost:8080/api/';

describe('Calling GET on base URL', function () {
    it('returns status code 200', function (done) {
        request.get(baseUrl, function (error, response, body) {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Calling GET on a URL extension', function () {
    describe('for a valid subreddit with no limit', function () {
        it('returns a valid JSON object', function (done) {
            request.get(baseUrl + 'all', function (error, response, body) {
                expect(function () {
                    JSON.parse(body);
                }).not.toThrow();
                done();
            });
        });
        it('returns a JSON object with children', function (done) {
            request.get(baseUrl + 'all', function (error, response, body) {
                var data = JSON.parse(body);
                expect(data.constructor === Array).toBe(true);
                done();
            });
        });
    });
    describe('for a valid subreddit with valid limit', function () {
        it('returns that many posts', function (done) {
            request.get(baseUrl + 'all?limit=5', function (error, response, body) {
                var data = JSON.parse(body);
                expect(data.length).toBe(5);
                done();
            });
        });
    });
    describe('for a valid subreddit with invalid limit', function () {
        it('returns a code 400', function (done) {
            request.get(baseUrl + 'all?limit=0', function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
        it('returns the appropriate error message', function (done) {
            request.get(baseUrl + 'all?limit=0', function (error, response, body) {
                var data = JSON.parse(body);
                expect(data.message).toBe('requested post count must be greater than zero');
                done();
            });
        });
    });
    describe('for a quarantined subreddit', function () {
        it('returns a code 400', function (done) {
            request.get(baseUrl + 'watchpeopledie', function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
        it('returns the appropriate error message', function (done) {
            request.get(baseUrl + 'watchpeopledie', function (error, response, body) {
                var data = JSON.parse(body);
                expect(data.message).toBe('/r/watchpeopledie is quarantined');
                done();
            });
        });
    });
    describe('for an empty subreddit', function () {
        it('returns a code 400', function (done) {
            request.get(baseUrl + 'whodaheckdunnit', function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
        it('returns the appropriate error message', function (done) {
            request.get(baseUrl + 'whodaheckdunnit', function (error, response, body) {
                var data = JSON.parse(body);
                expect(data.message).toBe('/r/whodaheckdunnit is nonexistent or empty');
                done();
            })
        });
    });
    describe('for an invalid subreddit', function () {
        it('returns a code 400', function (done) {
            request.get(baseUrl + '*#@D**', function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
        it('returns the appropriate error message', function (done) {
            request.get(baseUrl + '@@@@', function (error, response, body) {
                var data = JSON.parse(body);
                expect(data.message).toBe('/r/@@@@ is an invalid name');
                done();
            });
        });
    });
});