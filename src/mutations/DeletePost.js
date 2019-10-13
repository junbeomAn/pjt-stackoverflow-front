import gql from 'graphql-tag';

export default gql`
  mutation($postId: String!) {
  deletePost(postId: $postId) {
    ok
  }
}
`;