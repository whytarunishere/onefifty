import React, { useState } from 'react'; // Added useState
import Section1 from './components/Section1';
import Navbar from './components/Navbar';
import Maincontent from './components/Maincontent';
import { Footer } from './components/Footer';

export default function App() {
    // Logic: false = show feed, true = show create post
    const [isWriting, setIsWriting] = useState(false);

    return (
        <>
            <Section1 />
            {/* Pass state and setter to Navbar */}
            <Navbar isWriting={isWriting} setIsWriting={setIsWriting} />
            {/* Pass state and setter to Maincontent */}
            <Maincontent isWriting={isWriting} setIsWriting={setIsWriting} />
            <Footer />
        </>            
    );
}
