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
import './NavigationBar.css';
import { DrawerLinks } from "./NavigationBar";


// Class for storing Navigation url paths
class NavPath {
    constructor(relativePath, title, page, navBarButton) {
        this.relativePath = relativePath;
        this.title = title;
        this.page = page;
        this.navBarButton = navBarButton;
    }
}
const userAccount = JSON.parse(localStorage.getItem("loggedInUser"));
let uname = userAccount?.name ?? "Guest";
let loggedIn = !!userAccount;
console.log(loggedIn);



// Object storing all current Navigation paths
export const PATHS = [
    new NavPath("/", "Home", <HomePage username={uname} loggedIn={loggedIn} />, true),
    new NavPath("/weather", "Weather", <WeatherPage />, false),
    new NavPath("/gpx", "GPX Weather", <GPXWeatherMapPage/>, false),
    new NavPath("/search", "Location search", <SearchPage/>, true),
    new NavPath("/details", "GPX Details", <DetailsPage/>, true),
    new NavPath("/social", "Social", <SocialPage/>, true),
    new NavPath("/settings", "Settings", <SettingsPage/>, true),
    new NavPath("/login", "Login", <LoginPage/>, true),
    new NavPath("/register", "Register", <RegisterPage/>, true) 
]

/**
 * Router element for URL based page navigation.
 */
export default function MainRouter() {
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
            <DrawerLinks currentPath={window.location.pathname}/>
          </div>
          <div className="nav-contact">
            Contact info:
            <p>Email: @</p>
            <p>Mobile: +44</p>
          </div>
        </nav>

      </div>
    </div>      
    );
}