'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if(error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
});


module.exports.resolovers = {
  clothes: ({id, tags}) => {
    console.log('query aprams: ', JSON.stringify({id, tags}));
    let params = {
      TableName : process.env.DYNAMODB_TABLE || 'c3s_boutique_clothes'
    };

    if (id) {
      params.ScanFilter = {...params.ScanFilter,  'id' : {
          ComparisonOperator: 'EQ',
          AttributeValueList: [ id ]
        }
      }
    }

    // if (tags && tags.length) {
    //   params.ScanFilter = {...params.ScanFilter, 'tags[0]' : {
    //       ComparisonOperator: 'EQ',
    //       AttributeValueList: [tags[0]]
    //     }
    //   }
    // }

    console.log('dynammo params: ', JSON.stringify(params));
    return promisify(callback => dynamoDb.scan(params, callback))
    .then(result => result.Items);
  }
};