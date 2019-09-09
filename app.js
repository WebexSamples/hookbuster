const listener = require('./src/listener');
const cli = require('./src/cli');
const {fonts} = require('./util/fonts');

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

    cli.requestEvent(resource.events).then(
        event => {

            specs.selection.event = event;
            console.log(fonts.info('starting listener on ') + fonts.highlight(` localhost:${specs.port} `));

            //need to start the listener for each event
            if (event === 'all') {

                for (let e of resource.events) {

                    //all is not supported in the SDK,
                    //but still needed in the options to
                    //allow it to be selected
                    if (e === 'all') {
                        continue;
                    }
                    specs.selection.event = e;
                    listener.runListener(specs);
                }
            } else {
                listener.runListener(specs);
            }
        }
    ).catch(reason => {

        console.log(fonts.error(reason));

        gatherEvent(resource);
    });

}


cli.welcome();
gatherSpecs();





