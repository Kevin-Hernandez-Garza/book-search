// importing the gql tagged template function
const { gql } = require('apollo-server-express');

// create typeDefs
const typeDefs = gpl`
    type User {
        _id: ID!
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Query {
        me: User
    }

    type Auth {
        token: ID!
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser( username: String!, email: String!, password: String!): Auth
        saveBook(input: saveBook!): User
        removeBook: (bookId: ID!): User
    }

    type Book {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String!
        link: String
    }

    input saveBook {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
`;

// export the typeDefs 
module.exports = typeDefs;