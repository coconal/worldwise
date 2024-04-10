import { Suspense, lazy } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

// import Homepage from "./pages/Homepage"
// import Pricing from "./pages/Pricing"
// import Product from "./pages/Product"
// import PageNotFound from "./pages/PageNotFound"
// import AppLayout from "./pages/AppLayout"
// import Login from "./pages/Login"

const Homepage = lazy(() => import("./pages/Homepage"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Product = lazy(() => import("./pages/Product"))
const PageNotFound = lazy(() => import("./pages/PageNotFound"))
const AppLayout = lazy(() => import("./pages/AppLayout"))
const Login = lazy(() => import("./pages/Login"))

import "./index.css"
import CityList from "./components/CityList"
import CountryList from "./components/ContryList"
import City from "./components/City"
import Form from "./components/Form"
import { CitiesProvider } from "./contexts/CitiesContext"
import { AuthProvider } from "./contexts/FakeAuthContext"
import { ProtectedRoute } from "./pages/ProtectedRoute"
import SpinnerFullPage from "./components/SpinnerFullPage"

export default function App() {
	return (
		<CitiesProvider>
			<AuthProvider>
				<BrowserRouter>
					<Suspense fallback={<SpinnerFullPage />}>
						<Routes>
							<Route index element={<Homepage />} />
							<Route path="/pricing" element={<Pricing />} />
							<Route path="/product" element={<Product />} />
							<Route
								path="/app"
								element={
									<ProtectedRoute>
										<AppLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<Navigate replace to={"cities"} />}></Route>
								<Route path="cities" element={<CityList />}></Route>
								<Route path="countries" element={<CountryList />}></Route>
								<Route path="form" element={<Form />}></Route>
								<Route path="cities/:id" element={<City />}></Route>
							</Route>

							<Route path="login" element={<Login />} />

							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</Suspense>
				</BrowserRouter>
			</AuthProvider>
		</CitiesProvider>
	)
}
