const _ = require('lodash');
const config = require('./config.json');
const mongo = require('mongodb');

const defaultConfig = config.dev;
const environment = process.env.NODE_ENV || 'dev';
const environmentConfig = config[environment];
const fConfig = _.merge(defaultConfig, environmentConfig);

global.gconfig = fConfig;

console.log(`global.gconfig: ${JSON.stringify(global.gconfig, undefined, global.gconfig.json_indentation)}`);


const MongoClient = mongo.MongoClient;
const url = 'mongodb://'+fConfig.serverip+':'+fConfig.port;
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const db = client.db(fConfig.database);
  db.listCollections().toArray().then((docs) => {
      console.log('Available collections:');
      docs.forEach((doc, idx, array) => { console.log(doc.name) });
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    client.close();
  });
});
