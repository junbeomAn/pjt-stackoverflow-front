import gql from 'graphql-tag';

export default gql`
  query($_id: String!) {
    getPost(_id: $_id) {
      _id
      userId
      title
      contents
      createdAt
      reward
      comments {
        likes
      }
      likes
      tags
      terminated
    }
  }
`;