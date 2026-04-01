//Imports

import { useState } from 'react'; //import react and usecase to store and update onscreen values
import TitleBar from '../NavigationBar/NavigationBar';
import StorageUtil from '../Utility/StorageUtil';
import './SettingsPage.css';


// unit choices for the preferences section
const unitOptions = {
  temperature: ['°C', '°F'],
  distance: ['km', 'miles'],
  windSpeed: ['m/s', 'mph', 'km/h'],
};

export default function SettingsPage({ onBack, onMenuOpen }) {

  // account name and email
  const [accountName, setAccountName] = useState('John Smith');
  const [email, setEmail] = useState('john.smith@email.com');

  // password form is hidden by default and only shown when user taps 'Change Password' button
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');       // success or error message shown under the form

  // user default unit preferences
  const [tempUnit, setTempUnit] = useState('°C');
  const [distUnit, setDistUnit] = useState('km');
  const [windUnit, setWindUnit] = useState('km/h');
  const [defaultPace, setDefaultPace] = useState('25');     // default speed used to estimate arrival times

  //notifications and sync toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);

  // controls whether the delete confirmation warning is visible
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);





  // passsword 
  function handlePasswordChange(e) {
    e.preventDefault();                                     // stop browser doing a full page reload on submit

    // validate all three fields are filled before doing anything
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill in all fields.');
      return;
    }
    // check both new password fields match
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    // minimum length requirement
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.');
      return;
    }
    // all checks passed - in a real app this would call an API
    setPasswordMsg('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
  }



  // account deletion method
  function handleDeleteAccount() {
    // only shows an alert instead of actually deleting
    alert('Account deletion requested. All your data including saved GPX routes has been scheduled for removal.');
    setShowDeleteConfirm(false);
  }

  //Render of the page
  return (
    <div className="settings-page">

      <TitleBar title="Settings" />

      <div className="settings-body">

        {/* Account*/}
        <section className="settings-section">
          <h2 className="settings-section-title">Account</h2>

          {/* name and email editable inline */}
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Name</span>
              <input
                className="settings-input"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
              />
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <span className="settings-label">Email</span>
              <input
                className="settings-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* password change - collapsed by default, expands on tap */}
          <div className="settings-card">
            <button
              className="settings-row settings-row-button"
              onClick={() => { setShowPasswordForm(!showPasswordForm); setPasswordMsg(''); }}
            >
              <span className="settings-label">Change Password</span>
              <span className="settings-chevron">{showPasswordForm ? '▲' : '▼'}</span>
            </button>

            {/* only renders when showPasswordForm is true */}
            {showPasswordForm && (
              <form className="settings-password-form" onSubmit={handlePasswordChange}>
                <div className="settings-divider" />
                <input
                  className="settings-input settings-input-block"
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
                <input
                  className="settings-input settings-input-block"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <input
                  className="settings-input settings-input-block"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {/* show success in green, errors in red */}
                {passwordMsg && (
                  <p className={`settings-msg ${passwordMsg.includes('success') ? 'settings-msg-ok' : 'settings-msg-err'}`}>
                    {passwordMsg}
                  </p>
                )}
                <button type="submit" className="settings-btn settings-btn-primary">
                  Update Password
                </button>
              </form>
            )}
          </div>

          {/* sync toggle that flips between true and false on each tap */}
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <span className="settings-label">Sync Across Devices</span>
                <p className="settings-sublabel">Access your saved routes and preferences on any device</p>
              </div>
              <button
                className={`settings-toggle ${syncEnabled ? 'settings-toggle-on' : ''}`}
                onClick={() => setSyncEnabled(!syncEnabled)}
                aria-label="Toggle sync"
              >
                <span className="settings-toggle-thumb" />
              </button>
            </div>
          </div>
        </section>

        {/*PReferences */}
        <section className="settings-section">
          <h2 className="settings-section-title">Preferences</h2>

          {/* measurement unit selectors - pill buttons, one active at a time per row */}
          <div className="settings-card">
            <p className="settings-card-label">Measurement Units</p>

            <div className="settings-row">
              <span className="settings-label">Temperature</span>
              <div className="settings-pill-group">
                {unitOptions.temperature.map(u => (
                  <button
                    key={u}
                    className={`settings-pill ${tempUnit === u ? 'settings-pill-active' : ''}`}
                    onClick={() => {
                      StorageUtil.reset("TEMP_UNIT");
                      StorageUtil.writeOnce("TEMP_UNIT", unitOptions.temperature.indexOf(u));
                      setTempUnit(u)
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <span className="settings-label">Distance</span>
              <div className="settings-pill-group">
                {unitOptions.distance.map(u => (
                  <button
                    key={u}
                    className={`settings-pill ${distUnit === u ? 'settings-pill-active' : ''}`}
                    onClick={() => {
                      StorageUtil.reset("DIST_UNIT");
                      StorageUtil.writeOnce("DIST_UNIT", unitOptions.distance.indexOf(u));
                      setDistUnit(u)
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <span className="settings-label">Wind Speed</span>
              <div className="settings-pill-group">
                {unitOptions.windSpeed.map(u => (
                  <button
                    key={u}
                    className={`settings-pill ${windUnit === u ? 'settings-pill-active' : ''}`}
                    onClick={() => {
                      StorageUtil.reset("WIND_UNIT");
                      StorageUtil.writeOnce("WIND_UNIT", unitOptions.windSpeed.indexOf(u));
                      setWindUnit(u)
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* default speed input with unit changing to match the one chosen by the user */}
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <span className="settings-label">Default Average Speed</span>
                <p className="settings-sublabel">Used to estimate arrival times along your route</p>
              </div>
              <div className="settings-pace-input-group">
                <input
                  className="settings-pace-input"
                  type="number"
                  min="1"
                  max="100"
                  value={defaultPace}
                  onChange={e => setDefaultPace(e.target.value)}
                />
                <span className="settings-pace-unit">{distUnit}/h</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="settings-section">
          <h2 className="settings-section-title">Notifications</h2>

          <div className="settings-card">
            <div className="settings-row">
              <div>
                <span className="settings-label">Weather Alerts</span>
                <p className="settings-sublabel">Get notified of significant forecast changes along your saved routes before your planned start time</p>
              </div>
              <button
                className={`settings-toggle ${notificationsEnabled ? 'settings-toggle-on' : ''}`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                aria-label="Toggle notifications"
              >
                <span className="settings-toggle-thumb" />
              </button>
            </div>
          </div>
        </section>




        {/* Privacy and Data */}
        <section className="settings-section">
          <h2 className="settings-section-title">Privacy &amp; Data</h2>

          <div className="settings-card">
            {/* data storage row spans full width */}
            <div className="settings-row settings-row-full">
              <span className="settings-label">Data Storage</span>
              <p className="settings-sublabel settings-sublabel-full">
                We only store your saved GPX routes and preferences. Your data is handled in accordance with GDPR. You can request a full export at any time.
              </p>
            </div>
            <div className="settings-divider" />
            <button className="settings-row settings-row-button">
              <span className="settings-label">Request Data Export</span>
              <span className="settings-chevron">&#8594;</span>
            </button>
          </div>

          {/* delete account with two step confirmation to avoid misclicks */}
          <div className="settings-card settings-card-danger">
            {!showDeleteConfirm ? (
              <button
                className="settings-row settings-row-button"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <span className="settings-label settings-label-danger">Delete Account</span>
                <span className="settings-chevron settings-label-danger">&#8594;</span>
              </button>
            ) : (
              <div className="settings-delete-confirm">
                <p className="settings-delete-warning">
                  This will permanently delete your account and all associated data, including your saved GPX routes. This cannot be undone.
                </p>
                <div className="settings-delete-actions">
                  <button className="settings-btn settings-btn-ghost" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button className="settings-btn settings-btn-danger" onClick={handleDeleteAccount}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <p className="settings-gdpr-note">
          GPX Weather App &bull; GDPR compliant &bull; Only essential data is stored
        </p>

      </div>
    </div>
  );
}
