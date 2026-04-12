import React from 'react';
import './App.css'; // Importing the separated styles

export default function App() {
  return (
    <div className="app-container">
      {/* Header Wrapper contains Logo and Both Navbars */}
      <div className="header-wrapper">
        <div className="top-header">
          <div className="logo-container">
            <img src="1 0.png" alt="150 Logo" className="site-logo" />
            <p className="slogan">The news, distilled.</p>
          </div>
          <nav className="utility-nav">
            <a href="#read">READ</a> <span className="divider">|</span>
            <a href="#write">WRITE</a> <span className="divider">|</span>
            <a href="#about">ABOUT</a>
          </nav>
        </div>

        {/* New Horizontal Category Navbar */}
        <nav className="category-nav">
          <a href="#latest">Latest</a>
          <a href="#nation">Nation</a>
          <a href="#states">States</a>
          <a href="#economy">Economy</a>
          <a href="#grassroots">Grassroots</a>
          <a href="#voices">Unheard Voices</a>
        </nav>
      </div>

      <main>
        {/* Hero Banner Section */}
        <section className="hero-section">
          <div className="hero-image-container">
            <img 
              src="[https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop](https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop)" 
              alt="Voice of the people" 
              className="hero-image"
            />
            <div className="hero-overlay">
              <h2 className="hero-title">BRUTALLY HONEST.<br/>UNWAVERINGLY HUMAN.</h2>
              <p className="hero-subtitle">Amplifying the voices of the unheard across India.</p>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="articles-section">
          {/* First Article */}
          <article className="article-block">
            <h3 className="article-title">New Solar Farm Initiated in Rajasthan</h3>
            <div className="article-meta">
              <span>Anonymous Contributor</span>
              <span>April 11, 2026</span>
            </div>
            <p className="article-content">
              The state government has finalized land acquisition for a new 500MW solar energy park in the Thar Desert. Construction begins next month, targeting completion by late 2027. This initiative aims to offset power shortages in neighboring industrial zones and reduce reliance on coal imports. Funding relies on a public-private partnership, with local farmers receiving equity in exchange for arid land usage. Critics note that while renewable energy is vital, the transmission infrastructure remains outdated and may struggle to integrate the sudden influx of grid power. Planners argue that synchronized upgrades to local substations will mitigate this risk. The project is expected to generate 2,000 temporary construction jobs and 150 permanent maintenance roles. Final environmental clearance was granted yesterday following a rapid, localized ecological impact assessment.
            </p>
          </article>

          {/* Second Article */}
          <article className="article-block">
            <h3 className="article-title">Local Transport Union Announces Strike</h3>
            <div className="article-meta">
              <span>Delhi Resident</span>
              <span>April 11, 2026</span>
            </div>
            <p className="article-content">
              Transport unions representing private bus operators have announced an indefinite strike starting midnight tomorrow. The core demand is an immediate revision of fare caps, which have remained stagnant despite a 15% rise in operational fuel costs over the last six months. The strike will affect approximately 40% of daily commuter routes, heavily impacting suburban transit. Government representatives stated they are willing to form a committee to review fare structures but refuse to negotiate while a strike threatens public mobility. Emergency state buses have been drafted to cover high-volume routes, though severe delays are anticipated during morning peak hours. Commuters are advised to utilize metro services where available or arrange carpooling. Further union negotiations are scheduled for Tuesday evening.
            </p>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 OneFifty. The news, distilled.</p>
      </footer>
    </div>
  );
}
