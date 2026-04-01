import { BrowserRouter, Route, Routes } from "react-router";
import DetailsPage from "../DetailsPage/DetailsPage";
import GPXWeatherMapPage from "../GPXWeatherPage/GPXWeatherPage";
import HomePage from "../HomePage/HomePage";
import LoginPage from "../Login/Login";
import RegisterPage from "../Register/RegisterPage";
import SearchPage from "../SearchPage/SearchPage";
import SettingsPage from '../SettingsPage/SettingsPage';
import SocialPage from '../SocialPage/SocialPage';
import WeatherPage from "../WeatherPage/WeatherPage";
import LogoutPage from "../Logout/Logout";
import './NavigationBar.css';
import { DrawerLinks } from "./NavigationBar";
import { useState, useEffect } from "react";


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
    new NavPath("/", "Home", <HomePage/>, true),
    new NavPath("/weather", "Weather", <WeatherPage />, false),
    new NavPath("/gpx", "GPX Weather", <GPXWeatherMapPage/>, false),
    new NavPath("/search", "Location search", <SearchPage/>, true),
    new NavPath("/details", "GPX Details", <DetailsPage/>, false),
    new NavPath("/social", "Social", <SocialPage/>, true),
    new NavPath("/settings", "Settings", <SettingsPage/>, true),
    new NavPath("/login", "Login", <LoginPage/>, true),
    new NavPath("/register", "Register", <RegisterPage/>, true),
    new NavPath("/logout", "Logout", <LogoutPage/>, true),
]

/**
 * Router element for URL based page navigation.
 */
export default function MainRouter() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!JSON.parse(localStorage.getItem("loggedInUser"))
    );

    useEffect(() => {
        const handleAuth = () => {
            setIsLoggedIn(!!JSON.parse(localStorage.getItem("loggedInUser")));
        };

        window.addEventListener("authChange", handleAuth);
        return () => window.removeEventListener("authChange", handleAuth);
    }, []);

    var routes = PATHS.map((path) => {
        return <Route key={path.relativePath} path={path.relativePath} element={path.page} />
    });

    return (

    <div className="app-root">
      <div className="app-layout">

        {/* Main content  would be within the main div*/}
        <main className="app-main">
          <div className="main-inner">
                <BrowserRouter>
                    <Routes>
                        {routes}
                    </Routes>
                </BrowserRouter>
          </div>
        </main>

        {/* Navigation */}

        <nav className="app-nav">
          <div className="nav-heading">
            <h2 className="nav-title">Navigation</h2>
          </div>
          <div className="nav-links">
            {/* pass isLoggedIn down so DrawerLinks re-renders when it changes */}
            <DrawerLinks currentPath={window.location.pathname} isLoggedIn={isLoggedIn}/>
          </div>
          <div className="nav-contact">
            Contact info:
            <p>Email: admin@findaroute.com</p>
            <p>Mobile: +44 0285683927</p>
          </div>
        </nav>

      </div>
    </div>      
    );
}