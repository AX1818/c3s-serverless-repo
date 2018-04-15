const {
  graphql,
  buildSchema
} = require('graphql');

const {schema} = require('../schema/schema');
const {clothResolver} = require('./cloth.resolver');

test('test resolving clothes and its schema', ()=> {
  graphql(schema, `query { 
    clothes(id: 1, tags: {tags: ["FAKE", "TAG"]}) {
      id
      name
    }
  }`,

  clothResolver).then(resp => {

    console.log('resp: ', JSON.stringify(resp));

  });
});