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

  type AttributeUpdate {
    attribute: String!

  }

  input ClotheInput {
    pkId: String
    name: String!
    category: String
    price: Float
    status: String
    toRemove: String
    addAttrs: [String]
    deleteAttrs: [String]
    putAttrs: [String]
  }

  type Clothe {
    pkId: String!
    name: String!
    category: String
    price: Float
    status: String
    toRemove: String
    tags: [Tag]
  }

  type Query {
    clothes(pkIds: [String]): [Clothe]
    clothe(pkId: String): Clothe
    tags: [Tag]
  }

  type Mutation {
    addClothe(clothe: ClotheInput!): Clothe
    updateClothe(clothe: ClotheInput!): Clothe
    addTag(tag: String!): Tag
    updateTag(tag: TagInput!): Tag
  }

`);
