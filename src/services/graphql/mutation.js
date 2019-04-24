import { gql } from 'apollo-boost';

const ADD_POST = gql`
  mutation addPost($data: AddPostInput!) {
    addPost(data: $data) {
      _id
    }
  }
`;
export { ADD_POST };
