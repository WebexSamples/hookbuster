Webex = require('webex');

const http = require('http');
const {fonts} = require('../util/fonts');
const {options} = require('./cli');

let webex;

/**
 * This is used to keep track of the number of running listeners.
 * When a listener is started, the number goes up. When Ctrl+C is
 * pushed, then listeners are stopped 1 by 1, and the number decreases.
 * Only once it hits 0, the process is terminated and the application exits.
 * Without this it is either exiting too early without stopping all listeners,
 * or not exiting.
 * */
let runningListeners = 0;


/**
 * @type Object containing access_token: String, port: int,
 * selection [resource:String, event:String]
 *
 * */
let specifications = {};


function verifyAccessToken(accessToken) {

    _initializeWebex(accessToken);

    return new Promise((resolve, reject) => {

        webex.people.get('me').then(person => {
            resolve(person);

        }).catch(() => {
                reject('not authenticated');
            }
        );
    });

}

/**
 * @param specs object with resource and event
 *
 * */
function runListener(specs) {

    specifications = specs;
    const resource = specs.selection.resource;
    const event = specs.selection.event;

    _initializeWebex(specs.access_token);
    _startListener(resource, event);

    //Ctrl+C pushed for exit
    process.on('SIGINT', () =>{

        //nneds to run first to deregister listeners
        _stopListener(resource, event);

        if (runningListeners === 0) {
            //all listeners were stopped
            process.exit(0);
        }

    });

}

function _initializeWebex(accessToken) {
    webex = Webex.init({
        credentials: {
            access_token: accessToken
        }
    });
}

/**
 * Starts a websocket listener for the selected resource
 * and event.
 *
 * */
function _startListener(resource, event) {
    runningListeners++;

    switch (resource) {
        case options.messages.description:

            webex.messages.listen().then(() => {

                //logging a formatted info message in the console
                console.log(fonts.info(
                    'listener is running for ') +
                    fonts.highlight(` ${resource.toUpperCase()}:${event.toUpperCase()} `)
                );

                webex.messages.on(event, request => {

                    let request_string = JSON.stringify(request);

                    _forwardRequest(request_string);

                });



            }).catch(reason => {
                console.log(fonts.error(reason));
            });

            break;

        case options.memberships.description:

            webex.memberships.listen().then(() => {

                console.log(fonts.info(
                    'listener is running for ') +
                    fonts.highlight(` ${resource.toUpperCase()}:${event.toUpperCase()} `)
                );

                webex.memberships.on(event, request => {

                    let request_string = JSON.stringify(request);

                    _forwardRequest(request_string);

                });

            }).catch(reason => {
                console.log(fonts.error(reason));
            });

            break;

        case options.rooms.description:

            webex.rooms.listen().then(() => {

                console.log(fonts.info(
                    'listener is running for ') +
                    fonts.highlight(` ${resource.toUpperCase()}:${event.toUpperCase()} `)
                );

                webex.rooms.on(event, request => {

                    let request_string = JSON.stringify(request);

                    _forwardRequest(request_string);

                });

            }).catch(reason => {
                console.log(fonts.error(reason));
            });
            break;
    }
}

function _stopListener(resource, event) {
    console.log(
        fonts.info(`stopping listener for ${resource.toUpperCase()}:${event.toUpperCase()}`)
    );
    runningListeners--;

    switch (resource) {
        case options.messages.description:
            webex.messages.stopListening();
            webex.messages.off(event);

            break;

        case options.memberships.description:
            webex.memberships.stopListening();
            webex.memberships.off(event);
            break;

        case options.rooms.description:
            webex.rooms.stopListening();
            webex.rooms.off(event);
            break;
    }
}

/**
 * Routes incoming request to localhost:port.
 *
 * @param request JSON string of request
 * */
function _forwardRequest(request) {

    //logging info to the console
    console.log(fonts.info('request received'));

    //gathering some details
    const options = {
        hostname: 'localhost',
        port: specifications.port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': request.length
        }
    };

    //creating the forward request
    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
    });

    req.on('error', error => {
        console.log(fonts.error(error.message));
    });

    //sending the request
    req.write(request);
    req.end();

    console.log(fonts.info(`request forwarded to localhost:${specifications.port}`));
    console.log(fonts.info(request));
}

module.exports = {
    runListener,
    verifyAccessToken
};
