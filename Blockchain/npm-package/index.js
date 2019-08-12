let contracts = {};

require('require-all')({
  dirname: __dirname + '/artifacts',
  map: function(name, path) {
    contracts[name] = require(path);
    return name;
  },
});

module.exports = contracts;