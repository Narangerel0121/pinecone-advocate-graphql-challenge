import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Task {
    _id: ID!
    userId: String!
    taskName: String!
    description: String!
    isDone: Boolean
    priority: Int!
    tags: [String]
    createdAt: String
    updatedAt: String
  }
  type Mutation {
    sayHello(name: String!): String
    addTask(
      taskName: String!
      description: String!
      priority: Int!
      tags: [String!]
    ): Task
  }
    type Query {
      helloQuery: String
  }
`;
