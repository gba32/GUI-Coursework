import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainRouter from './NavigationBar/NavLinks';
import SettingsPage from './SettingsPage/SettingsPage';
import SocialPage from './SocialPage/SocialPage';
import StorageUtil, { STORAGE_KEY } from './Utility/StorageUtil';


const root = ReactDOM.createRoot(document.getElementById('root'));

// Write default values for units, doesn't overwrite existing values
StorageUtil.writeOnce(STORAGE_KEY.DIST, 0);
StorageUtil.writeOnce(STORAGE_KEY.TEMP, 0);
StorageUtil.writeOnce(STORAGE_KEY.WIND, 0);

root.render(
	<React.StrictMode>
		<MainRouter />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
