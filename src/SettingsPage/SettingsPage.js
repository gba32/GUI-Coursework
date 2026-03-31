//Imports

import React, { useState } from 'react';              //import react and usecase to store and update onscreen values
import './SettingsPage.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import { APP_THEME } from '../Theme/Theme';
import ListCard, {ListCardItem} from '../ListCard/ListCard';
import { ThemeProvider } from '@mui/material';

//friend and events json files with placeholder values
import friendsData from './friends.json';
import eventsData from './events.json';

// unit choices for the preferences section
const unitOptions = {
  temperature: ['°C', '°F'],
  distance: ['km', 'miles'],
  windSpeed: ['km/h', 'mph', 'm/s'],
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



  // loaded from friends.json as placeholder data for demo
  const [friends, setFriends] = useState(friendsData);
  const [friendSearch, setFriendSearch] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState([]);

  // two hardcoded pending requests to demonstrate the notification requirement
  const [friendRequests, setFriendRequests] = useState([
    { id: 101, name: 'Lance Armstrong', sport: 'Cyclist' },
    { id: 102, name: 'Usain Bolt', sport: 'Runner' },
  ]);
  const [friendMsg, setFriendMsg] = useState('');           // confirmation message after sending a request


  // first two events pre-saved to show the saved events section in the demo
  const [savedEvents, setSavedEvents] = useState(eventsData.slice(0, 2));
  const [allEvents] = useState(eventsData);                 // full list never changes so no setter needed
  const [eventSearch, setEventSearch] = useState('');
  const [eventSortBy, setEventSortBy] = useState('popularity');
  const [eventMsg, setEventMsg] = useState('');             // confirmation message after saving an event



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



//friend method
  function handleFriendSearch(e) {
    const query = e.target.value;
    setFriendSearch(query);
    setFriendMsg('');


    // placeholder users for demo use instead of API calls
    const currentFriendIds = friends.map(f => f.id);
    const searchPool = [
      { id: 201, name: 'Mathieu van der Poel', sport: 'Cyclist' },
      { id: 202, name: 'Mo Farah', sport: 'Runner' },
      { id: 203, name: 'Lance Armstrong', sport: 'Cyclist' },
    ];

    // filter out anyone already in the friends list so you cant add duplicates
    const results = searchPool.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) &&
      !currentFriendIds.includes(u.id)
    );
    setFriendSearchResults(results);
  }

  function sendFriendRequest(user) {
    // remove the user from search results so they cant be requested twice
    setFriendMsg(`Friend request sent to ${user.name}.`);
    setFriendSearchResults(prev => prev.filter(u => u.id !== user.id));
  }

  function acceptFriendRequest(user) {
    // add the accepted user to the friends list and remove from pending requests
    setFriends(prev => [...prev, { ...user, routes: 0 }]);
    setFriendRequests(prev => prev.filter(r => r.id !== user.id));
  }

  function declineFriendRequest(user) {
    //remove from pending request list
    setFriendRequests(prev => prev.filter(r => r.id !== user.id));
  }

  function removeFriend(friendId) {
    // filter out the friend with the matching id from the list
    setFriends(prev => prev.filter(f => f.id !== friendId));
  }





//events Method
  //filter and sort events for the search and hide events that are already saved by the user
  const filteredEvents = allEvents
    .filter(ev => {
      const savedIds = savedEvents.map(e => e.id);
      if (savedIds.includes(ev.id)) return false;           // dont show events already saved
      if (eventSearch.trim().length > 0)
        return (
          ev.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
          ev.location.toLowerCase().includes(eventSearch.toLowerCase())
        );
      return true;
    })
    .sort((a, b) => {
      if (eventSortBy === 'popularity') return b.participants - a.participants;    // most popular first
      if (eventSortBy === 'distance') return a.distanceKm - b.distanceKm;         // shortest first
      if (eventSortBy === 'date') return new Date(a.date) - new Date(b.date);     // soonest first
      return 0;
    });

  function saveEvent(ev) {
    // move event from the browse list up into the saved events section
    setSavedEvents(prev => [...prev, ev]);
    setEventMsg(`${ev.name} added to your events.`);
  }

  function removeEvent(eventId) {
    // remove event from saved list, it will reappear in the browse panel
    setSavedEvents(prev => prev.filter(e => e.id !== eventId));
  }




//Render of the page
  return (
    <div className="settings-page">

      <ThemeProvider theme={APP_THEME}>
        <NavigationBar title = "Settings" />
      </ThemeProvider>

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
                {unitOptions.distance.map(u => (
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
                {unitOptions.windSpeed.map(u => (
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

        {/* Friends */}
        <section className="settings-section">
          <h2 className="settings-section-title">Friends</h2>

          {/* pending requests card which only renders if there are pending requests */}
          {friendRequests.length > 0 && (
            <div className="settings-card">
              <p className="settings-card-label">Pending Requests</p>
              {friendRequests.map((req, i) => (
                <div key={req.id}>
                  {i > 0 && <div className="settings-divider" />}
                  <div className="settings-row">
                    <div>
                      <span className="settings-label">{req.name}</span>
                      <p className="settings-sublabel">{req.sport}</p>
                    </div>
                    {/* accept adds them to friends list and decline just dismisses the request */}
                    <div className="settings-friend-actions">
                      <button
                        className="settings-pill settings-pill-active"
                        onClick={() => acceptFriendRequest(req)}
                      >
                        Accept
                      </button>
                      <button
                        className="settings-pill"
                        onClick={() => declineFriendRequest(req)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* search bar to find and add new friends */}
          <div className="settings-card">
            <div className="settings-row settings-row-full">
              <span className="settings-label">Add Friends</span>
              {/* results appear below as you type, filtered from the placeholder pool */}
              <input
                className="settings-input-block settings-search-input"
                type="text"
                placeholder="Search by name..."
                value={friendSearch}
                onChange={handleFriendSearch}
              />
            </div>

            {/* search results also only shown when there are matches */}
            {friendSearchResults.length > 0 && (
              <div>
                <div className="settings-divider" />
                {friendSearchResults.map((user, i) => (
                  <div key={user.id}>
                    {i > 0 && <div className="settings-divider" />}
                    <div className="settings-row">
                      <div>
                        <span className="settings-label">{user.name}</span>
                        <p className="settings-sublabel">{user.sport}</p>
                      </div>
                      <button
                        className="settings-pill settings-pill-active"
                        onClick={() => sendFriendRequest(user)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* confirmation message shown after a request is sent */}
            {friendMsg && (
              <p className="settings-msg settings-msg-ok" style={{ margin: '0 16px 12px' }}>
                {friendMsg}
              </p>
            )}
          </div>

          {/* current friends list loaded from friends.json */}
          <div className="settings-card">
            <p className="settings-card-label">Your Friends ({friends.length})</p>
            {friends.length === 0 && (
              <div className="settings-row">
                <p className="settings-sublabel">No friends added yet.</p>
              </div>
            )}
            {friends.map((friend, i) => (
              <div key={friend.id}>
                {i > 0 && <div className="settings-divider" />}
                <div className="settings-row">
                  <div>
                    <span className="settings-label">{friend.name}</span>
                    <p className="settings-sublabel">{friend.sport} &bull; {friend.routes} shared routes</p>
                  </div>
                  {/* red pill button to remove a friend from the list */}
                  <button
                    className="settings-pill settings-pill-danger"
                    onClick={() => removeFriend(friend.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events*/}
        <section className="settings-section">
          <h2 className="settings-section-title">Events</h2>

          {/* events the user has saved which is loaded from events.json */}
          <div className="settings-card">
            <p className="settings-card-label">Your Events ({savedEvents.length})</p>
            {savedEvents.length === 0 && (
              <div className="settings-row">
                <p className="settings-sublabel">No events saved yet.</p>
              </div>
            )}
            {savedEvents.map((ev, i) => (
              <div key={ev.id}>
                {i > 0 && <div className="settings-divider" />}
                <div className="settings-row">
                  <div>
                    <span className="settings-label">{ev.name}</span>
                    <p className="settings-sublabel">{ev.date} &bull; {ev.location} &bull; {ev.distanceKm}km</p>
                  </div>
                  {/* removing an event puts it back in the browse list below */}
                  <button
                    className="settings-pill settings-pill-danger"
                    onClick={() => removeEvent(ev.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* browse panel to discover and save public events */}
          <div className="settings-card">
            <div className="settings-row settings-row-full">
              <span className="settings-label">Browse Public Events</span>
              <input
                className="settings-input-block settings-search-input"
                type="text"
                placeholder="Search by name or location..."
                value={eventSearch}
                onChange={e => { setEventSearch(e.target.value); setEventMsg(''); }}
              />
            </div>

            {/* sort pills that matches the requirement to sort by popularity and distance */}
            <div className="settings-row">
              <span className="settings-label" style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Sort by</span>
              <div className="settings-pill-group">
                {['popularity', 'distance', 'date'].map(opt => (
                  <button
                    key={opt}
                    className={`settings-pill ${eventSortBy === opt ? 'settings-pill-active' : ''}`}
                    onClick={() => setEventSortBy(opt)}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-divider" />

            {/* filteredEvents is computed at the top of the component from allEvents */}
            {filteredEvents.length === 0 && (
              <div className="settings-row">
                <p className="settings-sublabel">No events found.</p>
              </div>
            )}

            {filteredEvents.map((ev, i) => (
              <div key={ev.id}>
                {i > 0 && <div className="settings-divider" />}
                <div className="settings-row">
                  <div>
                    <span className="settings-label">{ev.name}</span>
                    <p className="settings-sublabel">
                      {ev.date} &bull; {ev.location} &bull; {ev.distanceKm}km &bull; {ev.participants.toLocaleString()} participants
                    </p>
                  </div>
                  {/* saving an event moves it to the saved section and hides it here */}
                  <button
                    className="settings-pill settings-pill-active"
                    onClick={() => saveEvent(ev)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}

            {/* confirmation message shown after saving an event */}
            {eventMsg && (
              <p className="settings-msg settings-msg-ok" style={{ margin: '0 16px 12px' }}>
                {eventMsg}
              </p>
            )}
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
