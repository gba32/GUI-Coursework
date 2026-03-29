import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../HomePage/HomePage";
import WeatherPage from "../WeatherPage/WeatherPage";
import SettingsPage from '../SettingsPage/SettingsPage';

// Class for storing Navigation url paths
class NavPath {
    constructor(relativePath, title, page) {
        this.relativePath = relativePath;
        this.title = title;
        this.page = page;
    }
}

// Object storing all current Navigation paths
export const PATHS = [
    new NavPath("/", "Home", <HomePage username="GBA32" loggedIn />),
    new NavPath("/weather", "Weather", <WeatherPage />),
    new NavPath("/settings", "Settings", <SettingsPage/>),
    
]

/**
 * 
 * @returns 
 */
export default function MainRouter() {
    var routes = PATHS.map((path) => {
        return <Route path={path.relativePath} element={path.page} />
    });

    return (
        <BrowserRouter>
            <Routes>
                {routes}
            </Routes>
        </BrowserRouter>
    );
}