// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

contract NFTContract {
    string public name = "xiubin"; 
    string public symbol = "KL"; //토큰 단위
    
    mapping (uint256 => address) public tokenOwner;
    mapping (uint256 => string) public tokenURIs;
    mapping (address => uint256[]) private _ownedTokens; //소유한 토큰 리스트
    
    
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;  //토큰을 받았다는 의미의 상수
    
    //mint(tokenId,uri,owner): 발행
    //transferFrom(from,to,tokenId): 전송 (owner가 from에서 to로 바뀌는 것)
    
    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public returns (bool) {
        //to에게 tokenId(일련번호)를 발행할건데 tokenURI 문자열을 작성할 것이다.
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;
        
        _ownedTokens[to].push(tokenId);
        //add token to the list
        
        return true;
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        //from에서 to에게 tokenId와 data를 전송할 것이다.
        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "You are not the owner");
        //보낸사람이 from과 일치하고 토큰의 소유주일때 다음 코드를 실행한다.
        
        _removeTokenFromList(from, tokenId); //소유한 토큰 리스트에서 보낸 토큰 삭제
        _ownedTokens[to].push(tokenId); //to에게 보낸 토큰 부여
        
        tokenOwner[tokenId] = to; //소유주를 바꿈
        
        //만약에 받는 쪽이 실행할 코드가 있는 스마트컨트랙트이면 코드를 실행할 것
        require(
            _checkOnKIP17Received(from, to, tokenId, _data),
            "KIP17: transfer to non KIP17Receiver implementer"
        );
    }
    
    function _checkOnKIP17Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal returns (bool) { //internal을 붙이면 내부에서만 사용 가능
        bool success;
        bytes memory returndata;

        //스마트컨트랙트 코드가 없으면 리턴
        if (!isContract(to)) {
            return true;
        }

        //스마트컨트랙트 코드가 있을 경우
        (success, returndata) = to.call( //스마트컨트랙트 주소에 가서 아래 코드를 실행해라
            //_KIP17_RECEIVED : 16진수 리턴한 함수(onKIP17Received)를 찾아서 실행할 건데 아래 인자를 파라미터에 넘겨준다
            abi.encodeWithSelector(
                _KIP17_RECEIVED, 
                msg.sender,
                from,
                tokenId,
                _data
            )
        );

        if (
            returndata.length != 0 &&
            abi.decode(returndata, (bytes4)) == _KIP17_RECEIVED
        ) {
            return true;
        }
        return false;
    }

    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        //코드가 존재하면 사이즈가 0보다 크다
        return size > 0;
    }
    
    function _removeTokenFromList(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        for(uint256 i=0; i<_ownedTokens[from].length; i++) {
            if(tokenId == _ownedTokens[from][i]) {
                //Swap last token with deleted token
                _ownedTokens[from][i] = _ownedTokens[from][lastTokenIndex];
                _ownedTokens[from][lastTokenIndex] = tokenId;
                break;
            }
        }
        _ownedTokens[from].length--;
    }
    
    function ownedTokens(address owner) public view returns (uint256[] memory) {
        //특정 소유주가 소유한 토큰 리스트 리턴
        return _ownedTokens[owner];
    }
    
    function setTokenUri(uint256 id, string memory uri) public {
        tokenURIs[id] = uri;
    }
    
}

contract NFTMarket {
    mapping(uint256 => address) public seller; //tokenId를 누가 보냈는지, 즉 판매자 세팅
    
    
   function buyNFT(uint256 tokenId, address NFT)
        public
        payable
        returns (bool)
    { //돈보내는 함수에는 payable를 적어야함
        // receiver를 seller로 세팅, payable를 붙여줘야 돈을 받을 수 있음
        address payable receiver = address(uint160(seller[tokenId]));

        // Send 0.01 klay to Seller
        // 10 ** 18 PEB = 1 KLAY
        // 10 ** 16 PEB = 0.01 KLAY
        receiver.transfer(10**16);

        // Send NFT if properly send klay
        NFTContract(NFT).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            "0x00"
        );

        return true;
    }

    // Called when SafeTransferFrom called from NFT Contract
    // 마켓이 토큰을 받았을 때(판매대에 올라갔을 때), 판매자가 누구인지 기록
    function onKIP17Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public returns (bytes4) {
        // Set token seller, who was a token owner (토큰판매자 기록)
        seller[tokenId] = from;

        // return signature which means this contract implemented interface for ERC721
        // 토큰 받았을 때 또 다른 실행할 함수가 있다는 신호를 리턴
        return
            bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)"));
    }
}



/*
contract NFTMarketSample {
    function buyNFT(uint256 tokenId, address NFTAddress, address to) public returns (bool) {
        NFTContract(NFTAddress).safeTransferFrom(address(this), to, tokenId);
        //여기서 this는 NFTMarket을 의미함
        //NFTAddress를 가진 스마트컨트랙트를 호출해서 NFTMarket에서 to로 tokenId를 보내겠다는 것
        
      
        //NFTMarket 스마트컨트랙트에서 NFTContract 스마트컨트랙트를 호출해서 
        //NFTMarket 컨트랙트가 가진 토큰을 다른 사람에게 전송하는 코드.
        //스마트컨트랙트는 서로 호출할 수 있고 토큰을 주고받기도 가능하다.
        
        return true;
    }
}
*/


