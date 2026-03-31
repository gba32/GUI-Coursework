import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../HomePage/HomePage";
import WeatherPage from "../WeatherPage/WeatherPage";
import GPXWeatherMapPage from "../GPXWeatherPage/GPXWeatherPage";
import DetailsPage from "../DetailsPage/DetailsPage";
import SearchPage from "../SearchPage/SearchPage";
import SettingsPage from '../SettingsPage/SettingsPage';
import SocialPage from '../SocialPage/SocialPage';

// Class for storing Navigation url paths
class NavPath {
    constructor(relativePath, title, page, navBarButton) {
        this.relativePath = relativePath;
        this.title = title;
        this.page = page;
        this.navBarButton = navBarButton;
    }
}

// Object storing all current Navigation paths
export const PATHS = [
    new NavPath("/", "Home", <HomePage username="GBA32" loggedIn />, true),
    new NavPath("/weather", "Weather", <WeatherPage />, false),
    new NavPath("/gpx", "GPX Weather", <GPXWeatherMapPage/>, false),
    new NavPath("/search", "Location search", <SearchPage/>, true),
    new NavPath("/details", "GPX Details", <DetailsPage/>, true),
    new NavPath("/social", "Social", <SocialPage/>, true),
    new NavPath("/settings", "Settings", <SettingsPage/>, true),
]

/**
 * 
 * @returns 
 */
export default function MainRouter() {
    var routes = PATHS.map((path) => {
        return <Route key={path.relativePath} path={path.relativePath} element={path.page} />
    });

    return (
        <BrowserRouter>
            <Routes>
                {routes}
            </Routes>
        </BrowserRouter>
    );
}