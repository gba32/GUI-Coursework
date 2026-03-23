import { CloudCircle, CloudCircleOutlined, CloudCircleRounded } from "@mui/icons-material";
import { Divider, ThemeProvider, Typography } from "@mui/material";
import ListCard from "../ListCard/ListCard";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./WeatherPage.css"
import { APP_THEME } from "../Theme/Theme";

class WeatherInfo {
    static getCurrentDateWeather(apiKey, cityName, stateCode, countryCode) {
    }
}

export default function WeatherPage() {
    return (
        <ThemeProvider theme={APP_THEME}>
            <main>
                <NavigationBar showBackButton title="London"></NavigationBar>
                <CurrentWeatherCard />
                <ListCard showTitle title={"Weekly weather"} childPropsList={[]} ></ListCard>
            </main>
        </ThemeProvider>
    );
}

function CurrentWeatherCard() {
    return (
        <section className="currentWeatherCard">
            <Typography variant="h1">12°</Typography>
            <Typography>Feels like 6°</Typography>
            <CloudCircleRounded fontSize="large" />
        </section>
    );
}