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
  clothes({pkIds}) {
    console.log('query aprams: ', JSON.stringify(pkIds));
    let params = {
      TableName : process.env.DYNAMODB_TABLE || 'c3s_boutique_clothes'
    };

    if (pkIds && pkIds.length) {
      params.ScanFilter = {...params.ScanFilter,
        'pkId' : {
          ComparisonOperator: 'IN',
          AttributeValueList: pkIds
        }
      }
    }

    console.log('dynammo params: ', JSON.stringify(params));
    return promisify(callback => dynamoDb.scan(params, callback))
    .then(result => {
      console.log(result.Items); 
      const clothes = result.Items.filter(item => item.type === 'C');
      const tags = result.Items.filter(item => item.type === 'CT');
      clothes.forEach(clothe => clothe.tags = tags.filter(tag => tag.pkId === clothe.pkId).map(tag => ( { pkId: tag.skId, tag: tag.tag } )));
      return clothes;
    });
  },

  tags() {
    let params = {
      TableName : process.env.DYNAMODB_TABLE || 'c3s_boutique_clothes'
    };

    params.ScanFilter = {...params.ScanFilter,
      'type' : {
        ComparisonOperator: 'EQ',
        AttributeValueList: [ 'T' ]
      },
    };

    console.log('dynammo params: ', JSON.stringify(params));
    return promisify(callback => dynamoDb.scan(params, callback))
    .then(result => {console.log(result.Items); return result.Items;});
  },

  clothe({pkId}) {
    console.log('query aprams: ---- ', JSON.stringify({pkId}));
    let params = {
      TableName : process.env.DYNAMODB_TABLE || 'c3s_boutique_clothes'
    };

    if (pkId) {
      params.ScanFilter = {...params.ScanFilter,
        'pkId' : {
          ComparisonOperator: 'EQ',
          AttributeValueList: [ pkId ]
        }
      }
    }

    return promisify(callback => dynamoDb.scan(params, callback))
    .then(result => {
      const tags = [];
      let clothe = undefined;
      result.Items.map(item => {
        if (item.type === 'C') {
          clothe = item;
        } else if (item.type === 'CT') {
          tags.push({pkId: item.skId, tag: item.tag});
        }
      });
      clothe.tags= tags;
      return clothe;
    });
  },
};