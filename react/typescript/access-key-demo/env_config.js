const dotenv = require('dotenv')

module.exports = () => {
  dotenv.config()
  return Object.keys(process.env).reduce((accum, current) => {
    accum[`process.env.${current}`] = JSON.stringify(process.env[current]);
    return accum;
  }, {});
}

