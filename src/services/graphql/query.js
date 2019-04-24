import { gql } from 'apollo-boost';

const LIMIT_POSTS = gql`
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

export { LIMIT_POSTS };
