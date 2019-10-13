import gql from 'graphql-tag';

export default gql`
  mutation($postId: String!, $commentId: String!) {
  deleteComment(postId: $postId, commentId: $commentId) {
    ok
  }
}
`;