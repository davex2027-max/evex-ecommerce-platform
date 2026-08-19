import { Rocket } from 'lucide-react';

const ComingSoon = () => (
    <section id="coming-soon">
        <div className="section-inner">
            <div className="coming-soon reveal">
                <div className="eco-icon"><Rocket size={24} /></div>
                <h2 className="section-title">
                    More EVEX products are <span className="grad-text">on the way.</span>
                </h2>
                <p className="section-text" style={{ maxWidth: 560, margin: '0 auto' }}>
                    The EVEX Super App and EVEX Learning Hub are being built right now. While you wait, check out
                    the <a href="#ecosystem" className="eco-link">EVEX Business Platform</a> — it's live today.
                </p>
            </div>
        </div>
    </section>
);

export default ComingSoon;