import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: '/api/graphql',
  onError: (...rest) => console.log(rest),
});

export default client;
