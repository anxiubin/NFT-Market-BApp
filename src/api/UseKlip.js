import axios from "axios";
import {
	NFT_CONTRACT_ADDRESS,
	MARKET_CONTRACT_ADDRESS,
} from "../config"

/*
  KLIP API : PREPARE (지갑 사용 여부 체크) => REQUEST(컨트랙트 실행) => RESULT(결과 체크)
	(참고: https://docs.klipwallet.com/rest-api/rest-api-a2a)

	App2App 처리 시 가정 먼저 수행해야할 Prepare 과정은 Klip에서 처리할 요청 데이터를 전달하고 Request Key를 발급받는 과정입니다. 
	Reqeust Key는 Deep Link 호출 및 QR code 결과 확인 과정에서 필요합니다.
*/

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";
const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(window.navigator.userAgent)

const getKlipAccessUrl = (method, request_key) => {
  if (method === "QR") {
    return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
  }
  return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
};

export const buyCard = async (tokenId, setQrvalue, callback) => {
  const functionJson =
    '{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFTAddress", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
  executeContract(
    MARKET_CONTRACT_ADDRESS,
    functionJson,
    "10000000000000000",
    `[\"${tokenId}\",\"${NFT_CONTRACT_ADDRESS}\"]`,
    setQrvalue,
    callback
  );
};

export const listingCard = async (
  fromAddress,
  tokenId,
  setQrvalue,
  callback
) => {
  const functionJson =
    '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
  executeContract(
    NFT_CONTRACT_ADDRESS,
    functionJson,
    "0",
    `[\"${fromAddress}\",\"${MARKET_CONTRACT_ADDRESS}\",\"${tokenId}\"]`,
    setQrvalue,
    callback
  );
};

export const mintCardWithURI = async (
  toAddress,
  tokenId,
  uri,
  setQrvalue,
  callback
) => {
  const functionJson =
    '{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
  executeContract(
    NFT_CONTRACT_ADDRESS,
    functionJson,
    "0",
    `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`,
    setQrvalue,
    callback
  );
};

export const executeContract = (
  txTo,
  functionJSON,
  value,
  params,
  setQrvalue,
  callback
) => {
  axios
    .post(A2P_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "execute_contract",
      transaction: {
        to: txTo,
        abi: functionJSON,
        value: value,
        params: params,
      },
    })
    .then((response) => {
      const { request_key } = response.data;
      if (isMobile) {
        window.location.href = getKlipAccessUrl("deeplink", request_key);
      } else {
        setQrvalue(getKlipAccessUrl("QR", request_key));
      }

      let timerId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then((res) => {
            if (res.data.result) {
              console.log(`[Result] ${JSON.stringify(res.data.result)}`);
              callback(res.data.result);
              clearInterval(timerId);
              setQrvalue("DEFAULT");
            }
          });
      }, 1000);
    });
};


// QR code 또는 Deep Link 활용해서 Klip 주소값 가져오기
export const getAddress = (setQrvalue, callback) => {
  axios
    .post(A2P_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "auth",
    })
    .then((response) => {
      const { request_key } = response.data;
      if (isMobile) {
        window.location.href = getKlipAccessUrl("deeplink", request_key);
      } else {
        setQrvalue(getKlipAccessUrl("QR", request_key));
      }
      let timerId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then((res) => {
            if (res.data.result) {
              console.log(`[Result] ${JSON.stringify(res.data.result)}`);
              callback(res.data.result.klaytn_address);
              clearInterval(timerId);
              setQrvalue("DEFAULT");
            }
          });
      }, 1000);
    });
};
