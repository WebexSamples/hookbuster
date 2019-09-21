const listener = require('./src/listener');
const cli = require('./src/cli');
const {fonts } = require('./util/fonts');

let specs = {
    access_token: '',
    port: 0,
    selection: {
        resource: '',
        event: ''
    }
};

/**
 * Starts gathering the specifications in order to start
 * the listener.
 *
 * **Steps of gathering specifications:**
 * 1. Requests access token and waits for the Promise from the terminal
 * 2. Requests resource and waits for the Promise from the terminal
 * 3. Requests event and waits for the Promise from the terminal
 *
 * */
function gatherSpecs() {

    cli.requestToken().then(token => {

        console.log(fonts.answer(token));

        listener.verifyAccessToken(token).then((person) => {

            console.log(fonts.info(`token authenticated as ${person.displayName}`));
            specs.access_token = token;
            gatherPort();

        }).catch(
            reason => {
                //token not authorized
                console.log(fonts.error(reason));
                gatherSpecs();
            }
        );

    }).catch(reason => {
        console.log(fonts.error(reason));
        gatherSpecs();
    });
}

function gatherPort() {
    cli.requestPort().then(port => {

        specs.port = parseInt(port);

        if (!isNaN(specs.port)) {
            console.log(fonts.answer(specs.port));

            //listener.runListener(specs);
            gatherResource();
        } else {
            console.log(fonts.error('not a number'));
            gatherPort();
        }

    }).catch(reason => {

        //port empty
        console.log(fonts.error(reason));
        gatherPort();
    });
}

function gatherResource() {

    cli.requestResource().then(resource => {

        if (Array.isArray(resource)) {
            // user selected "all"
            specs.selection.event = 'all';
            for (let resource_name of resource) { 
                listener.runListener(specs, cli.options[resource_name]);
            }
            return;
        }

        // Collect the event(s) for the selected resource 
        console.log(fonts.answer(
            resource.description.toUpperCase())
        );
        specs.selection.resource = resource.description;

        gatherEvent(resource);

    }).catch(reason => {
        console.log(fonts.error(reason));
        gatherResource();
    });
}

/**
 * Gathers event and hands the specifications object to
 * the listener to start.
 *
 * */
function gatherEvent(resource) {

    cli.requestEvent(resource.events).then(event => {

        specs.selection.event = event;
        // register to receive events for this resource
        // and define handlers for the requested event(s) 
        listener.runListener(specs, resource);
    }).catch(reason => {
        console.log(fonts.error(reason));
        gatherEvent(resource);
    });
}


if ((process.env.TOKEN) && (process.env.PORT)) {
    specs.port = parseInt(process.env.PORT);
    specs.access_token = process.env.TOKEN;
    listener.verifyAccessToken(process.env.TOKEN).then((person) => {
        console.log(fonts.info(`token authenticated as ${person.displayName}`));
        specs.selection.event = 'all';
        for (let resource_object of cli.firehose_resource_names) { 
            listener.runListener(specs, cli.options[resource_object]);
        }
        }).catch(reason => {
            //token not authorized
            console.log(fonts.error(reason));
            process.exit(-1);
      });
} else {
    cli.welcome();
    gatherSpecs();
}





