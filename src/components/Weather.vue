<script setup>
import { ref } from 'vue';
import { useGeocodingData } from "../composables/useGeocodingData.js";
import { useCurrentWeatherData } from "../composables/useCurrentWeatherData.js";

// 都市名
const cityName = ref('');

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

// defineExpose を使用してコンポーネント内に定義されたメソッドを親コンポーネントから参照できる様にしています。
defineExpose({
    convertUtcToJst,
});
</script>

<template>
    <h1>天気予報</h1>

    <!-- 都市名入力エリア 開始 -->
    <input v-model="cityName" />
    <!-- 都市名入力エリア 終了 -->

    <!-- 都市名入力ボタン 開始 -->
    <button @click="fetchWeather(cityName)">Click</button>
    <!-- 都市名入力ボタン 終了 -->

    <!-- エラー表示エリア 開始 -->
    <div v-if="geocodingDataErrorMessage">
        {{ geocodingDataErrorMessage }}
    </div>
    <div v-if="currentWeatherDataErrorMessage">
        {{ currentWeatherDataErrorMessage }}
    </div>
     <!-- エラー表示エリア 終了 -->

    <!-- 天気情報表示エリア 開始 -->
    <div v-if="weatherData">
        <h2>{{ weatherData.name }}の天気</h2>
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
    <!-- 天気情報表示エリア 終了 -->

</template>

<style scoped>
</style>
