import Caver from "caver-js"
import axios from "axios";
import KIP17ABI from "../abi/KIP17TokenABI.json";
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	NFT_CONTRACT_ADDRESS,
	CHAIN_ID,
} from "../config"

// KAS API 호출 시 필요한 헤더
const option = {
	headers: [
		{
			name: "Authorization",
			value:
				"Basic " +
				Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
		},
		{ name: "x-chain-id", value: CHAIN_ID },
	],
}

// KAS API 사용을 위한 객체 생성
const caver = new Caver(
	new Caver.providers.HttpProvider(
		"https://node-api.klaytnapi.com/v1/klaytn",
		option
	)
)

// 참조 ABI와 스마트컨트랙트 주소를 통해 스마트컨트랙트 연동
const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);

export const fetchCardsOf = async (address) => {
	/* 
		NFT 가져오는 방법 (1)
		1. balanceOf 함수 를 사용해서 전체 NFT 개수를 가져온다
		2. 전체 NFT 개수만큼 반복문을 돌면서 tokenOfOwnerByIndex 함수를 이용하여 tokenId를 하나씩 가져오고 tokenIds 배열에 담는다
		3. tokenURI함수 를 이용해 앞에서 담아둔 tokenIds 배열을 돌면서 tokenURI를 하나씩 가져온다 

		NFT 가져오는 방법 (2)
		KAS API 중에 Token 관련 API 사용
		참고: https://refs.klaytnapi.com/ko/th/latest#operation/getNftsByOwnerAddress
	*/

  // Fetch Balance
  const balance = await NFTContract.methods.balanceOf(address).call();
  console.log(`[NFT Balance]${balance}`);
  // Fetch Token IDs
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
    tokenIds.push(id);
  }
  // Fetch Token URIs
  const tokenUris = [];
  for (let i = 0; i < balance; i++) {
    // const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    // tokenUris.push(uri);

		const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call(); // KAS 메타데이터 response.uri: "https://metadata-store.klaytnapi.com/e2d83vdb-c108-823c-d5f3-69vdf2d871c51/4f9asvf2f5-02d0-5b86-4f99-50acds269c8a.json"
		const response = await axios.get(metadataUrl) // JSON 형식 메타데이터가 들어옴
		const uriJSON = response.data
    tokenUris.push(uriJSON.image);
  }
  const nfts = [];
  for (let i = 0; i < balance; i++) {
    nfts.push({ uri: tokenUris[i], id: tokenIds[i] });
  }
  console.log(nfts);
  return nfts;
};

// 클레이 지갑의 잔고 조회하기
export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
		//16진수 response를 숫자로 바꾸고, PEB단위에서 KLAY단위로 변환
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};