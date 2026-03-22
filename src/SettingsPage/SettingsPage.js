import React, { useState } from 'react';
import './SettingsPage.css';

const UNIT_OPTIONS = {
  temperature: ['°C', '°F'],
  distance: ['km', 'miles'],
  windSpeed: ['km/h', 'mph', 'm/s'],
};

export default function SettingsPage({ onBack }) {
  // Account state
  const [accountName, setAccountName] = useState('John Smith');
  const [email, setEmail] = useState('john.smith@email.com');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Preferences state
  const [tempUnit, setTempUnit] = useState('°C');
  const [distUnit, setDistUnit] = useState('km');
  const [windUnit, setWindUnit] = useState('km/h');
  const [defaultPace, setDefaultPace] = useState('20');

  // Notifications state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync devices (display only, informational toggle)
  const [syncEnabled, setSyncEnabled] = useState(true);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg('Password must be at least 8 characters.');
      return;
    }
    setPasswordMsg('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
  };

  const handleDeleteAccount = () => {
    // In a real app this would call an API
    alert('Account deletion requested. All your data including saved GPX routes has been scheduled for removal.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="settings-page">
      {/* Topbar */}
      <div className="settings-topbar">
        <button className="settings-topbar-back" onClick={onBack} aria-label="Go back">
          &#8592;
        </button>
        <span className="settings-topbar-title">Settings</span>
        <div className="settings-topbar-spacer" />
      </div>

      <div className="settings-body">

        {/* ── ACCOUNT SECTION ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">Account</h2>

          {/* Account details */}
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Name</span>
              <input
                className="settings-input"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <span className="settings-label">Email</span>
              <input
                className="settings-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Change password */}
          <div className="settings-card">
            <button
              className="settings-row settings-row-button"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordMsg('');
              }}
            >
              <span className="settings-label">Change Password</span>
              <span className="settings-chevron">{showPasswordForm ? '▲' : '▼'}</span>
            </button>

            {showPasswordForm && (
              <form className="settings-password-form" onSubmit={handlePasswordChange}>
                <div className="settings-divider" />
                <input
                  className="settings-input settings-input-block"
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  className="settings-input settings-input-block"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  className="settings-input settings-input-block"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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

          {/* Sync across devices */}
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

        {/* ── PREFERENCES SECTION ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">Preferences</h2>

          {/* Measurement units */}
          <div className="settings-card">
            <p className="settings-card-label">Measurement Units</p>

            <div className="settings-row">
              <span className="settings-label">Temperature</span>
              <div className="settings-pill-group">
                {UNIT_OPTIONS.temperature.map((u) => (
                  <button
                    key={u}
                    className={`settings-pill ${tempUnit === u ? 'settings-pill-active' : ''}`}
                    onClick={() => setTempUnit(u)}
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
                {UNIT_OPTIONS.distance.map((u) => (
                  <button
                    key={u}
                    className={`settings-pill ${distUnit === u ? 'settings-pill-active' : ''}`}
                    onClick={() => setDistUnit(u)}
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
                {UNIT_OPTIONS.windSpeed.map((u) => (
                  <button
                    key={u}
                    className={`settings-pill ${windUnit === u ? 'settings-pill-active' : ''}`}
                    onClick={() => setWindUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Default pace */}
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
                  onChange={(e) => setDefaultPace(e.target.value)}
                />
                <span className="settings-pace-unit">{distUnit}/h</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── NOTIFICATIONS SECTION ── */}
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

        {/* ── PRIVACY & DATA SECTION ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">Privacy &amp; Data</h2>

          <div className="settings-card">
            <div className="settings-row">
              <div>
                <span className="settings-label">Data Storage</span>
                <p className="settings-sublabel">We only store your saved GPX routes and preferences. Your data is handled in accordance with GDPR. You can request a full export at any time.</p>
              </div>
            </div>
            <div className="settings-divider" />
            <button className="settings-row settings-row-button">
              <span className="settings-label">Request Data Export</span>
              <span className="settings-chevron">&#8594;</span>
            </button>
          </div>

          {/* Delete account */}
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
                  <button
                    className="settings-btn settings-btn-ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="settings-btn settings-btn-danger"
                    onClick={handleDeleteAccount}
                  >
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
