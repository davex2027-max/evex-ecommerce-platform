import { ArrowRight } from 'lucide-react';
import { useConstellation } from '../hooks/useConstellation';

const Team = () => {
    useConstellation('team-canvas', 7000, { linkDist: 110, speed: 0.14, mouseReact: false });

    return (
        <section id="team">
            <div className="section-inner grid-2-even">
                <div className="reveal">
                    <span className="eyebrow">Collaboration</span>
                    <h2 className="section-title">
                        Build with <span className="grad-text">us.</span>
                    </h2>
                    <p className="section-text">
                        Great technology is built by great people. EVEX is creating a collaborative environment where
                        developers, designers, innovators, educators, entrepreneurs, and technology enthusiasts can
                        work together to build meaningful digital products.
                    </p>
                    <a href="#final-cta" className="btn-primary" style={{ textDecoration: 'none', marginTop: 26 }}>
                        Join the EVEX Team <ArrowRight size={16} />
                    </a>
                </div>
                <div className="team-illustration reveal">
                    <canvas id="team-canvas" style={{ width: '100%', height: '100%', display: 'block' }}></canvas>
                </div>
            </div>
        </section>
    );
};

export default Team;