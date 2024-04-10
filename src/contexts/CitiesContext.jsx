/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react"

const BASE_URL = "http://localhost:9000"

const citiesContext = createContext()

const initialState = {
	isLoding: false,
	cities: [],
	currentCity: {},
	error: "",
}

function reducer(state, action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoding: true }

		case "cities/loaded":
			return { ...state, cities: action.payload, isLoding: false }

		case "city/loaded":
			return {
				...state,
				currentCity: action.payload,
				isLoding: false,
			}

		case "city/created":
			return {
				...state,
				state: [...state.cities, action.payload],
				currentCity: action.payload,
				isLoding: false,
			}

		case "city/deleted":
			return {
				...state,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: {},
				isLoding: false,
			}

		case "rejected":
			return { ...state, error: action.payload, isLoding: false }

		default:
			throw new Error("Unknown action type")
	}
}

function CitiesProvider({ children }) {
	const [{ isLoding, cities, currentCity, error }, dispatch] = useReducer(reducer, initialState)
	// const [isLoding, setIsLoding] = useState(false)
	// const [cities, setCities] = useState([])
	// const [currentCity, setCurrentCity] = useState({})

	useEffect(() => {
		async function fetchCities() {
			dispatch({ type: "loading" })
			try {
				const res = await fetch(`${BASE_URL}/cities`)
				const data = await res.json()
				dispatch({ type: "cities/loaded", payload: data })
			} catch (error) {
				dispatch({ type: "rejected", payload: "An error occurred. Please try again later." })
			}
		}
		fetchCities()
	}, [])

	const getCity = useCallback(
		async function getCity(id) {
			if (Number(id) === currentCity.id) return

			dispatch({ type: "loading" })
			try {
				const res = await fetch(`${BASE_URL}/cities/${id}`)
				const data = await res.json()
				dispatch({ type: "city/loaded", payload: data })
			} catch (error) {
				dispatch({ type: "rejected", payload: "An error occurred. Please try again later." })
			}
		},
		[currentCity.id]
	)

	async function createCity(newCity) {
		dispatch({ type: "loading" })
		try {
			const res = await fetch(`${BASE_URL}/cities`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newCity),
			})
			const data = await res.json()
			dispatch({ type: "city/created", payload: data })
		} catch (error) {
			dispatch({ type: "rejected", payload: "There was an error creating city." })
		}
	}

	async function deleteCity(id) {
		dispatch({ type: "loading" })
		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			})

			dispatch({ type: "city/deleted", payload: id })
		} catch (error) {
			dispatch({ type: "rejected", payload: "There was an error deleting city." })
		}
	}

	return (
		<citiesContext.Provider
			value={{
				cities,
				isLoding,
				currentCity,
				getCity,
				createCity,
				deleteCity,
			}}
		>
			{children}
		</citiesContext.Provider>
	)
}

function useCities() {
	const context = useContext(citiesContext)
	if (!context) {
		throw new Error("useCities must be used within a CitiesProvider")
	}
	return context
}

export { CitiesProvider, useCities }
