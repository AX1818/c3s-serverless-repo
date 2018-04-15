const {
  graphql,
  buildSchema
} = require('graphql');

const {schema} = require('../schema');
const {resolovers} = require('./index');

test('test resolving clothes and its schema', ()=> {
  graphql(schema, `query { 
    clothes(id: 101, tags: ["Autum", "Winter"]) {
      id
      name
      price
    }
  }`,
  resolovers).then(clothes => {
    console.log('clothes: ', JSON.stringify(clothes));
  });
});
