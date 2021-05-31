import Caver from "caver-js"
import CounterABI from "../abi/CounterABI.json"
import AirdndABI from "../abi/AirdndABI.json"
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	AIRDND_CONTRACT_ADDRESS,
	DEPLOY_ADDRESS_PRIVATE_KEY,
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
const AirdndContract = new caver.contract(AirdndABI, AIRDND_CONTRACT_ADDRESS)

export const readOwner = async () => {
	const _owner = await AirdndContract.methods.owner().call()
	console.log(_owner)
}

// 클레이 지갑의 잔고 조회하기
export const getBalance = (address) => {
	return caver.rpc.klay.getBalance(address).then((response) => {
		const balance = caver.utils.convertFromPeb(
			caver.utils.hexToNumberString(response)
		) //16진수 response를 숫자로 바꾸고, PEB단위에서 KLAY단위로 변환

		console.log(`BALANCE: ${balance}`)
		return balance
	})
}

//스마트컨트랙트 실행하기
export const mintTokenWithRoom = async (tokenId) => {
	try {
		// 사용할 account 설정
		const deployer = caver.wallet.keyring.createFromPrivateKey(
			DEPLOY_ADDRESS_PRIVATE_KEY
		)
		caver.wallet.add(deployer)

		// 스마트 컨트랙트 실행 트랜젝션 날리기
		const receipt = await AirdndContract.methods
			.mintTokenWithRoom(tokenId)
			.send({
				from: deployer.address, // 주소
				gas: "0x99999", // 수수료
			})
		console.log(receipt)
	} catch (e) {
		console.log(`[ERROR_mintTokenWithRoom]${e}`)
	}
}

export const getRoomsByHost = async (hostId) => {
	try {
		const deployer = caver.wallet.keyring.createFromPrivateKey(
			DEPLOY_ADDRESS_PRIVATE_KEY
		)
		caver.wallet.add(deployer)

		const receipt = await AirdndContract.methods.getRoomsByHost(hostId).send({
			from: deployer.address,
			gas: "0x99999",
		})
		console.log(receipt)
	} catch (e) {
		console.log(`[ERROR_getRoomsByHost]${e}`)
	}
}
