import React, { useState, useEffect } from "react"
import { Card, Row, Col, Button, Toast, Alert } from "react-bootstrap"
import Modal from "../../components/Modal"
import QRcode from "../../components/QRcode"
import { getBalance, fetchCardsOf } from "../../api/UseCaver"
import * as KlipAPI from "../../api/UseKlip"
import { DEFAULT_QR_CODE, DEFAULT_ADDRESS } from "../../constants"
import LogoKlaytn from "../../assets/logo_klaytn.png"

export default function Wallet() {
	const [nfts, setNfts] = useState([]) // {id: '101', uri: ''}
	const [myAddress, setMyAddress] = useState(window.sessionStorage.getItem('address') || DEFAULT_ADDRESS)
	const [myBalance, setMyBalance] = useState(window.sessionStorage.getItem('balance') || '0')

	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE)
	const [showModal, setShowModal] = useState(false)
	const [showToast, setShowToast] = useState(false)
	const [modalProps, setModalProps] = useState({
		title: "MODAL",
		onConfirm: () => {},
	})

	const onClickMyCard = (tokenId) => {
		KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result) => {
			alert(JSON.stringify(result))
		})
	}

	const onClickCard = (id) => {
		setModalProps({
			title: "NFT를 마켓에 올리시겠어요?",
			onConfirm: () => {
				onClickMyCard(id)
			},
		})
		setShowModal(true)
	}

	const fetchMyNFTs = async () => {
		if (myAddress === DEFAULT_ADDRESS) {
			alert("NO ADDRESS")
			return
		}
		const _nfts = await fetchCardsOf(myAddress)
		setNfts(_nfts)
	}

	const getUserData = () => {
		setModalProps({
			title: "Klip 지갑을 연동하시겠습니까?",
			onConfirm: () => {
				KlipAPI.getAddress(setQrvalue, async (address) => {
					window.sessionStorage.setItem('address', address);
					setMyAddress(address)
					const _balance = await getBalance(address)
					window.sessionStorage.setItem('balance', _balance);
					setMyBalance(_balance)

				})
			},
		})
		setShowModal(true)
	}

	const handleClickCopyAddress = () => {
		navigator.clipboard.writeText(myAddress).then(() => setShowToast(true))
	}

	useEffect(() => {
		if (myAddress !== DEFAULT_ADDRESS) {
			fetchMyNFTs()
		}
	}, [myAddress])

	return (
		<div
			className="container"
			style={{ padding: "0 10px 50px", width: "100%" }}
		>
			<h1>My Wallet</h1>
			<div className="d-grid gap-2" style={{ position: "relative" }}>
				<Button
					onClick={handleClickCopyAddress}
					variant="light"
					size="lg"
					style={{ wordBreak: "break-word", width: "100%" }}
				>
					{myAddress}
				</Button>
				<Toast
					onClose={() => setShowToast(false)}
					show={showToast}
					delay={1000}
					autohide
					style={{
						width: 120,
						position: "absolute",
						top: 55,
						left: 0,
						zIndex: 10,
						backgroundColor: "rgba(112,112,112,0.7)",
					}}
				>
					<Toast.Body style={{ padding: 10, fontSize: 11, color: "#fff" }}>
						복사를 완료했습니다.
					</Toast.Body>
				</Toast>
				<Alert onClick={getUserData} variant="primary" style={{ fontSize: 25 }}>
					{myAddress !== DEFAULT_ADDRESS ? (
						<div style={{ textAlign: "right" }}>
							<img src={LogoKlaytn} alt="klaytn" style={{ width: 30 }} />
							{myBalance} KLAY
						</div>
					) : (
						"지갑 연동하기"
					)}
				</Alert>
			</div>
			{qrvalue !== "DEFAULT" ? <QRcode value={qrvalue} /> : null}
			<Row>
				{nfts.map((nft) => (
					<Col style={{ marginRight: 0, paddingRight: 0 }} sm={6} xs={6}>
						<Card
							onClick={() => {
								onClickCard(nft.id)
							}}
						>
							<Card.Img src={nft.uri} />
						</Card>
						#{nft.id}
					</Col>
				))}
			</Row>
			<Modal
				showModal={showModal}
				close={() => setShowModal(false)}
				modalProps={modalProps}
			/>
		</div>
	)
}
