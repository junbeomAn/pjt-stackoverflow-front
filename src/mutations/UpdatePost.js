import gql from 'graphql-tag';

export default gql`
  mutation($postId: String!, $contents: String, $title: String, $tags: [String]) {
  updatePost(postId: $postId, contents: $contents, title: $title, tags: $tags ) {
    ok
  }
}
`;