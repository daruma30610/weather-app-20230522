import { ref } from "vue";
import axios from 'axios';

const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export function useGeocodingData() {
    const lat = ref(0);
    const lon = ref(0);
    const geocodingDataErrorMessage = ref("");

    const fetchGeocodingData = async (cityName) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?appid=${api_key}&q=${cityName}`);
            if(response.data[0]) {
                lat.value = response.data[0].lat;
                lon.value = response.data[0].lon;
            } else {
                geocodingDataErrorMessage.value = "入力された都市名の緯度と経度が見つかりませんでした。";
            }
        } catch (error) {
            geocodingDataErrorMessage.value = "経度と緯度を取得するAPIでエラーが発生しています" + error.message;
            console.error(error);
        }
    }
    
    return {lat, lon, geocodingDataErrorMessage, fetchGeocodingData};
}