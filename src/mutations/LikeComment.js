import gql from 'graphql-tag';

export default gql`
  mutation($commentId: String!, $postId: String!) {
  likeComment(commentId:$commentId, postId: $postId) {
    ok
  }
}
`;