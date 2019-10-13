import gql from "graphql-tag";

export default gql`
  query($page:Int!, $keyword:String!){
    getPostWithKeyword(page: $page, keyword: $keyword) {
      _id
      userId
      title
      contents
      createdAt
      reward
      comments {
        likes
        contents
        createdAt
        metaAccount
      }
      likes
      tags
      terminated
    }
  }
`;