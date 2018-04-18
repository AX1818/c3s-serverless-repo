const {
  graphql,
  buildSchema
} = require('graphql');

const {schema} = require('../schema');
const {resolovers} = require('./index');


test('test resolving clothes and its schema', ()=> {
  graphql(schema, `query { 
    clothes(pkIds: ["C-100", "C-101"]) {
      pkId
      name
      price
      tags {
        pkId
        tag
      }
    }
  }`,
  resolovers).then(clothes => {
    console.log('clothes: ', JSON.stringify(clothes));
  });
});
test('test resolving clothes and its schema', ()=> {
  graphql(schema, `query { 
    clothes(pkId: "C-101") {
      pkId
      name
      price
    }
  }`,
  resolovers).then(clothes => {
    console.log('clothes: ', JSON.stringify(clothes));
  });
});

test('test fetching all tags', ()=> {
  graphql(schema, `query { 
    tags {
      pkId
      type
      tag
    }
  }`,
  resolovers).then(clothes => {
    console.log('tags: ', JSON.stringify(clothes));
  });
});

test('test fetching clothe by id', ()=> {
  graphql(schema, `query { 
    clothe(pkId: "C-101") {
      pkId
      category
      status
      tags {
        pkId
        tag
      }
    }
  }`,
  resolovers).then(clothe => {
    console.log('Clothe: ', JSON.stringify(clothe));
  });
});



test('test adding Tag', ()=> {
  graphql(schema, `mutation { 
    addTag(tag: "20%Off") {
      pkId
      tag
    }
  }`,
  resolovers).then(tag => {
    console.log('Tag: ', JSON.stringify(tag));
  });
});

test('test updating a Tag', ()=> {
  graphql(schema, `mutation { 
    updateTag(tag: {
      pkId: "36903597-abd3-4313-a724-8b3626062cdb",
      tag: "3DO"
    }) {
      pkId
      tag
    }
  }`,
  resolovers).then(tag => {
    console.log('Tag 2: ', JSON.stringify(tag));
  });
});
