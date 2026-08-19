import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Ecosystem from './components/Ecosystem';
import Why from './components/Why';
import Technology from './components/Technology';
import Team from './components/Team';
import ComingSoon from './components/ComingSoon';
import Cta from './components/Cta';
import Footer from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import './App.css';

function App() {
    const revealRef = useScrollReveal();

    return (
        <div ref={revealRef}>
            <div className="bg-noise"></div>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Ecosystem />
                <Why />
                <Technology />
                <Team />
                <ComingSoon />
                <Cta />
            </main>
            <Footer />
        </div>
    );
}

export default App;