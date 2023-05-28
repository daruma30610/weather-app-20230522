<script setup>
import { onMounted } from 'vue';
import { useGeocodingData } from "../composables/useGeocodingData.js";
import { useCurrentWeatherData } from "../composables/useCurrentWeatherData.js";

// 都市名から緯度経度を取得
const { lat, lon, geocodingDataErrorMessage, fetchGeocodingData } = useGeocodingData();

// 緯度経度から天気情報を取得
const { weatherData, currentWeatherDataErrorMessage, fetchCurrentWeatherData } = useCurrentWeatherData();

const fetchWeather = async (cityName) => {
    try {
        await fetchGeocodingData(cityName);
        await fetchCurrentWeatherData(lat.value, lon.value);
    } catch (error) {
        console.error(error);
    }
};

const convertUtcToJst = (timestamp) => {
    // タイムスタンプをミリ秒に変換
    let milliseconds = timestamp * 1000;
    
    // ミリ秒を日時オブジェクトに変換
    let date = new Date(milliseconds);

    // タイムゾーンを「Asia/Tokyo」に設定
    let options = { timeZone: 'Asia/Tokyo' };

    // JSTに変換した日時を取得
    let jstDate = date.toLocaleString('ja-JP', options);

    return jstDate;
}

// コンポーネントがマウントされた後に呼び出されるコールバック関数
onMounted(() => fetchWeather('Tokyo'));

// defineExpose を使用してコンポーネント内に定義されたメソッドを親コンポーネントから参照できる様にしています。
defineExpose({
    convertUtcToJst,
});
</script>

<template>
    <div v-if="weatherData">
        <h1>{{ weatherData.name }}の天気</h1>
        <div v-if="weatherData.weather">
            <div v-for="weather in weatherData.weather">
                <div>{{ weather.description }}</div>
            </div>
            <div>時刻：{{ convertUtcToJst(weatherData.dt) }}</div>
            <div>気温：{{ (weatherData.main.temp - 273.15).toFixed(1) }} ℃</div>
            <div>最高気温：{{ (weatherData.main.temp_max - 273.15).toFixed(1) }} ℃</div>
            <div>最低気温：{{ (weatherData.main.temp_min - 273.15).toFixed(1) }} ℃</div>
            <div>体感温度：{{ (weatherData.main.feels_like - 273.15).toFixed(1) }} ℃</div>
            <div>湿度：{{ weatherData.main.humidity }} %</div>
            <div>気圧：{{ weatherData.main.pressure }} hPa</div>
            <div>風速：{{ weatherData.wind.speed }} m/s</div>
            <div>風向：{{ weatherData.wind.deg }} °</div>
            <div>雲量：{{ weatherData.clouds.all }} %</div>
        </div>
    </div>
    <div v-if="geocodingDataErrorMessage">
        {{ geocodingDataErrorMessage }}
    </div>
    <div v-if="currentWeatherDataErrorMessage">
        {{ currentWeatherDataErrorMessage }}
    </div>
</template>

<style scoped>
</style>
