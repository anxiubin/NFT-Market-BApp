import React from "react"
import { Button, Modal as ModalComponent } from "react-bootstrap"

export default function Modal({ showModal, close, modalProps }) {
	return (
		<ModalComponent centered size="sm" show={showModal} onHide={close}>
			<ModalComponent.Header
				style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
			>
				<ModalComponent.Title style={{ color: "#fff" }}>
					{modalProps.title}
				</ModalComponent.Title>
			</ModalComponent.Header>
			<ModalComponent.Footer
				style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
			>
				<Button variant="secondary" onClick={close}>
					닫기
				</Button>
				<Button
					variant="primary"
					onClick={() => {
						modalProps.onConfirm()
						close()
					}}
				>
					진행
				</Button>
			</ModalComponent.Footer>
		</ModalComponent>
	)
}
