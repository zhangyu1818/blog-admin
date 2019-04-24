import { gql } from 'apollo-boost';
import client from './graphql-client';

const addPost = async data =>
  await client.mutate({
    variables: { data },
    mutation: gql`
      mutation addPost($data: AddPostInput!) {
        addPost(data: $data) {
          _id
        }
      }
    `,
  });
const getCategories = async () =>
  await client.query({
    query: gql`
      {
        categories {
          name
        }
      }
    `,
  });
export { addPost, getCategories };
