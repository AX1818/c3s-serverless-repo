const {
  graphql,
  buildSchema
} = require('graphql');

module.exports.schema = buildSchema(`
  input TagInput {
    pkId: String!
    tag: String!
  }

  type Tag {
    pkId: String!
    type: String!
    tag: String!
  }

  enum Status {
    SOLD
    AVAILABLE
  }

  type Clothe {
    pkId: String!
    name: String!
    category: String
    price: Float
    status: String
    tags: [Tag]
  }

  type Query {
    clothes(pkIds: [String]): [Clothe]
    clothe(pkId: String): Clothe
    tags: [Tag]
  }

  type Mutation {
    addTag(tag: String!): Tag
    updateTag(tag: TagInput): Tag
  }

`);
