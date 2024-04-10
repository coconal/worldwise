/* eslint-disable react-refresh/only-export-components */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import styles from "./Form.module.css"

import Button from "./Button"
import Message from "./Message"
import Spinner from "./Spinner"
import BackButton from "./BackButton"

import { useUrlPosition } from "../hooks/useUrlPosition"
import { useCities } from "../contexts/CitiesContext"

export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt())
	return String.fromCodePoint(...codePoints)
}

function Form() {
	const [mapLat, mapLng] = useUrlPosition()
	const { createCity, isLoding } = useCities()
	const navigate = useNavigate()

	const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
	const [cityName, setCityName] = useState("")
	const [country, setCountry] = useState("")
	const [date, setDate] = useState(new Date())
	const [notes, setNotes] = useState("")
	const [emoji, setEmoji] = useState("")
	const [geocodingError, setGeocodingError] = useState("")

	useEffect(() => {
		if (!mapLat && !mapLng) return
		async function getCityData() {
			try {
				setIsLoadingGeocoding(true)
				setGeocodingError("")
				setEmoji("")
				const res = await fetch(
					`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`
				)
				const data = await res.json()
				setCityName(data.city || data.locality)
				setCountry(data.countryName)
				//console.log(data)
				setEmoji(convertToEmoji(data.countryCode))
				if (!data.continentCode) {
					throw new Error("That doesn't seem to be a city. Clicksomewhere else.😉")
				}
			} catch (error) {
				setGeocodingError(error.message)
			} finally {
				setIsLoadingGeocoding(false)
			}
		}
		getCityData()
	}, [mapLat, mapLng])

	async function handleSubmit(e) {
		e.preventDefault()

		if (!cityName && !date) return

		const newCity = {
			cityName,
			country,
			date,
			emoji,
			notes,
			position: {
				lat: mapLat,
				lng: mapLng,
			},
		}
		// console.log(newCity)
		await createCity(newCity)
		navigate("/app/cities")
	}

	if (isLoadingGeocoding) return <Spinner />

	if (!mapLat && !mapLng) {
		return <Message message={"Start clicking somewhere on the map"} />
	}

	if (geocodingError) {
		return <Message message={geocodingError} />
	}

	return (
		<form className={`${styles.form} ${isLoding ? styles.loading : ""}`} onSubmit={handleSubmit}>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName} />
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>
				{/* <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
				<DatePicker
					id="date"
					selected={date}
					onChange={(date) => setDate(date)}
					dateFormat="dd/MM/yyyy"
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
			</div>

			<div className={styles.buttons}>
				<Button type="primary">Add</Button>
				<BackButton />
			</div>
		</form>
	)
}

export default Form
