'use strict';

const uuidv4 = require('uuid/v4');

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

const paramTable = {
  TableName : process.env.DYNAMODB_TABLE || 'c3s_boutique_clothes'
};

module.exports.resolovers = {
  clothes({pkIds}) {
    const params = { ...paramTable };
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
    const params = {
      ...paramTable,
      ScanFilter: {
        'type': {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['T']
        }
      }
    };

    console.log('dynammo params: ', JSON.stringify(params));
    return promisify(callback => dynamoDb.scan(params, callback))
    .then(result => {console.log(result.Items); return result.Items;});
  },

  clothe({pkId}) {
    const params = { ...paramTable };
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

  addClothe({clothe}) {
    const pkId = uuidv4();
    const params = {
      ...paramTable,
      Item: {
        ...clothe,
        pkId,
        skId: pkId,
        type: 'C'
     }
    };

    return promisify(callback => dynamoDb.put(params, callback))
    .then(result => {
      console.log("New Clothe: ", result);
      return params.Item;
    });
  },

  updateClothe({clothe}) {
    let attributeUpdates = {};
    clothe.addAttrs && clothe.addAttrs.forEach(attr => attributeUpdates = {...attributeUpdates,
      [attr]: { Action: 'ADD', Value: clothe[attr] }
    });
    clothe.deleteAttrs && clothe.deleteAttrs.forEach(attr => attributeUpdates = {...attributeUpdates,
      [`${attr}`]: { Action: 'DELETE' }
    });
    clothe.putAttrs && clothe.putAttrs.forEach(attr => attributeUpdates = {...attributeUpdates,
      [`${attr}`]: { Action: 'PUT', Value: clothe[`${attr}`] }
    });

    const params = {
      ...paramTable,
      Key: {pkId: clothe.pkId, skId: clothe.pkId},
      AttributeUpdates: attributeUpdates,
      ReturnValues: 'ALL_OLD'
    };

    console.log('upateClothe params ', JSON.stringify(params));

    return promisify(callback => dynamoDb.update(params, callback))
    .then(result => {
      // console.log('result tag: ', JSON.stringify(result));
      return result.Attributes;
    });
  },

  updateTag({tag}) {
    console.log('upateTag --: ', JSON.stringify(tag));
    const params = {
      ...paramTable,
      Key: {pkId: tag.pkId, skId: tag.pkId},
      AttributeUpdates: { 
        tag: {
          Action: 'PUT',
          Value: tag.tag
        }
      },
      ReturnValues: 'ALL_OLD'
    };

    return promisify(callback => dynamoDb.update(params, callback))
    .then(result => {
      // console.log('result tag: ', JSON.stringify(result));
      return result.Attributes;
    });
  },

  addTag({tag}) {
    const pkId = uuidv4();
    const params = {
      ...paramTable,
      Item: {
        pkId,
        skId: pkId,
        type: 'T',
        tag
     }
    };

    return promisify(callback => dynamoDb.put(params, callback))
    .then(result => {
      console.log("result: ", result);
      return params.Item;
    });
  },


  
};