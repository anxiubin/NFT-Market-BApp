import React from "react"
import QRCode from "qrcode.react"
import { Container, Alert } from "react-bootstrap"

export default function QRcode({ value }) {
	return (
		<Container
			style={{
				backgroundColor: "white",
				width: "100%",
				padding: 20,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Alert variant={"info"}>아래 QR 코드를 스캔해주세요</Alert>

			<QRCode value={value} size={150} style={{ margin: "auto" }} />
		</Container>
	)
}
