import listener from './src/listener.js';
import cli from './src/cli.js';
import { fonts } from './util/fonts.js';

let specs = {
    target: '',
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

        listener.verifyAccessToken(token).then((person) => {

            console.log(fonts.info(`token authenticated as ${person.displayName}`));
            specs.access_token = token;
            gatherTarget();

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

function gatherTarget() {
    cli.requestTarget().then(target => {

        specs.target = target;

        if (target.trim().length > 0) {
            console.log(fonts.answer(specs.target));

            gatherPort();
        } else {
            console.log(fonts.error('not a valid target. target must be "localhost" a valid IP address or hostname'));
            gatherTarget();
        }

    }).catch(reason => {

        //target empty
        console.log(fonts.error(reason));
        gatherTarget();
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
    specs.access_token = process.env.TOKEN;
    specs.port = parseInt(process.env.PORT);
    if (process.env.TARGET) {
        specs.target = process.env.TARGET
    } else {
        specs.target = 'localhost'
    }
    listener.verifyAccessToken(process.env.TOKEN).then((person) => {
        console.log(fonts.info(`token authenticated as ${person.displayName}`));
        console.log(fonts.info(`forwarding target set as ${specs.target}`));
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





