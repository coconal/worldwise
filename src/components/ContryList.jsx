/* eslint-disable react/prop-types */
import styles from "./CountryList.module.css"
import Spinner from "./Spinner"
import CountryItem from "./CountryItem"
import Message from "./Message"
import { useCities } from "../contexts/CitiesContext"

export default function CountryList() {
	const { isLoding, cities } = useCities()
	if (isLoding) {
		return <Spinner />
	}

	if (!cities || cities.length === 0) {
		return <Message message="Add your first city by clicking on a city on the map" />
	}
	const countries = cities.reduce((arr, city) => {
		if (!arr.map((el) => el.country).includes(city.country)) {
			return [...arr, { country: city.country, emoji: city.emoji }]
		} else {
			return arr
		}
	}, [])

	return (
		<ul className={styles.countryList}>
			{countries.map((country) => (
				<CountryItem key={country.country} country={country} />
			))}
		</ul>
	)
}
