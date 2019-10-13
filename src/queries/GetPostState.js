import gql from 'graphql-tag';

export default gql`
  query($postId: String!) {
    getPostState(postId: $postId) {
      terminated
    }
  }
`;