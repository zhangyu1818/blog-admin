import { gql } from 'apollo-boost';

export const ADD_POST = gql`
  mutation addPost($data: AddPostInput!) {
    post: addPost(data: $data) {
      _id
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($data: UpdatePostInput!, $id: String!) {
    post: updatePost(data: $data, id: $id) {
      _id
    }
  }
`;
