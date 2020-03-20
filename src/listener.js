Webex = require('webex');

const http = require('http');
const {fonts} = require('../util/fonts');

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
 * @param resource object describing the resource to register
 *
 * */
function runListener(specs, resource) {

    specifications = specs;
    const event = specs.selection.event;
    const resource_object = resource;

    _startListener(resource, event);

    //Ctrl+C pushed for exit
    process.on('SIGINT', () =>{

        //nneds to run first to deregister listeners
        _stopListener(resource_object, event);

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
    const resource_name = resource.description;

    runningListeners++;

    // register the listener for events on the messages resource
    webex[resource_name].listen().then(() => {
        console.log(fonts.info(
          `Listening for events from the ${resource_name} resource`));

      //need to register a handler for each event type
      if (event === 'all') {
          //each event needs its own handler
          //if user asked for all cycle through each 
          //event type and register each handler
          for (let event_name of resource.events) {
            if (event_name === 'all') {
              continue;
            }
            // Register a handler to forward the event
            webex[resource_name].on(event_name, event_object => _forwardEvent(event_object));
            console.log(fonts.info(
                'Registered handler to forward  ' +
                fonts.highlight(`${resource_name}:${event_name}`) + ' events'));
        }
    } else {
        // Register a handler to forward the event
        webex[resource_name].on(event, event_object => _forwardEvent(event_object));
        console.log(fonts.info(
          'Registered handler to forward  ') +
          fonts.highlight(`${resource_name}:${event}`) + ' events');
        }
  }).catch(reason => {
      console.log(fonts.error(reason));
      process.exit(-1);
  });    
}

function _stopListener(resource, event) {
    const resource_name = resource.description;

    runningListeners--;

    console.log(fonts.info(
        `stopping listener for ${resource_name.toUpperCase()}:${event.toUpperCase()}`)
    );
  // turn off the event listener
    webex[resource_name].stopListening();
    // deregister the handler(s) for this resource's event(s)
    if (event === 'all') {
        for (let event_name of resource.events) {
            if (event_name === 'all') {
                continue;
            }
            webex[resource_name].off(event_name);
        }
    } else {
        webex[resource_name].off(event);
    }
}

/**
 * Routes incoming request to localhost:port.
 *
 * @param event JSON string of request
 * */
function _forwardEvent(event_object) {
    let event = JSON.stringify(event_object);

    //logging info to the console
    console.log(fonts.info(
      fonts.highlight(`${event_object.resource}:${event_object.event}`) +
      ' received'));

    //gathering some details
    const options = {
        hostname: 'localhost',
        port: specifications.port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': event.length
        }
    };

    //creating the forward request
    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
    });

    req.on('error', error => {
        console.log(fonts.error(error.message));
    });

    //sending the event
    req.write(event);
    req.end();

    console.log(fonts.info(`event forwarded to localhost:${specifications.port}`));
    console.log(fonts.info(event));
}

module.exports = {
    runListener,
    verifyAccessToken
};
