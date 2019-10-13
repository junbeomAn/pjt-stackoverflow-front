import gql from 'graphql-tag';

export default gql`
  mutation($commentId: String!, $postId: String!, $contents: String!) {
  updateComment(commentId: $commentId, postId: $postId, contents: $contents ) {
    ok
  }
}
`;