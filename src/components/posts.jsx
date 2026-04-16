import React, { useState } from "react";
import "./App.css";

const COLORS = ["pink", "green", "blue", "yellow", "purple"];

function App() {
    const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);

    const onButtonClick = (color) => () => {
        setBackgroundColor(color);
    };

    return (
        <div
            className="App"
            style={{
                backgroundColor,
            }}
        >
            {COLORS.map((color) => (
                <button
                    type="button"
                    key={color}
                    onClick={onButtonClick(color)}
                    className={backgroundColor === color ? "selected" : ""}
                >
                    {color}
                </button>
            ))}
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import { Mainfeed } from './Mainfeed';
import { Createpost } from './Createpost';
import { Plus } from 'lucide-react';

export const Home = () => {
    // 1. Create a state to track which view is active
    // 'feed' = viewing the mainfeed, 'create' = writing a post
    const [view, setView] = useState('feed');

    return (
        <div className="w-full bg-black min-h-screen text-white px-4 md:px-12 py-10">

            {/* 2. The Navigation/Toggle Area */}
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <h3 className="font-serif text-2xl font-bold">
                    {view === 'feed' ? 'The Newsroom' : 'Printing Press'}
                </h3>

                {/* Toggle Button */}
                <button
                    onClick={() => setView(view === 'feed' ? 'create' : 'feed')}
                    className="flex items-center gap-2 bg-white text-black px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-colors"
                >
                    {view === 'feed' ? (
                        <><Plus size={14} /> Create a Print</>
                    ) : (
                        'Back to Feed'
                    )}
                </button>
            </div>

            {/* 3. CONDITIONAL RENDERING: This is the "Swap" */}
            <div className="max-w-4xl mx-auto">
                {view === 'feed' ? (
                    <Mainfeed />
                ) : (
                    <Createpost onCancel={() => setView('feed')} />
                )}
            </div>
        </div>
    );
};
