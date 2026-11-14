import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, CalendarDays, ChevronDown, Clock3, MapPin, Menu, X } from 'lucide-react';
import { COUPLE, EVENTS, FAQS, RSVP_DEADLINE, RSVP_FORM_URL, VENUE } from './constants/wedding.js';
import logo from './assets/logo.jpg';

// \uFE0E forces the plain-text star so iOS doesn't swap in a green emoji
const STAR = '\u2733\uFE0E';

function LogoPlaceholder() {
  return <a className="logo" href="#home" aria-label="Wedding home"><img src={logo} alt="Wedding Logo" /></a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['Wedding', '#wedding'], ['Venue', '#venue'], ['FAQs', '#faqs']];

  return <header className="site-header">
    <LogoPlaceholder />
    <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <X size={19} /> : <Menu size={19} />}
    </button>
    <nav className={menuOpen ? 'navigation navigation-open' : 'navigation'} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      <a className="nav-rsvp" href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP <ArrowUpRight size={14} /></a>
    </nav>
    <a className="header-rsvp" href="#rsvp">RSVP <ArrowUpRight size={14} /></a>
  </header>;
}

function Countdown() {
  const target = new Date(COUPLE.countdownDate).getTime();
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const units = [
    [Math.floor(remaining / 86400000), 'DAYS'],
    [Math.floor(remaining / 3600000) % 24, 'HOURS'],
    [Math.floor(remaining / 60000) % 60, 'MINUTES'],
    [Math.floor(remaining / 1000) % 60, 'SECONDS'],
  ];

  return <div className="countdown" aria-label="Countdown to the wedding">
    {units.map(([value, label]) => <div className="countdown-unit" key={label}>
      <strong>{String(value).padStart(2, '0')}</strong><span>{label}</span>
    </div>)}
  </div>;
}

function Hero() {
  return <section className="hero" id="home">
    <p className="devotional">॥ श्री गणेशाय नमः ॥</p>
    <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>
    <h1>{COUPLE.groom}<span>&</span>{COUPLE.bride}</h1>
    <p className="hero-note">Two hearts, one beautiful beginning.</p>
    <div className="date-line"><span>{COUPLE.dateLabel}</span><i /></div>
    <p className="hero-place">PUNE, MAHARASHTRA</p>
    <a className="button button-gold" href="#wedding">Wedding details <ArrowDown size={15} /></a>
    <div className="hero-countdown"><p>COUNTING DOWN TO OUR DAY</p><Countdown /></div>
  </section>;
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return <div className="section-heading">
    <p className="eyebrow">{eyebrow}</p><h2>{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
    <span className="heading-rule" aria-hidden="true" />
  </div>;
}

function Wedding() {
  const event = EVENTS[0];
  return <section className="wedding-event section" id="wedding">
    <SectionHeading eyebrow="OUR SPECIAL DAY" title="The wedding" subtitle="One beautiful celebration, shared with the people we love." />
    <article className="event wedding-event-card">
      <p className="event-date">{event?.date ?? COUPLE.dateLabel}</p>
      <h3>{event?.title ?? 'Wedding Ceremony'}</h3>
      {event?.time && <p className="event-time"><Clock3 size={14} />{event.time}</p>}
      {event?.description && <p className="event-description">{event.description}</p>}
      <p className="event-place"><MapPin size={14} /><a href={VENUE.mapUrl} target="_blank" rel="noreferrer">{VENUE.name}</a></p>
    </article>
  </section>;
}

function Venue() {
  return <section className="venue section" id="venue">
    <div className="venue-intro">
      <p className="eyebrow">WHERE TO BE</p>
      <h2>Our celebration<br />in <em>Pune</em></h2>
      <p className="venue-copy">We look forward to welcoming you to our wedding celebration.</p>
      <a className="text-link" href={VENUE.mapUrl} target="_blank" rel="noreferrer">View on map <ArrowUpRight size={15} /></a>
    </div>
    <div className="venue-details">
      <span className="venue-mark" aria-hidden="true">{STAR}</span>
      <p className="eyebrow">WEDDING DAY</p>
      <h3><a className="venue-name-link" href={VENUE.mapUrl} target="_blank" rel="noreferrer">{VENUE.name}</a></h3>
      <p>{VENUE.address}</p>
      <div className="detail-divider" />
      <p className="detail-label"><CalendarDays size={14} />{COUPLE.date}</p>
      <p className="detail-label"><Clock3 size={14} />Muhurta at {COUPLE.muhurta}</p>
    </div>
  </section>;
}

function RSVP() {
  return <section className="rsvp section" id="rsvp">
    <p className="eyebrow">KINDLY REPLY</p>
    <h2>Will you join us?</h2>
    <p>Having you with us will make our day even more special.<br />Please reply by {RSVP_DEADLINE}.</p>
    <a className="button button-dark" href={RSVP_FORM_URL} target="_blank" rel="noreferrer">Open RSVP form <ArrowUpRight size={15} /></a>
    <small>We truly look forward to seeing you at the wedding and celebrating together!</small>
  </section>;
}

function FAQs() {
  const [active, setActive] = useState(0);
  return <section className="faqs section" id="faqs">
    <div className="faq-intro"><p className="eyebrow">NEED TO KNOW</p><h2>A few details</h2><p>We hope this helps you plan for the day.</p></div>
    <div className="faq-list">{FAQS.map(({ question, answer }, index) => <article className="faq-item" key={question}>
      <button aria-expanded={active === index} onClick={() => setActive(active === index ? -1 : index)}>
        <span>{question}</span><ChevronDown size={16} />
      </button>
      {active === index && <p className="faq-answer">{answer}</p>}
    </article>)}</div>
  </section>;
}

function App() {
  return <>
    <Header />
    <main>
      <Hero />
      <Wedding />
      <Venue />
      <RSVP />
      <FAQs />
      <section className="closing">
        <span className="closing-flower" aria-hidden="true">{STAR}</span>
        <p className="eyebrow">WITH LOVE</p>
        <h2>We can’t wait to celebrate with you.</h2>
        <p>{COUPLE.groom} & {COUPLE.bride}</p>
      </section>
    </main>
    <footer className="footer"><LogoPlaceholder /><span>{COUPLE.groom} & {COUPLE.bride} · {COUPLE.date}</span></footer>
  </>;
}

export default App;
