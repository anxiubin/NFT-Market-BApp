// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

contract Practice {
    // Practice 라는 이름의 컨트랙트로 블록체인에 배포
    uint256 private totalSupply = 10; 
    //uint256:숫자, private: 블록체인에서 바로 볼수 없음
    string public name = "xiubin"; 
    //string:문자, public 블록체인에서 볼 수 있음
    address public owner;
    //address:주소
    mapping (uint256 => string) public tokenURIs;
    //mapping : key와 value를 가진 것, key로 숫자를 넣으면 value인 문자열을 얻겠다는 것

    constructor () public { 
        //constructor: 스마트컨트랙트가 최초로 배포되자마자 실행되는 것
        owner = msg.sender;
        //스마트컨트랙트 실행한 사람(address)을 owner라는 변수에 넣음
    }
    
    function getTotalSupply() public view returns (uint256) { 
        //view: 보기 전용, returns: 값을 리턴
        return totalSupply + 10000;
    }
    
    function setTotalSupply(uint256 newSupply) public { 
        //데이터를 변경하거나 할때는 returns 필요없음
        
        require(owner == msg.sender, 'Not Owner');
        // 특정 조건을 만족하면 다음 코드를 실행하고, 그렇지 않다면 트랜잭션을 실패시키고 에러메세지를 보여줌
        // owner가 컨트랙트를 실행한 사람과 일치한다면 코드 실행
        totalSupply = newSupply;
    }
    
    function setTokenUri(uint256 id, string memory uri) public {
        //memory: 문자열 같이 복잡한 데이터를 다룰 때 삽입
        tokenURIs[id] = uri;
    }
        
}