import React, { useState, useEffect, useRef } from "react"
import { Card, Form, Button, Modal } from "react-bootstrap"
import QRcode from "../../components/QRcode"
import * as KlipAPI from "../../api/UseKlip"
import * as KasAPI from "../../api/UseKAS"
// import { MARKET_CONTRACT_ADDRESS } from "../../config"
import { DEFAULT_QR_CODE, DEFAULT_ADDRESS } from "../../constants"

export default function Create() {
	let myAddress = ""

	const containerRef = useRef(null)
	const [mintImageUrl, setMintImageUrl] = useState("")
	const [mintName, setMintName] = useState("")
	const [mintDescription, setMintDescription] = useState("")
	const [mintTokenId, setMintTokenId] = useState("")
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE)
	const [isLoading, setLoading] = useState(false)
	const [show, setShow] = useState(false)

	const handleClickCloseModal = () => setShow(false)

	const onClickMint = () => async (uri, tokenID) => {
		if (myAddress === DEFAULT_ADDRESS) {
			alert("NO ADDRESS")
			return
		}
		setLoading(true)

		//이미 발행된 토큰값인지 구별한 후 넣는 알고리즘 추가 필요
		// const randomTokenId = parseInt(Math.random() * 10000000)

		// metadata upload
		const metadataURL = await KasAPI.uploadMetaData(mintName, mintDescription,uri)
		if(!metadataURL) {
			alert('메타데이터 업로드에 실패했습니다.')
			return
		} 

		await KlipAPI.mintCardWithURI(
			myAddress,
			tokenID, // randomTokenId 대체
			metadataURL,
			setQrvalue,
			(result) => {
				console.log(JSON.stringify(result))
				setMintImageUrl("")
				setLoading(false)
				setShow(true)
			}
		)
	}

	return (
		<div
			ref={containerRef}
			className="container"
			style={{ padding: "0 10px 50px", width: "100%" }}
		>
			<Card className="text-center">
				<Card.Body>
					{mintImageUrl && (
						<Card.Img
							src={mintImageUrl}
							height={"50%"}
							style={{ marginBottom: 30 }}
						/>
					)}
					<Form>
						<Form.Group>
							<Form.Control
								value={mintImageUrl}
								onChange={(e) => {
									setMintImageUrl(e.target.value)
								}}
								type="text"
								placeholder="이미지 주소를 입력해주세요"
							/>
							<br />
							<Form.Control
								value={mintName}
								onChange={(e) => {
									setMintName(e.target.value)
								}}
								type="text"
								placeholder="이름을 입력해주세요"
							/>
							<br />
							<Form.Control
								value={mintDescription}
								onChange={(e) => {
									setMintDescription(e.target.value)
								}}
								type="text"
								placeholder="상세 설명을 입력해주세요"
							/>
							<br />
							<Form.Control
								value={mintTokenId}
								onChange={(e) => {
									setMintTokenId(e.target.value)
								}}
								type="text"
								placeholder="토큰 ID를 입력해주세요"
							/>
						</Form.Group>
						<br />

						<Button
							variant="primary"
							disabled={isLoading}
							onClick={!isLoading ? onClickMint(mintImageUrl, mintTokenId) : null}
						>
							{isLoading ? "발행하는 중..." : "발행하기"}
						</Button>
					</Form>
				</Card.Body>
			</Card>
			{qrvalue !== "DEFAULT" ? <QRcode value={qrvalue} /> : null}

			<Modal
				size="sm"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				show={show}
			>
				<Modal.Body>NFT 발행이 완료되었습니다!</Modal.Body>
				<Modal.Footer style={{ borderTop: "none", paddingTop: 0 }}>
					<Button onClick={handleClickCloseModal}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}
