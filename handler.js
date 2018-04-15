'use strict';

const {
  graphql,
  buildSchema
} = require('graphql');

const {schema} = require('./schema');
const {resolovers} = require('./resolvers');

module.exports.helloC3SBoutique = (event, context, callback) => {
  graphql(schema, event.queryStringParameters.query, resolovers).then(
    resp => callback(null, { statusCode: 200, body: JSON.stringify(resp) }),
    err => callback(err)
  );
};
