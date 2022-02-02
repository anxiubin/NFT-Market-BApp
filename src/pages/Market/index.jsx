import React, { useState, useEffect } from "react"
import { fetchCardsOf } from "../../api/UseCaver"
import * as KlipAPI from "../../api/UseKlip"
import { Card, Row, Col } from "react-bootstrap"
import { MARKET_CONTRACT_ADDRESS } from "../../config"
import { DEFAULT_QR_CODE } from "../../constants"
import QRcode from "../../components/QRcode"
import Modal from "../../components/Modal"

export default function Market() {
	const [nfts, setNfts] = useState([]) // {id: '101', uri: ''}

	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE)
	const [showModal, setShowModal] = useState(false)
	const [modalProps, setModalProps] = useState({
		title: "MODAL",
		onConfirm: () => {},
	})

	const fetchMarketNFTs = async () => {
		const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS)
		setNfts(_nfts)
	}

	const onClickMarketCard = (tokenId) => {
		KlipAPI.buyCard(tokenId, setQrvalue, (result) => {
			alert(JSON.stringify(result))
		})
	}

	const onClickCard = (id) => {
		setModalProps({
			title: "NFT를 구매하시겠어요?",
			onConfirm: () => {
				onClickMarketCard(id)
			},
		})
		setShowModal(true)
	}

	useEffect(() => {
		fetchMarketNFTs()
	}, [])

	return (
		<div
			className="container"
			style={{ padding: "0 10px 50px", width: "100%" }}
		>
			{qrvalue !== "DEFAULT" ? <QRcode value={qrvalue} /> : null}

			<Row>
				{nfts.map((nft) => (
					<Col style={{ marginRight: 0, paddingRight: 0 }} sm={4} xs={6}>
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
