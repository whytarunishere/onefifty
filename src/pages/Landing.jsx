import React from 'react';

// Mocking imports for the standalone preview environment.
// Replace these with your actual imports in your local project:
// import { Link, Navigate } from 'react-router-dom';
// import { isAuthenticated } from '../lib/auth';
// import logo from '../assets/logo1_white.png';
// import heroImage from '../assets/hero.jpg';

const Link = ({ to, children, className, ...props }) => <a href={to} className={className} {...props}>{children}</a>;
const isAuthenticated = () => false;
const Navigate = ({ to }) => null;

export default function Landing() {
  // Redirect to dashboard if the user is already logged in
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {/* ── Google Fonts & Custom CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
        
        body {
            background-color: #FAFAFA;
            color: #111111;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* Mapping typography classes */
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        /* Custom highlight effect for emphasis */
        .text-highlight {
            background: linear-gradient(120deg, rgba(217, 45, 32, 0.15) 0%, rgba(217, 45, 32, 0.15) 100%);
            background-repeat: no-repeat;
            background-size: 100% 40%;
            background-position: 0 85%;
        }

        /* Editorial border style */
        .border-editorial {
            border-bottom: 2px solid #111111;
        }
      `}</style>

      <div className="font-sans antialiased selection:bg-[#D92D20] selection:text-white min-h-screen flex flex-col">
        
        {/* ══════════════════════════════════════════
            NAVIGATION
        ══════════════════════════════════════════ */}
        <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center border-editorial sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-50">
            <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl tracking-tighter">
                  One<span className="text-[#D92D20]">Fifty.</span>
                </span>
            </div>
            
            <div className="hidden md:flex gap-8 font-medium text-sm tracking-wide">
                <Link to="/login" className="hover:text-[#D92D20] transition-colors">Read</Link>
                <Link to="/signup" className="hover:text-[#D92D20] transition-colors">Write</Link>
                <a href="#vision" className="hover:text-[#D92D20] transition-colors">The Vision</a>
            </div>
            
            <div className="flex gap-4 items-center">
                <Link to="/login" className="hidden sm:block font-medium text-sm hover:text-[#D92D20] transition-colors">
                    Log In
                </Link>
                <Link to="/signup" className="font-medium text-sm border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300">
                    Join Us
                </Link>
            </div>
        </nav>

        <main className="flex-1">
            {/* ══════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════ */}
            <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 py-20 relative">
                <div className="max-w-5xl">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#D92D20] rounded-full animate-pulse"></div>
                        <span className="font-display text-sm tracking-widest uppercase font-bold text-[#D92D20]">The New Standard</span>
                    </div>
                    
                    <h1 className="font-display text-6xl md:text-8xl font-bold leading-[1.05] tracking-tighter mb-8">
                        News doesn't belong to a few. <br className="hidden lg:block" />
                        It belongs to <span className="text-highlight">1.5 billion</span> of us.
                    </h1>
                    
                    <p className="font-sans text-xl md:text-2xl text-gray-700 max-w-3xl leading-relaxed mb-12 font-light">
                        An independent platform built for India. Stories aren't shaped by massive corporate agendas, foreign biases, or political bends. They are written by the people who actually live them.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/login" className="bg-[#111111] text-[#FAFAFA] font-display text-lg px-8 py-4 hover:bg-[#D92D20] transition-colors duration-300 flex items-center justify-center gap-2">
                            Start Reading
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </Link>
                        <Link to="/signup" className="bg-transparent border-2 border-[#111111] text-[#111111] font-display text-lg px-8 py-4 hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center">
                            Write an Article
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 2: THE PROBLEM
            ══════════════════════════════════════════ */}
            <section id="vision" className="bg-[#111111] text-[#FAFAFA] py-24 px-6 md:px-12">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-serif italic text-4xl md:text-5xl leading-tight mb-6">
                            "They have the power to change public view, bend opinions, and show what they want... smartly."
                        </h2>
                        <div className="w-16 h-[2px] bg-[#D92D20] mb-6"></div>
                    </div>
                    <div>
                        <h3 className="font-display text-3xl font-bold mb-6">The narrative needs to change.</h3>
                        <p className="text-lg text-gray-300 leading-relaxed mb-6 font-light">
                            Look at the world’s biggest news organizations. They are massive, highly structured, and heavily influential. Whether they claim independence or not, power concentrated in the hands of a few means they get to decide what you see and how you think. 
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed font-light">
                            India is too diverse, and too complex for a top-down media model. We shouldn't have to rely on agencies that prioritize their own lens over our reality. You are smart enough to decide what is right and wrong. You just need the raw, correct facts.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 3: THE VISION
            ══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                        150 Crore Voices.<br/><span className="text-[#D92D20]">Zero Agendas.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                        OneFifty is a self-scaling, decentralized network of truth. The model doesn't rely on editors in high-rise buildings. It relies on you.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 border border-[#ECECEC] hover:border-[#111111] transition-colors bg-[#FAFAFA]">
                        <div className="w-12 h-12 bg-[#111111] text-[#FAFAFA] flex items-center justify-center font-display text-xl font-bold mb-6">01</div>
                        <h4 className="font-display text-2xl font-bold mb-4">Unfiltered Truth</h4>
                        <p className="text-gray-600 leading-relaxed font-light">Our only job is to serve you the correct news. No spin, no sensationalism, no hidden motives. Just the events as they happened.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="p-8 border border-[#ECECEC] hover:border-[#111111] transition-colors bg-[#FAFAFA]">
                        <div className="w-12 h-12 bg-[#111111] text-[#FAFAFA] flex items-center justify-center font-display text-xl font-bold mb-6">02</div>
                        <h4 className="font-display text-2xl font-bold mb-4">From All of India</h4>
                        <p className="text-gray-600 leading-relaxed font-light">Articles from the whole country. From massive metros to the deepest rural towns. Every story and every person deserves to be heard.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="p-8 border border-[#ECECEC] hover:border-[#111111] transition-colors bg-[#FAFAFA]">
                        <div className="w-12 h-12 bg-[#111111] text-[#FAFAFA] flex items-center justify-center font-display text-xl font-bold mb-6">03</div>
                        <h4 className="font-display text-2xl font-bold mb-4">By The People</h4>
                        <p className="text-gray-600 leading-relaxed font-light">People decide what is wrong and what is right. You read, you verify, and you write. The platform scales through the community.</p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 4: CALL TO ACTION
            ══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-12 border-t border-[#ECECEC] bg-[#f0f0eb]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Real people. Real articles.</h2>
                    <p className="text-xl text-gray-700 mb-10 font-light leading-relaxed">
                        Great movements start from the ground up. In our starting phase, OneFifty is a community-driven space. I am writing articles here, and I want you to write them, too. If you see something happening in your city—this is your blank page.
                    </p>
                    <Link to="/signup" className="inline-block bg-[#D92D20] text-white font-display text-xl px-10 py-5 hover:bg-[#111111] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Start Writing Today
                    </Link>
                </div>
            </section>
        </main>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer className="bg-[#111111] text-[#FAFAFA] py-12 px-6 md:px-12 border-t-[8px] border-[#D92D20]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <span className="font-display font-bold text-3xl tracking-tighter">
                      One<span className="text-[#D92D20]">Fifty.</span>
                    </span>
                    <p className="text-gray-400 mt-2 text-sm font-light">India's news, written by India.</p>
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                    <Link to="/login" className="hover:text-white transition-colors">Read</Link>
                    <Link to="/signup" className="hover:text-white transition-colors">Write</Link>
                    <a href="#vision" className="hover:text-white transition-colors">Manifesto</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter / X</a>
                </div>
            </div>
        </footer>

      </div>
    </>
  );
}