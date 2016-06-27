# love-messenger
[![Travis CI status](https://travis-ci.org/gish/love-messenger.svg)](https://travis-ci.org/gish/love-messenger)

Send love messages to your dearly beloved via your favorite HTTP action.

This app retrieves a message of the day from a Google Spreadsheet and sends it via [46elks](https://www.46elks.com/) messaging API to a specified number. The app is tailored for running on a free Heroku dyno and to be called daily via a free cron service (e g [Crondash](https://crondash.com/)).

# Send message
Call the `/message` endpoint with POST and the query var `key` set to the `API_KEY` defined in the env vars.

```
$ curl -X POST http://localhost:8080/message?key=abc123
```

# Running in production on Heroku
1. Set the env vars in the Heroku app panel
1. `$ npm install`
1. `$ heroku local`

## Env vars
The following env vars are required
* `API_KEY`: The API key for the application
* `ELKS_API_PASSWORD`: Your 46elks password
* `ELKS_API_USERNAME`: Your 46elks username
* `GOOGLE_SPREADSHEET_ID`: The ID of the message spreadsheet
* `MESSAGE_RECEIVER_NUMBER`: Number to receiver, in international format
* `MESSAGE_SENDER_NAME`: Name of the sender

# Running locally
1. Define the env vars for production in _.env_
1. `$ npm install`
1. `$ heroku local`

# Develop
Run tests with `$ npm run test`
Watch tests with `$ npm run test:watch`
Run test coverage report with `$ npm run test:coverage`

# Message spreadsheet
The messages to be sent are retrieved from a Google Spreadsheet.  [This sample sheet](https://docs.google.com/spreadsheets/d/1WQNN7rUDkpccCtDu6QDQUu2z1wE8msOZS8QWcFw5kvQ/pubhtml) has ID _1WQNN7rUDkpccCtDu6QDQUu2z1wE8msOZS8QWcFw5kvQ_, which is what is supposed to be the value of the env var `GOOGLE_SPREADSHEET_ID`.
