import { ArrowRight, ArrowUpRight, BarChart3, Sparkles, GraduationCap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConstellation } from '../hooks/useConstellation';
import { useHeroParallax } from '../hooks/useHeroParallax';

const Hero = () => {
    useConstellation('hero-canvas', 9000, { linkDist: 140, speed: 0.22 });
    useHeroParallax();

    return (
        <section id="hero">
            <div className="hero-grid">
                <div className="reveal in">
                    <span className="eyebrow">EVEX DIGITAL COMPANY</span>
                    <h1 className="hero-headline">
                        BUILD THE<br />
                        <span className="grad-text">FUTURE.</span> DIGITALLY.
                    </h1>
                    <p className="hero-sub">
                        EVEX Digital Company is building a futuristic ecosystem of apps and platforms designed to
                        connect people, educate communities, empower businesses, and transform ideas into intelligent
                        digital experiences.
                    </p>
                    <div className="hero-actions">
                        <a href="#ecosystem" className="btn-primary" style={{ textDecoration: 'none' }}>
                            Explore EVEX <ArrowRight size={16} />
                        </a>
                        <Link to="/careers" className="btn-ghost">
                            Join Our Team <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>

                <div className="hero-visual-wrap reveal in" id="hero-visual-wrap">
                    <div className="hero-visual-frame" id="hero-visual-frame">
                        <canvas id="hero-canvas"></canvas>
                        <div className="orbit-ring r2"></div>
                        <div className="orbit-ring r1"></div>
                        <div className="orbit-core"></div>
                    </div>

                    <div className="panel-slot p1">
                        <div className="app-panel">
                            <div className="panel-head">
                                <div className="panel-icon"><BarChart3 size={14} /></div>
                                <span>Business Suite</span>
                            </div>
                            <div className="bar-row">
                                <i style={{ height: '40%' }}></i>
                                <i style={{ height: '70%' }}></i>
                                <i style={{ height: '55%' }}></i>
                                <i style={{ height: '90%' }}></i>
                                <i style={{ height: '65%' }}></i>
                                <i style={{ height: '80%' }}></i>
                            </div>
                        </div>
                    </div>

                    <div className="panel-slot p2">
                        <div className="app-panel">
                            <div className="panel-head">
                                <div className="panel-icon"><Sparkles size={14} /></div>
                                <span>AI Engine</span>
                            </div>
                            <div className="panel-line w80"></div>
                            <div className="panel-line w60" style={{ marginTop: 6 }}></div>
                            <div className="panel-line w40" style={{ marginTop: 6 }}></div>
                        </div>
                    </div>

                    <div className="panel-slot p3">
                        <div className="app-panel">
                            <div className="panel-head">
                                <div className="panel-icon"><GraduationCap size={14} /></div>
                                <span>Learning Hub</span>
                            </div>
                            <div className="ring-stat">
                                <TrendingUp size={20} />
                                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700 }}>92%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;