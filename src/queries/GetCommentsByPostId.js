import gql from "graphql-tag";

export default gql`
  query($postId: String!) {
    getCommentsByPostId(postId: $postId) {
      _id
      userId
      likes
      contents
      createdAt
      selected
      metaAccount
    }
  }
`;
