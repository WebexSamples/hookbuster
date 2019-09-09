const chalk = require('chalk');

let fonts = {
    question: (text) => {
        return chalk.bold('? ' + text + ' > ')
    },
    answer: (text) => {
        return chalk.greenBright('! ' + text)
    },
    info: (text) => {
        return chalk.cyanBright('INFO: ' + text)
    },
    error: (text) => {
        return (chalk.redBright('ERROR: ' + text))
    },
    highlight: (text) => {
        return (chalk.bgRed(text))
    }
};

module.exports = {fonts};


