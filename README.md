# hookbuster

## Description

This application demonstrates how to register for Webex Teams `message`, `membership` and `rooms` events via websocket using the Webex Javascript SDK.   Currently (as of September, 2019), the Webex JS SDK is the only way to receive Webex events via websocket.   This app is a simple node.js app that registers for events in Webex Teams via websocket, and forwards them to a localhost port for bots or apps that are listening on that port.   It is particularly useful for Webex Teams applications written in a language other than javascript that need to run behind a firewall, and cannot register for webhooks since they do not have a public IP address.

## Requirements

* **Webex Teams access token**: this will be used by the hookbuster to create websocket listeners. Ideally you would use the access token that is used by the application that hookbuster will forward the events to.
* **open port on localhost**: this is where the incoming HTTP requests will be forwarded to, so that the listening app can process them
* **node.js**: will be used to run the app locally
* **npm**: will be used to install dependencies

## Install and run

* clone the repo 
* ```npm install```
* ```node app.js```

## Usage  -- demonstration mode

By default the app will run in "demonstration mode" with a command line interface that solicits the access token, port, and which resources and events to register for:

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
INFO: token authenticated as Bot
? Enter a port you will forward messages to > 5000
! 5000
? Select resource [ a - all, r - rooms, m - messages, mm - memberships, aa - attachmentActions ] > a
INFO: Listening for events from the rooms resource
INFO: Registered handler to forward  rooms:created events
INFO: Registered handler to forward  rooms:updated events
INFO: Listening for events from the messages resource
INFO: Registered handler to forward  messages:created events
INFO: Registered handler to forward  messages:deleted events
INFO: Listening for events from the memberships resource
INFO: Registered handler to forward  memberships:created events
INFO: Registered handler to forward  memberships:updated events
INFO: Registered handler to forward  memberships:deleted events
INFO: Listening for events from the attachmentActions resource
INFO: Registered handler to forward  attachmentActions:created events
```

**Tip**: you can use the [javabot](https://github.com/WebexSamples/javabot) to test how this app works. Start **javabot** with your access token and enter a localhost port, where **javabot** will listen to incoming messages. While both apps are running, open a Webex Teams space with the bot, whose access token you used and say **hello**. It should greet you back. :wave:

## Usage -- deployment mode

If the following environment variables are set:

* TOKEN
* PORT

hookbuster will automatically register for all of the [webhook firehose](https://developer.webex.com/docs/api/guides/webhooks/the-firehose-webhook) events, using the TOKEN and then forward any received events to localhost:PORT

## Dependencies

```json
"dependencies": {
  "asciiart-logo": "^0.2.6",
  "chalk": "^2.4.2",
  "clear": "^0.1.0",
  "webex": "^1.80.154"
}
```

## A note about "read receipts"

In addition to adding support for Webex Teams events via websocket, the Webex JSSDK also introduces a new memberships:seen event which effectively notifies an application when a member of a space has seen messages posted in that space. As of September, 2019, there is not yet a corresponding webhook, and consequently this event is not one that is delivered via the [webhook firehose](https://developer.webex.com/docs/api/guides/webhooks/the-firehose-webhook). Since this app is designed primarily as a way to get webhook events to applications running behind a firewall, by default it does NOT register for membership:seen events.

If you would like to add membership:seen (read receipt) event processing to your application, simply uncomment the `seen` element in the `object.memberships` object defined near the top of [cli.js](./src/cli.js)

For more information on how the membership:seen events behave, run the [events via socket JSSDK sample](https://js.samples.s4d.io/browser-socket/).  It is worth noting that the system generally generates MANY more membership:seen events than all the rest of the Webex Teams events, so register for these only if your app is able to make use of them.
