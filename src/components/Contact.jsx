import { useState } from "react";
import { company, projectTypes } from "../data.js";
import Logo from "./Logo.jsx";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState(projectTypes[0]);
  return (
    <section className="contact" id="contact" data-theme="dark">
      <div className="wrap grid">
        <div>
          <h2 className="reveal">Tell us what you're building</h2>
          <p>Send a few lines about the project and where it is. We reply within one business day, usually to set up a site visit.</p>
          <ul className="direct">
            <li><span>Phone</span><a href={company.phoneHref}>{company.phone}</a></li>
            <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><span>Office</span><span>{company.office}</span></li>
            <li><span>Serving</span><span>{company.serving}</span></li>
          </ul>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label>Name<input type="text" name="name" required autoComplete="name" placeholder="Your name" /></label>
          <label>Phone<input type="tel" name="phone" autoComplete="tel" placeholder="(630) 000-0000" /></label>
          <label className="full">Email<input type="email" name="email" required autoComplete="email" placeholder="you@example.com" /></label>
          <fieldset className="full chips">
            <legend>Project type</legend>
            {projectTypes.map((t) => (
              <label key={t}><input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} /><span>{t}</span></label>
            ))}
          </fieldset>
          <label className="full">About the project<textarea name="message" placeholder="Where it is, what it is, and when you'd like to start." /></label>
          <button className="brick-btn" type="submit" disabled={sent}>{sent ? "Sent. We reply within one business day." : "Send request"}</button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="brand"><Logo /><span>{company.legal}</span></div>
      <span>Licensed general contractor. {company.license}. Bonded and insured.</span>
    </footer>
  );
}
