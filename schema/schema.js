const {
  graphql,
  buildSchema
} = require('graphql');

module.exports.schema = buildSchema(`

  input Tags {
    tags: [String]
  }

  type Cloth {
    id: Int!
    name: String
    category: String
    price: Float
  }

  type Query {
    clothes(id: Int, tags: Tags): [Cloth]
  }
`);


/*
  type Tag {
    id: Int!
    tag: String
  }

  type Photo {
    id: Int!
    uri: String!
    width: Int
    height: Int
    creationDate: Int
  }

  enum SaleStatus {
    SOLD
    AVAILABLE
  }


    type Cloth {
    id: Int!
    name: String
    photos: [Photo]
    tags: [Tag]
    category: String
    price: Float
    status: SaleStatus
  }
  */