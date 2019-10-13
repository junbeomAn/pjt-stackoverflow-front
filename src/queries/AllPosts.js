import gql from "graphql-tag";

export default gql`
  {
    allPosts {
      _id
      userId
      title
      contents
      createdAt
    }
  }
`;
