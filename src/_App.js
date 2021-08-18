import React, { useState } from "react"
import QRCode from "qrcode.react"
import { getBalance, mintTokenWithRoom, getRoomsByHost } from "./api/UseCaver"
import * as KlipAPI from "./api/UseKlip"
import { DEFAULT_QR_CODE, DEPLOY_WALLET_ADDRESS } from "./constants"
import { Button } from "antd"
import "antd/dist/antd.css"
import styled from "styled-components"

function App() {
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE)
	const [address, setAddress] = useState(null)
	getBalance(DEPLOY_WALLET_ADDRESS)

	const onClickGetAddress = () => {
		setAddress(null)
		KlipAPI.getAddress(setQrvalue, setAddress)
	}
	const onClickBookRoom = () => {
		const DATE = Date.parse(new Date())
		KlipAPI.bookRoom(DEPLOY_WALLET_ADDRESS, 0, DATE, setQrvalue)
	}
	const onClickMintTokenWithRoom = () => {
		mintTokenWithRoom(Math.floor(Math.random() * 10 ** 18))
	}
	const onClickGetRoomsByHost = () => {
		getRoomsByHost(DEPLOY_WALLET_ADDRESS)
	}

	return (
		<AppContainer>
			<header>NFT market BApp</header>
			<ButtonContainer>
				<Button type="primary" onClick={onClickGetAddress}>
					주소 가져오기
				</Button>
				<div>{address}</div>
			</ButtonContainer>
			<ButtonContainer>
				<Button onClick={onClickMintTokenWithRoom}>호스팅 하기</Button>
				<Button onClick={onClickGetRoomsByHost}>방 데이터 가져오기</Button>
				<Button onClick={onClickBookRoom}>방 예약하기</Button>
			</ButtonContainer>

			<QRCode value={qrvalue} />
		</AppContainer>
	)
}

export default App

const AppContainer = styled.div`
	text-align: center;
	padding: 3rem;
	> header {
		font-size: 3rem;
		font-weight: bold;
		margin: 2rem;
	}
`

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	margin-bottom: 2rem;
	> button {
		margin: 0.5rem;
		font-weight: bold;
	}
`
