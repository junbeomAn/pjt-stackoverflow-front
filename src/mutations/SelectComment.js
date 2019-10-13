import gql from 'graphql-tag';

export default gql`
  mutation($commentId: String!, $postId: String!) {
    selectComment(commentId:$commentId, postId: $postId) {
      ok
    }
  }
`;