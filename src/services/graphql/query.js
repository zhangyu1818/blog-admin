import { gql } from 'apollo-boost';

export const LIMIT_POSTS = gql`
  query limit($currentPage: Int, $pageSize: Int) {
    limitPosts(pagination: { currentPage: $currentPage, pageSize: $pageSize }) {
      pagination {
        currentPage
        pageSize
        total
      }
      posts {
        _id
        title
        postedTime
        updateTime
        revisionCount
        categories
        tags
      }
    }
  }
`;

export const FIND_POST = gql`
  query post($id: String!) {
    post(id: $id) {
      _id
      title
      markdown
      content
      categories
      tags
      postedTime
      updateTime
      revisionCount
    }
  }
`;

export const GET_CATEGORIES = gql`
  {
    categories {
      name
    }
  }
`;

export const GET_TAGS = gql`
  {
    tags {
      name
    }
  }
`;
