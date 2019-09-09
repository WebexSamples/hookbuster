# hookbuster
## Description
Used to listen to events in Webex Teams and forward them to a localhost port for bots or apps that are listening on that port.

## Requirements

* **Webex Teams access token**: this will be used by the hookbuster to create websocket listeners. Ideally you would use the access token of the same bot here, that is listening on localhost.
* **open port on localhost**: this is where the incoming HTTP requests will be forwarded to, so that the listening app can process them
* **node.js**: will be used to run the app locally

## Installation
* clone the repo (npm packages are already included, so don't need to do ```npm install```)
* ```node app.js```

## Usage

```
  ,----------------------------------------------------------.
  |                                                          |
  |    _   _             _    _               _              |
  |   | | | | ___   ___ | | _| |__  _   _ ___| |_ ___ _ __   |
  |   | |_| |/ _ \ / _ \| |/ / '_ \| | | / __| __/ _ \ '__|  |
  |   |  _  | (_) | (_) |   <| |_) | |_| \__ \ ||  __/ |     |
  |   |_| |_|\___/ \___/|_|\_\_.__/ \__,_|___/\__\___|_|     |
  |                                                          |
  |                                                          |
  `----------------------------------------------------------'

? Enter your access token > AaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJj_ABCD_1a2b3c4d-1234-abcd-9876-abcdefghijkl
! AaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJj_ABCD_1a2b3c4d-1234-abcd-9876-abcdefghijkl
INFO: token authenticated as BeanBot
? Enter a port you will forward messages to > 5000
! 5000
? Select resource [ r - rooms, m - messages, mm - memberships ] > m
! MESSAGES
? Select event [  a - all, c - created, d - deleted ] > a
! ALL
INFO: starting listener on  localhost:5000 
INFO: listener is running for  MESSAGES:DELETED 
INFO: listener is running for  MESSAGES:CREATED 
```

## Dependencies

```json
"dependencies": {
  "asciiart-logo": "^0.2.6",
  "chalk": "^2.4.2",
  "clear": "^0.1.0",
  "webex": "^1.72.6"
}
```
