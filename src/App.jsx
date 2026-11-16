import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, CalendarDays, Camera, Clock3, Heart, MapPin, Menu, X } from 'lucide-react';
import { COUPLE, FAQS, RSVP_DEADLINE, RSVP_FORM_URL, VENUE, PHOTO_DROP_URL, WEDDING_ALBUM_URL } from './constants/wedding.js';
import coupleStoryArt from './assets/soham-shraddha-story.jpg';
import finalePhotoOne from './assets/soham.jpg';
import finalePhotoTwo from './assets/shraddha.jpg';
import guestbookPhotoOne from './assets/couple.jpg';
import guestbookPhotoTwo from './assets/propose.jpg';

const MEMORY_MOMENTS = [
  { image: guestbookPhotoOne, alt: 'Soham and Shraddha with friends and family', title: 'A little serendipity', note: 'The tiny moments that led us here.' },
  { image: guestbookPhotoTwo, alt: 'A happy moment from Soham and Shraddha’s celebrations', title: 'All our favourite people', note: 'Every smile, every moment' },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const start = window.innerHeight * 0.9;
        const finish = window.innerHeight * 0.25;
        items.forEach((item) => {
          const progress = Math.min(1, Math.max(0, (start - item.getBoundingClientRect().top) / (start - finish)));
          const direction = item.dataset.reveal === 'left' ? -1 : item.dataset.reveal === 'right' ? 1 : 0;
          item.style.opacity = progress.toFixed(3);
          item.style.setProperty('--reveal-x', `${direction * 120 * (1 - progress)}px`);
          item.style.setProperty('--reveal-y', `${14 * (1 - progress)}px`);
        });
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
}

function useScrollLinkedRail(sectionRef, trackRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return undefined;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = section.offsetHeight - window.innerHeight;
        const progress = range > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range)) : 0;
        const travel = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
        track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
        section.style.setProperty('--gallery-progress', progress);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      track.style.transform = '';
    };
  }, [sectionRef, trackRef]);
}

function Countdown() {
  const target = new Date(COUPLE.countdownDate).getTime();
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, target - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  const units = [[Math.floor(remaining / 86400000), 'DAYS'], [Math.floor(remaining / 3600000) % 24, 'HRS'], [Math.floor(remaining / 60000) % 60, 'MIN'], [Math.floor(remaining / 1000) % 60, 'SEC']];
  return <div className="countdown">{units.map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <a className="wordmark" href="#home"><span className="wordmark-flower">✳</span> S<span className="ampersand">&</span>S <small>27 · 02 · 27</small></a>
    <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'navigation navigation-open' : 'navigation'}><a href="#story" onClick={() => setOpen(false)}>Our story</a><a href="#celebration" onClick={() => setOpen(false)}>The day</a><a href="#memories" onClick={() => setOpen(false)}>Guestbook</a><a className="nav-cta" href="#rsvp" onClick={() => setOpen(false)}>RSVP <ArrowUpRight size={15} /></a></nav>
  </header>;
}

function Flower({ className = '' }) {
  return <svg className={`flower ${className}`} viewBox="0 0 100 100" aria-hidden="true">
    <g fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.4">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => <ellipse key={angle} cx="50" cy="28" rx="9" ry="20" transform={`rotate(${angle} 50 50)`} />)}
    </g>
    <circle cx="50" cy="50" r="6" fill="currentColor" />
  </svg>;
}

function Hero() {
  return <section className="hero" id="home">
    <div className="hero-top"><span>AN INVITATION TO CELEBRATE</span><span>PUNE, INDIA · 2027</span></div>
    <div className="hero-copy"><p className="hero-kicker"><span className="tiny-star">✳</span> TWO FAMILIES, ONE BIG YES</p><h1>Soham <i>&</i><br /><span>Shraddha</span></h1><div className="hero-bottom"><p>Somehow, all our roads<br />led to each other.</p><a href="#story" className="round-arrow" aria-label="Scroll to our story"><ArrowDownRight /></a><span className="hero-date">27<br />FEB<br /><b>2027</b></span></div></div>
    <div className="hero-artwork" aria-label="Wedding invitation illustration">
      <div className="hero-artwork-orbit orbit-one" /><div className="hero-artwork-orbit orbit-two" />
      <div className="hero-blooms hero-blooms-left" aria-hidden="true"><Flower className="bloom-a" /><Flower className="bloom-b" /></div>
      <div className="hero-artwork-center"><small>THE WEDDING CELEBRATION OF</small><p>S <i>&</i> S</p><span>27 FEBRUARY · PUNE</span></div>
      <div className="hero-blooms hero-blooms-right" aria-hidden="true"><Flower className="bloom-a" /><Flower className="bloom-b" /></div>
      <span className="hero-artwork-caption">A LITTLE BIT OF FOREVER</span><div className="hero-artwork-index">EST. <span>2027</span></div>
    </div>
  </section>;
}

function Story() {
  return <section className="story section" id="story"><div className="story-side" data-reveal="left"><p className="eyebrow">A LITTLE BIT OF MAGIC</p><span className="story-star">✳</span><p className="vertical-note">THE BEGINNING OF ALWAYS · EST. 2027</p></div><div className="story-copy" data-reveal="right"><p className="section-index">01 / OUR STORY</p><h2>Two different<br />worlds. <em>One</em><br /><span>beautiful orbit.</span></h2><p className="story-body">It started with a hello, grew into a thousand little moments, and somehow became our favourite story. Now, with our families beside us, we're ready for the next chapter.</p><p className="signature">With all our love, <i>Soham & Shraddha</i></p></div><div className="story-stamp" aria-hidden="true">MADE<br />OF<br /><i>LOVE</i></div></section>;
}

function WeddingDay() {
  return <section className="wedding section" id="celebration"><div className="wedding-heading" data-reveal="left"><p className="section-index">02 / SAVE THE DATE</p><p className="eyebrow">THE DAY WE SAY “I DO”</p><h2>Come for the<br /><em>forever.</em></h2></div><div className="wedding-card" data-reveal="right"><div className="card-top"><span>THE WEDDING OF</span><span>NO. 01 — 01</span></div><p className="card-names">Soham <i>&</i> Shraddha</p><div className="card-rule"><span>✳</span></div><p className="card-date">{COUPLE.dateLabel}</p><div className="card-details"><div><CalendarDays /><span>THE DATE</span><strong>27 February, 2027</strong></div><div><Clock3 /><span>THE MUHURTA</span><strong>12:15 in the afternoon</strong></div><div><MapPin /><span>THE PLACE</span><strong>{VENUE.name}, Pune</strong></div></div><p className="card-address">{VENUE.address}</p><a className="text-link" href={VENUE.mapUrl} target="_blank" rel="noreferrer">FIND YOUR WAY <ArrowUpRight size={14} /></a><div className="card-bottom"><span>JOYFULLY INVITED</span><span>WITH OUR FAMILIES</span></div></div><div className="countdown-wrap" data-reveal="left"><p>THE BIG DAY IS IN</p><Countdown /></div></section>;
}

function Caricatures() {
  return <section className="caricatures"><div className="caricature-intro" data-reveal="left"><p className="section-index">03 / LITTLE PORTRAITS</p><h2>Our love,<br /><em>illustrated.</em></h2><p>One little picture of all the places, small adventures, and big moments that brought us here.</p><span className="doodle-heart">♡</span></div><figure className="couple-art-figure" data-reveal="right"><div className="couple-art-frame"><img src={coupleStoryArt} alt="Illustrated story of Soham and Shraddha, from their first local train rides to becoming life partners" /><span className="couple-art-flower flower-a">✳</span><span className="couple-art-flower flower-b">✿</span><span className="couple-art-heart">♡</span></div><figcaption>OUR STORY, IN A THOUSAND LITTLE MOMENTS</figcaption></figure></section>;
}

function MemoryFeature({ image, alt, title, note, index }) {
  return <figure className={`memory-feature memory-feature-${index + 1}`}>
    <div className={`memory-pic memory-pic-${index + 1}`}><img src={image} alt={alt} /></div>
    <figcaption><span>0{index + 1}</span><h3>{title}</h3><p>{note}</p></figcaption>
  </figure>;
}

function Memories() {
  const albumReady = Boolean(WEDDING_ALBUM_URL);
  return <section className="memories section" id="memories">
    <div className="memories-head" data-reveal="left">
      <div><p className="section-index">04 / OUR PEOPLE, OUR PICTURES</p><h2>Love looks better<br /><em>through your lens.</em></h2></div>
      <p data-reveal="right">Every photo you take, big or small, we'd love to see it.</p>
    </div>
    <div className="memory-features" data-reveal>
      <MemoryFeature {...MEMORY_MOMENTS[0]} index={0} />
      <div className="memory-note"><span>✳</span><p>The best bits<br />are better<br /><i>together.</i></p><small>— THE HAPPY COUPLE</small></div>
      <MemoryFeature {...MEMORY_MOMENTS[1]} index={1} />
    </div>
    <div className="memory-actions" data-reveal="left">
      <div className="upload-copy"><span className="upload-icon"><Camera size={22} /></span><div><h3>Be our unofficial photographer.</h3><p>Drop every picture you take into our shared album. There’s always room for one more memory.</p></div></div>
      <div className="upload-buttons">{PHOTO_DROP_URL ? <a className="button button-accent" href={PHOTO_DROP_URL} target="_blank" rel="noreferrer">UPLOAD TO OUR ALBUM <ArrowUpRight size={16} /></a> : <span className="button button-accent" title="Add a shared upload folder in src/constants/wedding.js">UPLOAD LINK COMING SOON</span>}</div>
    </div>
    <div className="album-link" data-reveal="right"><span>AND WHEN WE GET OUR WEDDING PHOTOS…</span>{albumReady ? <a href={WEDDING_ALBUM_URL} target="_blank" rel="noreferrer">THE WEDDING ALBUM IS HERE <ArrowUpRight size={15} /></a> : <p>We’ll add our wedding album here after the big day. Stay tuned <span>♡</span></p>}</div>
  </section>;
}

function CouplePortrait({ className = '', src, alt }) {
  return <div className={`finale-couple-portrait ${className}`}><div className="finale-couple-frame"><img src={src} alt={alt} /><span className="finale-couple-flower">✿</span><span className="finale-couple-heart">♡</span></div></div>;
}

function ScrollFinale() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  useScrollLinkedRail(sectionRef, trackRef);
  return <section className="scroll-finale" id="forever" ref={sectionRef} aria-label="A little note from Soham and Shraddha"><div className="scroll-finale-sticky"><div className="scroll-finale-top"><span>06 / THE REST OF OUR LIVES</span><span>KEEP SCROLLING TO SEND US OFF <ArrowDownRight size={14} /></span></div><div className="scroll-finale-viewport"><div className="scroll-finale-track" ref={trackRef}><span className="finale-phrase finale-phrase-first">A LITTLE</span><CouplePortrait className="finale-portrait-first" src={finalePhotoOne} alt="Soham and Shraddha together" /><span className="finale-phrase finale-phrase-second">MORE</span><span className="finale-phrase finale-phrase-last">FOREVER</span><CouplePortrait className="finale-portrait-last" src={finalePhotoTwo} alt="Soham and Shraddha celebrating" /><span className="finale-star">✳</span></div><span className="finale-swipe-hint">SWIPE TO EXPLORE <ArrowUpRight size={13} /></span></div><div className="scroll-finale-bottom"><span>MADE OF ALL THE LITTLE THINGS</span><span>SOHAM & SHRADDHA · 27 FEB 2027</span></div></div></section>;
}



function RSVP() {
  return <section className="rsvp section" id="rsvp"><div className="rsvp-sparkle">✳</div><p className="section-index">05 / SAVE US A SPOT?</p><p className="eyebrow">WE REALLY HOPE YOU CAN MAKE IT</p><h2>So, <em>you in?</em></h2><p className="rsvp-copy">Your presence is our favourite present.<br />Let us know by {RSVP_DEADLINE}.</p><a className="button button-light" href={RSVP_FORM_URL} target="_blank" rel="noreferrer">YES, I'LL BE THERE <ArrowUpRight size={16} /></a><div className="rsvp-footer"><span>SEE YOU THERE</span><span>SOHAM & SHRADDHA <Heart size={13} fill="currentColor" /></span></div></section>;
}

function FAQs() {
  return <section className="faqs section"><div><p className="section-index">A FEW HELPFUL THINGS</p><h2>Before you<br /><em>head our way.</em></h2></div><div className="faq-list">{FAQS.map(({ question, answer }, index) => <details key={question}><summary><span>0{index + 1}</span>{question}<ArrowDownRight /></summary><p>{answer}</p></details>)}</div></section>;
}

function App() {
  useReveal();
  return <><Header /><main><Hero /><div className="scroll-stack story-day-stack"><Story /><div className="story-hold-space" aria-hidden="true" /><WeddingDay /></div><Caricatures /><div className="scroll-stack memories-rsvp-stack"><Memories /><RSVP /></div><FAQs /><ScrollFinale /><footer className="closing"><span className="closing-flower">✳</span><p>COUNTING DOWN THE DAYS</p><h2>Until then, <i>with love.</i></h2><div><span>SOHAM & SHRADDHA</span><span>27 · 02 · 27</span></div></footer></main></>;
}

export default App;
