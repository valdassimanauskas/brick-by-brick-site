import { facts, projects, steps, pillars, reviews, asset } from "../data.js";

export function Promise() {
  return (
    <section className="promise" id="promise" data-theme="light">
      <div className="wrap grid">
        <h2 className="reveal">We don't sell construction. We sell certainty.</h2>
        <div className="reveal">
          <p>Building is stressful when you can't see what's coming. So we take the surprises out of it: a fixed, itemised price before we break ground, in-house design so you see the building before it exists, and one site manager who answers the phone every week until you have the keys.</p>
          <ul className="facts">{facts.map((f) => <li key={f.n}><strong>{f.n}</strong><span>{f.label}</span></li>)}</ul>
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section className="projects" id="projects" data-theme="light">
      <div className="wrap">
        <header className="sec-head">
          <h2 className="reveal">A look at what we've built</h2>
          <p>The kinds of projects we take on, from a single addition to a full distribution facility.</p>
        </header>
        <div className="proj-grid">
          {projects.map((p) => (
            <a className="proj" href="#contact" key={p.title}>
              <img src={asset(`svc-${p.img}.webp`)} alt={p.alt} loading="lazy" />
              <span><strong>{p.title}</strong>{p.meta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="process" id="process" data-theme="dark">
      <div className="wrap">
        <header className="sec-head">
          <h2 className="reveal">Here's how we make building easy</h2>
          <p>Four steps. You always know which one you're on and what happens next.</p>
        </header>
        <ol className="steps">
          {steps.map((s, i) => <li key={s.title}><span className="num">{i + 1}</span><h3>{s.title}</h3><p>{s.desc}</p></li>)}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="about" id="about" data-theme="light">
      <div className="wrap grid">
        <div>
          <h2 className="reveal">Building Lemont since 2004</h2>
          <p>Brick by Brick Group started as a two-man masonry crew. Twenty years on we're a full general contractor with our own masons, carpenters and site managers, and we still lay the brick ourselves. We build homes for families who plan to stay and buildings for businesses that need to open on a date. Both get the same crews and the same standard.</p>
          <p>We're licensed, bonded and insured, and we put our license number on everything we sign.</p>
        </div>
        <ul className="pillars">{pillars.map((p) => <li key={p.title}><h3>{p.title}</h3><p>{p.desc}</p></li>)}</ul>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="reviews" id="reviews" data-theme="light">
      <div className="wrap">
        <header className="sec-head">
          <h2 className="reveal">Don't take our word for it. Take theirs.</h2>
          <p>5.0 on Google from 120+ reviews. A+ with the Better Business Bureau.</p>
        </header>
        <div className="quotes">
          {reviews.map((r) => <blockquote key={r.who}><p>"{r.quote}"</p><cite>{r.who}</cite></blockquote>)}
        </div>
      </div>
    </section>
  );
}
