import Hero from '../components/Hero';
import About from '../components/About';
import Ecosystem from '../components/Ecosystem';
import Why from '../components/Why';
import Technology from '../components/Technology';
import Team from '../components/Team';
import ComingSoon from '../components/ComingSoon';
import Cta from '../components/Cta';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HomePage = () => {
    const revealRef = useScrollReveal();

    return (
        <div ref={revealRef}>
            <Hero />
            <About />
            <Ecosystem />
            <Why />
            <Technology />
            <Team />
            <ComingSoon />
            <Cta />
        </div>
    );
};

export default HomePage;