const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
        Query: {
            me: async(parent, args, context) => {
                if(context.user) {
                    const userData = await User.findOne({ _id: context.user._id })
                    // excluding the version and password 
                    .select('-__v -password')

                    return userData;
                }
                throw new AuthenticationError('Log In Please!');
            },
        },

        Mutation: {
            addUser: async (parent, args) => {
                const user = await User.create(args);
                const token = signToken(user);

                return { token, user };
            },

            login: async (parent, { email, password }) => {
                const user = await User.findOne({ email });

                if(!user) {
                    throw new AuthenticationError('Wrong stuff buddy! 🥺');
                }

                const correctPw = await user.isCorrectPassword(password);

                if(!correctPw) {
                    throw new AuthenticationError('Wrong stuff buddy!');
                }

                const token = signToken(user);
                return { token, user };
            },

            saveBook: async (parent, args , context) => {
                if(context.user) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id},
                        { $addToSet: { savedBooks: args.input }},
                        { new: true, runValidators: true }
                    );

                    return updatedUser;
                }
                throw new AuthenticationError('You are not logged in.')
            },

            removeBook: async (parent, args, context) => {
                if(context.user) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId: args.bookId}}},
                        { new: true }
                    );

                    return updatedUser;
                }

                throw new AuthenticationError('You are not logged in.');
            }
        }
};

module.exports = resolvers;