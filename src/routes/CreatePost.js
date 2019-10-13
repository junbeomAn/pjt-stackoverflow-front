import React, { Component, } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import {
  Icon
} from "semantic-ui-react";
import SplitPane from "react-split-pane";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Web3 from 'web3';
import Fade from 'react-reveal/Fade';

import SideNav from "../components/SideNav";
import GetPostsWithPageQuery from "../queries/GetPostsWithPage";
import TopNav from "./../components/TopNav";
import { isAuthenticated } from "../auth";
import ABI from '../ABI';
import StepChanger from "../components/StepChanger";
import Steps from '../components/Steps';

class CreatePost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      contents: "",
      tags: ['React'],
      tagValue: '',
      reward: '',
      account: '',
      myContract: {},
      etherBalance: 0,
      steps: [1,2,3,4],
      currentStep: 1,
    }
  }

  onTransactionDefaultSetting = async () => {
    if (typeof window.web3 !== 'undefined') { 
      // console.log(window.web3);
      window.web3 = new Web3(window.web3.currentProvider);       
    } else {
      console.log('web3 is not defined now');
      return ;
    }

    try {
      const account = await window.web3.eth.getAccounts();
      console.log(account)
      this.setState({ account: account[0] });
      const contract = window.web3.eth.Contract(ABI,"0x8768befc1c821b62c756e9e1a78c905ddc11395a" ,{
        defaultGasPrice: '20000000000',
        defaultAccount: this.state.account,
        
      });  
      const balance = window.web3.eth.getBalance(this.state.account);

      const myContract = await contract;
      const weiBalance = await balance;

      const etherBalance = await window.web3.utils.fromWei(weiBalance);
      this.setState({ myContract, etherBalance });
    } 
    catch (err) {
      console.error(err);
    }
    // this.onSetQuestion();
  }

  onSetQuestion = async (postId) => {
    const { reward, myContract, etherBalance } = this.state;  
    
    if (parseInt(etherBalance) < parseInt(reward)) {
      console.log('not enough balance!!!! Go get more ether!');
      return;
    }   
    try {
      const rewardWei = await window.web3.utils.toWei(reward, 'ether');
      const options = {
        value: rewardWei,
        gas: 3000000,
      }
  
      myContract.methods.setQuestion(postId).send(options); 
    } catch (err) {
      console.error(err);
    }    
  }



  onSubmit = async e => {
    e.preventDefault();
    const { title, contents, tags, reward, account } = this.state;
    if (!title && !contents && !reward) {
      alert("작성되지 않은 폼이 있습니다. 확인 해주세요");
      return
    }
    if (!account) {
      alert("메타마스크 로그인을 확인 해주세요");
      return;
    }
    try {
      const { data: userId } = await axios.get(
        "http://localhost:4000/getUserId",
        { withCredentials: true }
      );
      const res = await this.props.mutate({
        variables: { userId, title, contents, tags, reward: parseFloat(reward) }, // here!!!!!
        refetchQueries: [
          { query: GetPostsWithPageQuery, variables: { page: 1 } }
        ]
      });
      // console.log(res);
      const { ok, post: { _id } } = res.data.createPost;
      this.onSetQuestion(_id);      
      
      if (ok) {
        this.props.history.push('/');
      } else {
        console.log('invalid creating post');
      }
    } catch (err) {
      console.log(err);
    }
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  onAddTag = e => {
    if (e.key  === 'Enter') {
      const value = e.target.value;
      if (this.state.tags.includes(value)) {
        return;
      }
      this.setState({ tags: [...this.state.tags, value ] });
      this.setState({ tagValue: '' });
    }
  }
  
  onDeleteTag = (e) => {
    e.stopPropagation();
    const value = e.target.previousSibling.textContent;
    const tags = this.state.tags.filter(v => v !== value);
    this.setState({ tags })
  }

  onChangeStep = (value) => {
    if (value === 'prev') {
      this.setState({ currentStep: this.state.currentStep - 1 });
    } else {
      this.setState({ currentStep: this.state.currentStep + 1 });
    }
  }

  componentWillMount() {
    if (!isAuthenticated()) {
      alert("로그인이 필요한 서비스입니다")
      this.props.history.push('/');
      return;
    }
  }

  componentDidMount() {
    this.onTransactionDefaultSetting();
  }
  
  render() {
   
    const { contents, title, tags, tagValue, reward, currentStep } = this.state;
    return  (
      <div className="create-post">
        <SplitPane split="vertical" minSize="20%" defaultSize="20%">
          <SideNav>
            <div className="create-post__guide">
              <Steps currentStep={currentStep} />
            </div>            
          </SideNav>
          <main>
            <TopNav {...this.props} />
            <div className="create-post__data">
              <div><h2>질문작성</h2></div>
              <div className="create-post__form-container">
              <StepChanger prevStep={currentStep > 1} nextStep={currentStep < 4} changeStep={this.onChangeStep} />
                {
                  (currentStep === 1) &&
                  <Fade right >
                    <input
                    onChange={this.onChange}
                    value={title}
                    placeholder="제목"
                    name="title"
                    className="create-post__input"
                  />
                </Fade>
                }
                {
                  (currentStep === 2) &&
                  <div className="create-post__contents">
                    <Fade right >
                      <textarea
                      onChange={this.onChange}
                      value={contents}
                      placeholder="내용"
                      name="contents"
                      style={{ minHeight: 300 }}
                      className="create-post__textarea"
                    />
                      <Icon name="angle double right" inverted color="black" size="big" />
                      <div className="create-post__markdown-viewer"><ReactMarkdown source={contents} /></div>
                    </Fade>
                  </div> 
                }
                {
                  (currentStep === 3 ) && 
                  <Fade right>
                    <div className="create-post__tag-creator">
                      <div className="tag-shower">
                        {tags.map((v,i) => <div className="tag" key={v+i} >{v}<Icon name="close" className="tag-close" onClick={this.onDeleteTag}/></div>)}
                        <input placeholder="태그 추가하기" name="tagValue" value={tagValue} onKeyPress={this.onAddTag} onChange={this.onChange}/>                  
                      </div>
                      
                    </div>
                  </Fade>
                }
                {
                  (currentStep === 4) && 
                  <Fade right>
                    <input
                      onChange={this.onChange}
                      value={reward}
                      placeholder="리워드를 입력하세요. 단위는 이더 입니다. ex) 0.01"
                      name="reward"
                      className="create-post__input"
                    />
                    <button className="create-post__submit" onClick={this.onSubmit}>작성</button>
                  </Fade>
                } 
                
              </div>              
            </div>
          </main>
        </SplitPane>
      </div>
    );
  }
}

const createPostMutation = gql`
  mutation(
    $userId: String!
    $title: String!
    $contents: String!
    $tags: [String!]
    $reward: Float!
  ) {
    createPost(
      userId: $userId
      title: $title
      contents: $contents
      tags: $tags
      reward: $reward
    ) {
      ok
      post {
        _id
        title
        contents
        userId
        reward
      }
    }
  }
`;

export default graphql(createPostMutation)(CreatePost);
