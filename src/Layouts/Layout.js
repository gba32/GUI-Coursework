import './Layouts.css';


export function Layout() {
  return (
    // these divs are the layout of the page as its seperated into grid in css
    <div className="app-root">
      <div className="app-layout">

        {/* Main content  would be within the main div*/}
        <main className="app-main">
          <div className="main-inner">



          </div>
        </main>

        {/* Navigation */}

        <nav className="app-nav">
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
        </nav>

      </div>
    </div>
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
    </div>
  );
}
