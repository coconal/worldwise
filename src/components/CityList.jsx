/* eslint-disable react/prop-types */
import styles from "./CityList.module.css"
import Spinner from "./Spinner"
import CityItem from "./CityItem"
import Message from "./Message"
import { useCities } from "../contexts/CitiesContext"

export default function CityList() {
	const { isLoding, cities } = useCities()
	if (isLoding) {
		return <Spinner />
	}

	if (!cities || cities.length === 0) {
		return <Message message="Add your first city by clicking on a city on the map" />
	}

	return (
		<ul className={styles.cityList}>
			{cities.map((city) => (
				<CityItem key={city.id} city={city} />
			))}
		</ul>
	)
}
