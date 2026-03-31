import React, { useState } from 'react';
import './SocialPage.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import { APP_THEME } from '../Theme/Theme';
import ListCard, {ListCardItem} from '../ListCard/ListCard';
import { ThemeProvider } from '@mui/material';



import friendsData from './friends.json';
import eventsData from './events.json';

export default function SocialPage({ onBack, onMenuOpen }) {

  // activeTab controls which section is shown - 'friends' or 'events'
  const [activeTab, setActiveTab] = useState('friends');


  

  // loaded from friends.json as placeholder data for the demo
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





  //page render
  return (
    <div className="social-page">

      <ThemeProvider theme={APP_THEME}>
        <NavigationBar title = "Settings" />
      </ThemeProvider>
      



      {/* tab switcher - clicking a tab sets activeTab which controls what renders below */}
      <div className="social-tabs">
        <button
          className={`social-tab ${activeTab === 'friends' ? 'social-tab-active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends
          {/* show a badge with the number of pending requests if there are any */}
          {friendRequests.length > 0 && (
            <span className="social-tab-badge">{friendRequests.length}</span>
          )}
        </button>
        <button
          className={`social-tab ${activeTab === 'events' ? 'social-tab-active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>




      <div className="social-body">

        {/*friends*/}
        {activeTab === 'friends' && (
          <div>

            {/* pending requests card which only renders if there are any pending requests */}
            {friendRequests.length > 0 && (
              <div className="social-card">
                <p className="social-card-label">Pending Requests</p>
                {friendRequests.map((req, i) => (
                  <div key={req.id}>
                    {i > 0 && <div className="social-divider" />}
                    <div className="social-row">
                      <div>
                        <span className="social-label">{req.name}</span>
                        <p className="social-sublabel">{req.sport}</p>
                      </div>
                      {/* accept adds them to friends list and decline just dismisses the request */}
                      <div className="social-friend-actions">
                        <button
                          className="social-pill social-pill-active"
                          onClick={() => acceptFriendRequest(req)}
                        >
                          Accept
                        </button>
                        <button
                          className="social-pill"
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
            <div className="social-card">
              <div className="social-row social-row-full">
                <span className="social-label">Add Friends</span>
                {/* results appear below as you type, filtered from the placeholder pool */}
                <input
                  className="social-input-block social-search-input"
                  type="text"
                  placeholder="Search by name..."
                  value={friendSearch}
                  onChange={handleFriendSearch}
                />
              </div>

              {/* search results also only shown when there are matches */}
              {friendSearchResults.length > 0 && (
                <div>
                  <div className="social-divider" />
                  {friendSearchResults.map((user, i) => (
                    <div key={user.id}>
                      {i > 0 && <div className="social-divider" />}
                      <div className="social-row">
                        <div>
                          <span className="social-label">{user.name}</span>
                          <p className="social-sublabel">{user.sport}</p>
                        </div>
                        <button
                          className="social-pill social-pill-active"
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
                <p className="social-msg social-msg-ok" style={{ margin: '0 16px 12px' }}>
                  {friendMsg}
                </p>
              )}
            </div>

            {/* current friends list loaded from friends.json */}
            <div className="social-card">
              <p className="social-card-label">Your Friends ({friends.length})</p>
              {friends.length === 0 && (
                <div className="social-row">
                  <p className="social-sublabel">No friends added yet.</p>
                </div>
              )}
              {friends.map((friend, i) => (
                <div key={friend.id}>
                  {i > 0 && <div className="social-divider" />}
                  <div className="social-row">
                    <div>
                      <span className="social-label">{friend.name}</span>
                      <p className="social-sublabel">{friend.sport} &bull; {friend.routes} shared routes</p>
                    </div>
                    {/* red pill button to remove a friend from the list */}
                    <button
                      className="social-pill social-pill-danger"
                      onClick={() => removeFriend(friend.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* events tab */}
        {activeTab === 'events' && (
          <div>

            {/* events the user has saved - loaded from events.json for the demo */}
            <div className="social-card">
              <p className="social-card-label">Your Events ({savedEvents.length})</p>
              {savedEvents.length === 0 && (
                <div className="social-row">
                  <p className="social-sublabel">No events saved yet.</p>
                </div>
              )}
              {savedEvents.map((ev, i) => (
                <div key={ev.id}>
                  {i > 0 && <div className="social-divider" />}
                  <div className="social-row">
                    <div>
                      <span className="social-label">{ev.name}</span>
                      <p className="social-sublabel">{ev.date} &bull; {ev.location} &bull; {ev.distanceKm}km</p>
                    </div>
                    {/* removing an event puts it back in the browse list below */}
                    <button
                      className="social-pill social-pill-danger"
                      onClick={() => removeEvent(ev.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* browse panel to discover and save public events */}
            <div className="social-card">
              <div className="social-row social-row-full">
                <span className="social-label">Browse Public Events</span>
                <input
                  className="social-input-block social-search-input"
                  type="text"
                  placeholder="Search by name or location..."
                  value={eventSearch}
                  onChange={e => { setEventSearch(e.target.value); setEventMsg(''); }}
                />
              </div>

              {/* sort pills that matches the requirement to sort by popularity and distance */}
              <div className="social-row">
                <span className="social-label" style={{ fontSize: '13px', color: 'var(--primary)' }}>Sort by</span>
                <div className="social-pill-group">
                  {['popularity', 'distance', 'date'].map(opt => (
                    <button
                      key={opt}
                      className={`social-pill ${eventSortBy === opt ? 'social-pill-active' : ''}`}
                      onClick={() => setEventSortBy(opt)}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="social-divider" />

              {/* filteredEvents is computed at the top of the component from allEvents */}
              {filteredEvents.length === 0 && (
                <div className="social-row">
                  <p className="social-sublabel">No events found.</p>
                </div>
              )}

              {filteredEvents.map((ev, i) => (
                <div key={ev.id}>
                  {i > 0 && <div className="social-divider" />}
                  <div className="social-row">
                    <div>
                      <span className="social-label">{ev.name}</span>
                      <p className="social-sublabel">
                        {ev.date} &bull; {ev.location} &bull; {ev.distanceKm}km &bull; {ev.participants.toLocaleString()} participants
                      </p>
                    </div>
                    {/* saving an event moves it to the saved section and hides it here */}
                    <button
                      className="social-pill social-pill-active"
                      onClick={() => saveEvent(ev)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}

              {/* confirmation message shown after saving an event */}
              {eventMsg && (
                <p className="social-msg social-msg-ok" style={{ margin: '0 16px 12px' }}>
                  {eventMsg}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
