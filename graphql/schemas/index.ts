import { gql } from "graphql-tag";

export const typeDefs = gql`
type Task {
_id: ID!
taskName: String!
description: String!
isDone: Boolean!
priority: Int!
tags: [String!]!
createdAt: String
updatedAt: String!
userId: String!
}

type Query {
hellQuery: String
getAllTasks: [Task!]!
getFinishedTasksLists : [Task!]!
}

type Mutation {
sayHello(name: String!): String
addTask(
taskName: String!
description: String!
isDone: Boolean!
priority: Int!
tags: [String!]!
userId: String!
): Task!
updateTask(
_id: ID!
taskName: String!
description: String!
isDone: Boolean!
priority: Int!
tags: [String!]!
userId: String!
): Task
}
`;