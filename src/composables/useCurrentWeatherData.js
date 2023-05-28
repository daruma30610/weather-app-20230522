import { ref } from "vue";
import axios from 'axios';

const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export function useCurrentWeatherData() {
    const weatherData = ref(null);
    const currentWeatherDataErrorMessage = ref("");

    const fetchCurrentWeatherData = async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${api_key}&lang=ja&lat=${lat}&lon=${lon}`);
            if(response.data) {
                weatherData.value = response.data;
            } else {
                currentWeatherDataErrorMessage.value = "入力された緯度と経度の天気データが取得できませんでした";
            }
        } catch (error) {
            currentWeatherDataErrorMessage.value = "現在の気象データを呼び出すAPIでエラーが発生しています" + error.message;
            console.error(error);
        }
    }
    
    return {weatherData, currentWeatherDataErrorMessage, fetchCurrentWeatherData};
}