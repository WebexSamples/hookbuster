// from node_modules: const logo = require('asciiart-logo');
const logo = require('./logo');
const config = require('./package.json');
config.font = 'Cricket';
config.logoColor = 'bold-green';
config.textColor = 'green';
config.borderColor = 'grey';
console.log(logo(config).render());
