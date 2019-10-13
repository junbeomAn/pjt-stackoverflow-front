import gql from 'graphql-tag';

export default gql`
  mutation($postId: String!) {
    terminatePost(postId: $postId) {
      ok
    }
  }
`;
