pragma solidity ^0.5.1;
// 스마트컨트랙트 이름 설정
contract Cashtion {
    // Question 클래스를 생성, 아래 3가지 속성을 가지고있다.
    // questioner : 질문자 지갑주소,
    // recipient : 답변자 지갑주소,
    // reward: 보상금,
    struct Question {
        address payable questioner;
        address payable recipient;
        uint reward; 
    }
    
    // 질문마다, 질문번호를 key - 생성된 인스턴스 value 생성하여 questions에 담기
    mapping(string => Question) private questions;
    // 사이트에서 질문 작성 완료 시 'questions' 객체에 질문내역 생성
    function setQuestion(string memory _key) public payable{
        questions[_key].questioner = msg.sender;
        questions[_key].reward = msg.value;
    }
    // 질문번호를 key값으로 'questions' 객체의 value를 가져오는 함수
    function getQuestion(string memory _key) view public returns (address, address, uint) {
        return (questions[_key].questioner,
                questions[_key].recipient, 
                questions[_key].reward);
    }
    
    // 거래가 성사되지 않았을 때 걸어놓은 보상금 회수 하는 함수 (미결)
    function dealBreak(string memory _key) public payable {
        uint amount = questions[_key].reward;
        
        // 중복 방지
        if (amount > 0) {
            questions[_key].reward = 0;
        }
        
        // 보상금을 다시 질문자에게 보내주기
        questions[_key].questioner.transfer(amount);
    }
    
    // 거래가 성사 되었을 때 수령자를 결정하고 돈을 보내는 함수(종결)
    function setRecipientAndDealConclusion(string memory _key, address payable _recipient) public payable{
        questions[_key].recipient = _recipient;
        uint amount = questions[_key].reward;
        
        // 중복 방지
        if (amount > 0) {
            questions[_key].reward = 0;
        }
        
        // 보상금을 선택한 답변자에게 보내주기
        questions[_key].recipient.transfer(amount);
    }
}
