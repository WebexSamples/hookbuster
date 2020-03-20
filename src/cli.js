const readline = require('readline');
const {fonts} = require('../util/fonts');

const firehose_resource_names = ["rooms", "messages", "memberships", "attachmentActions"];
const options = {

    rooms: {
        alias: 'r',
        description: 'rooms',
        events: [
            'all',
            'created',
            'updated'
        ]
    },
    messages: {
        alias: 'm',
        description: 'messages',
        events: [
            'all',
            'created',
            'deleted'
        ]
    },
    memberships: {
        alias: 'mm',
        description: 'memberships',
        events: [
            'all',
            'created',
            'updated',

            // "seen" events correlate to a "read receipt"
            // there are A LOT of these events
            // there is no webhook for this event (yet)
            // since this app is primarily meant as a webhook replacement
            // we will not register for seen events.
            // Uncomment this if your app wants to use them

            //'seen',
            'deleted'
        ]
    },
    attachmentActions: {
        alias: 'aa',
        description: 'attachmentActions',
        events: [
            'created'
        ]
    },


};

/**
 * Prints logo
 * */
function welcome() {

    const clear = require('clear');
    const config = require('../package.json');
    const logo = require('asciiart-logo');

    clear();
    console.log(logo(config).render());

}

/**
 * Prompts for access token in the console.
 *
 * @return Promise<String> either the answer or an error
 *
 * */
function requestToken() {

    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(fonts.question('Enter your access token'), (answer) => {

            rl.close();

            if (answer !== '') {
                resolve(answer);
            } else {
                reject('token empty');
            }
        });
    });

}

/**
 * Prompts for port in the console.
 *
 * @return Promise<String> either the answer or an error
 *
 * */
function requestPort() {

    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(fonts.question('Enter a port you will forward messages to'), (answer) => {

            rl.close();

            if (answer !== '') {
                resolve(answer);
            } else {
                reject('port empty');
            }

        });

    });
}

/**
 * Prompts for resource in the console. Uses aliases of the
 * {options} Object.
 *
 * @returns Promise<String> either the resource or an error
 *
 * */
function requestResource() {

    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(fonts.question(
            'Select resource [ ' +
            'a - all, ' +
            options.rooms.alias + ' - ' + options.rooms.description + ', '
            + options.messages.alias + ' - ' + options.messages.description + ', '
            + options.memberships.alias + ' - ' + options.memberships.description + ', '
            + options.attachmentActions.alias + ' - ' + options.attachmentActions.description

            + ' ]'),
            (resource_alias) => {

                rl.close();

                if (resource_alias !== '') {

                    switch (resource_alias) {

                        case 'a':
                            resolve(firehose_resource_names);
                            break;

                        case options.rooms.alias:
                            resolve(options.rooms);
                            break;

                        case options.messages.alias:
                            resolve(options.messages);
                            break;

                        case options.memberships.alias:
                            resolve(options.memberships);
                            break;

                        case options.attachmentActions.alias:
                            resolve(options.attachmentActions);
                            break;

                        default:
                            reject('invalid selection');
                    }

                } else {
                    reject('response empty');
                }

            }
        );
    });

}

/**
 * Prompts for event in the console. Events dont have aliases,
 * so it creates a pool of descriptions and uses that. This is
 * because not all resource has the same events, so it needs to
 * determine the event pool dynamically.
 *
 * @returns Promise<String> either the event or an error
 *
 * */
function requestEvent(event_pool) {

    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let option_pool = [];
        let alias_pool = [];

        for (let event of event_pool) {
            alias_pool.push(event[0]);
            option_pool.push(' ' + event[0] + ' - ' + event);
        }

        rl.question(fonts.question(
            `Select event [ ${option_pool} ]`),
            (selection) => {

                rl.close();

                if (selection !== '') {

                    //check if the entered letter is valid
                    if (alias_pool.includes(selection)) {

                        //change selection to full event name and return
                        for (let event of event_pool) {

                            if (selection === event[0]) {
                                console.log(fonts.answer(
                                    event.toUpperCase())
                                );

                                resolve(event);
                            }
                        }

                    } else {
                        reject('event invalid');
                    }

                } else {
                    reject('response empty');
                }
            }
        );

    });

}


module.exports = {
    firehose_resource_names,
    options,
    welcome,
    requestToken,
    requestPort,
    requestResource,
    requestEvent,
    options
};
