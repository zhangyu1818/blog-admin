import client from './graphql-client';

import { GET_CATEGORIES, GET_TAGS, FIND_POST } from './graphql/query';
import { ADD_POST, UPDATE_POST } from './graphql/mutation';

export const addPost = async data =>
  await client.mutate({
    variables: { data },
    mutation: ADD_POST,
  });

export const updatePost = async (data, id) =>
  await client.mutate({
    variables: { data, id },
    mutation: UPDATE_POST,
  });

export const getCategories = async () =>
  await client.query({
    query: GET_CATEGORIES,
  });

export const getTags = async () =>
  await client.query({
    query: GET_TAGS,
  });

export const findPost = async id =>
  await client.query({
    variables: { id },
    query: FIND_POST,
  });
