import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faWallet, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Nav } from "react-bootstrap"

export default function NavBar() {
	return (
		<nav
			style={{
				backgroundColor: "#fff",
				height: 45,
				boxShadow: "0px 6px 7px 5px rgba(0,0,0,0.5)",
			}}
			className="navbar fixed-bottom navbar-light"
			role="navigation"
		>
			<Nav className="w-100 justify-content-around align-items-center">
				<Nav.Item>
					<Nav.Link href="/" style={{ padding: 0 }}>
						<FontAwesomeIcon color="#0071db" size="lg" icon={faHome} />
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link href="/create" style={{ padding: 0 }}>
						<FontAwesomeIcon color="#0071db" size="lg" icon={faPlus} />
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link href="/wallet" style={{ padding: 0 }}>
						<FontAwesomeIcon color="#0071db" size="lg" icon={faWallet} />
					</Nav.Link>
				</Nav.Item>
			</Nav>
		</nav>
	)
}
