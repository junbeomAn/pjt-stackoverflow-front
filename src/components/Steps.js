import React, { Component } from "react";
import { Icon, Step, Input } from "semantic-ui-react";
import axios from 'axios';

class Steps extends Component {

  state = {
    currentPrice: '',
    value: '',    
  }

  componentDidMount () {
    setInterval(() => {
      axios.get('https://api.bithumb.com/public/ticker/ETH')
        .then(res => {
          const { data: {data: { closing_price: currentPrice }} } = res;
          this.setState({currentPrice});
        });
        
    }, 2000)
  }

  onChange = (e) => {
    const { value } = e.target;   
    this.setState({ value });
  }

  render() {
    const { currentStep } = this.props;
    const { currentPrice, value } = this.state;
    return (
      <Step.Group vertical size='mini'>
        <Step className={currentStep === 1 ? "active" : "completed"} >
          <Icon name="pencil alternate" />
          <Step.Content>
            <Step.Title>제 목</Step.Title>
            <Step.Description>질문 제목 입력</Step.Description>
          </Step.Content>
        </Step>

        <Step className={currentStep === 2 ? "active" : (currentStep > 2 ? "completed" : "")  }>
          <Icon name="content" />
          <Step.Content>
            <Step.Title>내 용</Step.Title>
            <Step.Description>내용 입력, 마크다운 사용가능</Step.Description>
          </Step.Content>
        </Step>

        <Step className={currentStep === 3 ? "active" :  (currentStep > 3 ? "completed" : "")} >
          <Icon name="tags" />
          <Step.Content>
            <Step.Title>태 그</Step.Title>
            <Step.Description>관련 태그 입력</Step.Description>
          </Step.Content>
        </Step>

        <Step className={currentStep === 4 ? "active" : ""} >
          <Icon name="money" />
          <Step.Content>
            <Step.Title>제시할 보상금</Step.Title>
            <Step.Description>1이더리움 = 현재 한화 <strong>{currentPrice || `약 30만`}원</strong></Step.Description>
          </Step.Content>
        </Step>

        <Step>        
          <Icon name="calculator" />        
          <Step.Content>
            <Step.Description>
              <div className="ether-calculator">
                <Input placeholder="이더리움 계산기(이더)" size="mini" value={value} onChange={this.onChange} />
                <Icon name="angle double down" size="small" />
                <Input placeholder="이더리움 계산기(원화)" size="mini" value={value && +value * +currentPrice} onChange={this.onChange} />
              </div>
            </Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
    );
  }
}

export default Steps;
