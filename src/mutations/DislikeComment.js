import gql from 'graphql-tag';

export default gql`
mutation($commentId: String!, $postId: String!) {
  dislikeComment(commentId:$commentId, postId: $postId) {
    ok
  }
}
`;