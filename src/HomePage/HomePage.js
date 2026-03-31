import { Typography } from '@mui/material';
import './HomePage.css';
import { useNavigate } from 'react-router';
import StorageUtil from '../Utility/StorageUtil';
import { gpxData } from '../GPXroute/sampleGPX2';

const previousRoutes = [
  { name: 'London Marathon Course', distance: '42.2km', elevation: '127m' },
  { name: 'Scotland hike', distance: '35.6km', elevation: '2471m' },
  { name: 'Saturday 28/2 club ride', distance: '97km', elevation: '782m' },
];

/**
 * Root component — renders AccountHomePage or GuestHomePage
 * depending on the user's logged-in status.
 * @param {boolean} loggedIn
 * @param {string}  username
 */
export default function HomePage({ loggedIn, username }) {
  return loggedIn ? <AccountHomePage username={username} /> : <GuestHomePage />;
}

/**
 * Home page for a user with an account.
 * @param {string} username
 */
export function AccountHomePage({ username }) {
  let navigator = useNavigate();
  return (
      <>
        {/* Main content */}
        <main className="app-main">
          <div className="main-inner">

            {/* Header */}
            <section className="card header-card">
              <div className="header-inner">
                <div className="avatar">
                  <svg viewBox="0 0 24 24" fill="none" className="avatar-icon" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21a8 8 0 1 0-16 0" />
                    <circle cx="12" cy="8" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="welcome-label">Welcome back</p>
                  <h1 className="user-name">{username}</h1>
                </div>
              </div>
            </section>

            {/* Main grid */}
            <div className="main-grid">

              {/* Upload + actions */}
              <section className="card upload-card">
                <div className="upload-dropzone">
                  <div className="upload-btn-wrap">
                    <button className="btn-primary">
                      <svg viewBox="0 0 24 24" fill="none" className="btn-icon" stroke="currentColor" strokeWidth="2">
                        <path d="M12 16V4" />
                        <path d="m7 9 5-5 5 5" />
                        <path d="M5 20h14" />
                      </svg>
                      Upload GPX
                    </button>
                  </div>
                </div>

                <div className="upload-actions">
                  <button className="btn-confirm" onClick={() => {
                    console.log("clicked!");
                      StorageUtil.reset("GPX_DATA");
                      StorageUtil.writeOnce("GPX_DATA", gpxData);
                      navigator("/details");
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" className="btn-icon" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm
                  </button>
                  <button className="btn-cancel">
                    <svg viewBox="0 0 24 24" fill="none" className="btn-icon" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </section>

              {/* Quick access side panel */}
              <aside className="card quick-access-card">
                <h2 className="section-title">Quick access</h2>
                <p className="section-desc">
                  Upload a new GPX route, reopen a previous activity, or move to weather and account pages.
                </p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <p className="stat-label">Recent routes</p>
                    <p className="stat-value">3</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">Saved favourites</p>
                    <p className="stat-value">2</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">Default pace</p>
                    <p className="stat-value">25 km/h</p>
                  </div>
                </div>
              </aside>
            </div>

            {/* History / Previous routes */}
            <section className="card routes-card">
              <div className="routes-header">
                <h2 className="routes-title">History</h2>
                <button className="btn-view-all">View all</button>
              </div>
              <div className="routes-grid">
                {previousRoutes.map((route) => (
                  <button key={route.name} className="route-item">
                    <div className="route-inner">
                      <span className="route-bullet">-</span>
                      <div>
                        <h3 className="route-name">{route.name}</h3>
                        <p className="route-meta">
                          {route.distance} <span className="route-sep">-</span> {route.elevation}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

          </div>
        </main>

        {/* Navigation */}
        {/* <nav className="app-nav">
          <div className="nav-heading">
            <h2 className="nav-title">Navigation</h2>
          </div>
          <div className="nav-links">
            <button className="nav-btn nav-btn--active">GPX Upload</button>
            <button className="nav-btn">Weather</button>
            <button className="nav-btn">Account</button>
          </div>
          <div className="nav-contact">
            Contact info:
            <p>Email: @</p>
            <p>Mobile: +44</p>
          </div>
        </nav> */}

      </>
  );
}


/**
 * Home page for users without an account.
 */
export function GuestHomePage() {
  return (
    <div className="app-root">
      <div className="guest-layout">
        <div className="card guest-card">
          <div className="avatar avatar--large">
            <svg viewBox="0 0 24 24" fill="none" className="avatar-icon avatar-icon--large" stroke="currentColor" strokeWidth="2">
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </div>
          <h1 className="guest-title">Welcome</h1>
          <p className="guest-desc">Log in or create an account to track your routes, or upload a GPX file directly.</p>
          <div className="guest-actions">
            <button className="btn-primary btn-primary--large">Log in</button>
            <button className="btn-primary btn-primary--large">Sign up</button>
            <button className="btn-outline btn-primary--large">Upload GPX</button>
          </div>
        </div>
      </div>

              {/* Navigation */}
        {/* <nav className="app-nav">
          <div className="nav-heading">
            <h2 className="nav-title">Navigation</h2>
          </div>
          <div className="nav-links">
            <button className="nav-btn nav-btn--active">GPX Upload</button>
            <button className="nav-btn">Weather</button>
            <button className="nav-btn">Account</button>
          </div>
          <div className="nav-contact">
            Contact info:
            <p>Email: @</p>
            <p>Mobile: +44</p>
          </div>
        </nav> */}
    </div>

    
  );
}

function HistoryCard(gpx) {
    return <article>
        <Typography variant='h4'>{gpx.metadata.name}</Typography>
    </article>
}