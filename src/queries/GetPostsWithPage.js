import gql from "graphql-tag";

export default gql`
  query($page: Int!) {
    getPostsWithPage(page: $page) {
      _id
      userId
      title
      contents
      createdAt
      reward
      comments {
        likes
        contents
        createdAt
        metaAccount
      }
      likes
      tags
      terminated
    }
  }
`;
