import chalk from 'chalk';

export const fonts = {
    question: (text) => {
        return chalk.bold('? ' + text + ' > ')
    },
    answer: (text) => {
        return chalk.greenBright('! ' + text)
    },
    info: (text) => {
        return chalk.blueBright('INFO: ' + text)
        //return chalk.cyanBright('INFO: ' + text)
    },
    error: (text) => {
        return chalk.bold.red('ERROR: ' + text)
    },
    highlight: (text) => {
        return chalk.magenta(text)
    }
};




