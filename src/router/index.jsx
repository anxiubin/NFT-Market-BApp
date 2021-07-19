import { lazy, Suspense } from "react"
import { Switch, Route } from "react-router-dom"
import NavBar from "../components/NavBar"
import Header from "../components/Header"
import routes from "./config"
import { Styles } from "../styles/styles"

const Router = () => {
	return (
		<Suspense fallback={null}>
			<Styles />
			<Header />
			<Switch>
				{routes.map((routeItem) => {
					return (
						<Route
							key={routeItem.component}
							path={routeItem.path}
							exact={routeItem.exact}
							component={lazy(() => import(`../pages/${routeItem.component}`))}
						/>
					)
				})}
			</Switch>
			<NavBar />
		</Suspense>
	)
}

export default Router
