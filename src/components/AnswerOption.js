import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { Icon } from "semantic-ui-react";

import likeCommentMutation from "../mutations/LikeComment";
import dislikeCommentMutation from "../mutations/DislikeComment";
import selectCommentMutation from "../mutations/SelectComment";
import deleteCommentMutation from "../mutations/DeleteComment";

import getCommentsByPostIdQuery from "../queries/GetCommentsByPostId";
import getPostStateQuery from "../queries/GetPostState";
import { isAuthenticated } from "../auth";

class AnswerOption extends Component {

  state = {
    authenticated: false,
    voted: false,
  }

  refetchComments = () => {
    const { postId } = this.props;
    // console.log('refetchqueries');
    return [
      {
        query: getCommentsByPostIdQuery,
        variables: { postId }
      }
    ];
  };

  refetchCommentsAndPostState = () => {
    const { postId } = this.props;
    // console.log('refetchqueries');
    return [
      {
        query: getCommentsByPostIdQuery,
        variables: { postId }
      },
      {
        query: getPostStateQuery,
        variables: { postId }
      }
    ];
  };

  onDealSuccess = () => {
    const {
      match: {
        params: { id: postId }
      },
      comment: { metaAccount: userMetamaskAccount },
      myContract
    } = this.props;

    const options = {
      gas: 100000
    };

    myContract.methods
      .setRecipientAndDealConclusion(postId, userMetamaskAccount)
      .send(options);
    console.log("deal succeed");
  };

  onSelectComment = async selectComment => {
    const {
      comment: { _id: commentId },
      postId,
      terminated
    } = this.props;

    if (terminated) {
      alert("이미 마감된 질문입니다.");
      return;
    }

    try {
      const res = selectComment({ variables: { commentId, postId } });
      this.onDealSuccess();
      await res;
    } catch (err) {
      console.error(err);
    }
  };

  onEstimateComment = async (handleComment, variables) => {
    const { authenticated, voted } = this.state;
    if (voted) {
      alert("이미 투표하셨습니다");
      return;
    }
    if (!authenticated) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    await handleComment(variables);
    this.setState({ voted: true });
  }

  componentDidMount() {
    this.setState({ authenticated: isAuthenticated() })
  }
  
  render() {
    const {
      postId,      
      comment: { _id: commentId, likes, selected,  },
      onChangeEditStatusTrue,
      isMine,
    } = this.props;
    return (
      <Fragment>
        <div className="answer-likes answer-option-item">
          <Mutation
            mutation={likeCommentMutation}
            refetchQueries={this.refetchComments}
          >
            {likeComment => (
              <div
                className="icon"
                onClick={() =>
                  this.onEstimateComment(likeComment, { variables: { postId, commentId }})
                }
              >
                +
              </div>
            )}
          </Mutation>
          <div>{likes}</div>
          <Mutation
            mutation={dislikeCommentMutation}
            refetchQueries={this.refetchComments}
          >
            {dislikeComment => (
              <div
                className="icon"
                onClick={() =>
                  this.onEstimateComment(dislikeComment, { variables: { postId, commentId }})
                }
              >
                -
              </div>
            )}
          </Mutation>
        </div>
        <div className="answer-choose-btn answer-option-item">
          <Mutation
            mutation={selectCommentMutation}
            refetchQueries={this.refetchCommentsAndPostState}
          >
            {selectComment =>
              selected ? (
                <Icon name="check" size="big" color="green" />
              ) : (
                <Icon
                  onClick={() => this.onSelectComment(selectComment)}
                  name="check"
                  size="big"
                />
              )
            }
          </Mutation>
        </div>
        {isMine && 
          <div className="answer-edit answer-option-item">
            <Icon name="edit" onClick={onChangeEditStatusTrue} className="icon"/>
          </div>
        }
        {isMine && 
          <div className="answer-delete answer-option-item">
            <Mutation mutation={deleteCommentMutation} refetchQueries={this.refetchComments}>
              {deleteComment => 
                <Icon name="trash" onClick={() => deleteComment({ variables: { postId, commentId } })} />
              }            
            </Mutation>
          </div>
        }
      </Fragment>
    );
  }
}

export default AnswerOption;
