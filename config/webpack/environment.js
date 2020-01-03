const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')
environment.loaders.append('typescript', {
    test: /.(ts|tsx)$/,
    loader: 'ts-loader'
  });
environment.loaders.prepend('typescript', typescript)
module.exports = environment
