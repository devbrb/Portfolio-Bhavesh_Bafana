import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { AWARDS, CLIENT_PROJECTS, JOBS, PERSONAL_PROJECTS, PROFILE, SKILLS, type Project } from "./data/data";
import { startSwarm } from "./swarm/engine";

/* ---------- career timeline maths: everything is derived from the "YYYY-MM" dates in data.ts ---------- */
const month = (s: string) => { const [y, m] = s.split("-").map(Number); return y * 12 + m - 1; };
const today = new Date();
const NOW = today.getFullYear() * 12 + today.getMonth();
const START = 2022 * 12, END = NOW + 3;
const pct = (v: number) => ((v - START) / (END - START)) * 100;
const endOf = (to?: string) => (to ? month(to) + 1 : NOW); // past roles count their last month
const duration = (from: string, to?: string) => {
  const n = Math.max(1, endOf(to) - month(from)), y = Math.floor(n / 12), m = n % 12;
  return [y && `${y} ${y > 1 ? "yrs" : "yr"}`, m && `${m} ${m > 1 ? "mos" : "mo"}`].filter(Boolean).join(" ");
};
const fmt = (s?: string) => (s ? new Date(month(s) / 12 | 0, month(s) % 12).toLocaleString("en", { month: "short", year: "numeric" }) : "Present");
const years = Array.from({ length: today.getFullYear() - 2021 }, (_, i) => 2022 + i);

function ProjectCard({ p, n }: { p: Project; n: number }) {
  const num = String(n).padStart(2, "0");
  return (
    <article className="proj" data-b="frame" data-name={`Card · ${num}`}>
      <span className="num" data-b="type" data-name="Index">{num}</span>
      <h3 data-b="type" data-name="Title">{p.title}</h3>
      {p.org && <p className="org" data-b="box" data-name="Org">{p.org}</p>}
      <p data-b="reveal" data-name="Copy">{p.copy}</p>
      {p.video && <div className="video" data-b="box" data-name="Preview">▶ HOVER TO PLAY</div>}
      <div className="tags" data-b="box" data-name="Tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
      {p.links && (
        <div className="plinks" data-b="box" data-name="Links">
          {p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>)}
        </div>
      )}
    </article>
  );
}

function CopyEmail() {
  const [label, setLabel] = useState("Copy email");
  const copy = () => {
    const done = (t: string) => { setLabel(t); setTimeout(() => setLabel("Copy email"), 1600); };
    navigator.clipboard.writeText(PROFILE.email).then(() => done("Copied ✓"), () => {
      const el = document.getElementById("email");
      if (el) getSelection()?.selectAllChildren(el);
      done("Selected · Ctrl+C");
    });
  };
  return <button className="btn pri" type="button" onClick={copy}>{label}</button>;
}

export default function App() {
  useEffect(() => startSwarm(), []);

  return (
    <>
      <div id="boot" aria-hidden="true">
        <div className="ring" id="ring"><span className="mark">B</span></div>
        <p>ASSEMBLING THE CREW <b id="bootN">0</b>/8</p>
      </div>

      <div id="page">
        <div id="layer" aria-hidden="true" />

        <section className="hero gut" data-sec="Hero">
          <nav className="nav gut" data-b="region" data-name="Header">
            <a className="logo" href="#" data-b="box" data-name="Logo"><i>B</i>{PROFILE.first} {PROFILE.last}</a>
            <div className="pill" data-b="box" data-name="Nav">
              <a href="#about">About</a><a href="#exp">Experience</a><a href="#projects">Projects</a>
              <a href="#personal">Personal</a><a href="#awards">Awards</a><a href="#contact">Contact</a>
            </div>
            <a className="navcta" href={PROFILE.resume} target="_blank" rel="noopener" data-b="box" data-name="Resume">Resume ↗</a>
          </nav>

          <h2 className="giant" data-b="reveal" data-name="Display" aria-hidden="true">Portfolio</h2>

          <div className="photo" data-b="reveal" data-name="Portrait">
            <img src="/profile-img.webp" alt={`${PROFILE.first} ${PROFILE.last}`} fetchPriority="high" />
          </div>

          <div className="intro" data-b="region" data-name="Hero · Intro">
            <p className="hello" data-b="type" data-name="Hello">Hi, I'm</p>
            <h1 className="name" data-b="type" data-name="Title">{PROFILE.first}</h1>
            <p className="name" data-b="type" data-name="Title" aria-hidden="true">{PROFILE.last}</p>
            <p className="role" data-b="type" data-name="Role">{PROFILE.role}</p>
            <p className="desc" data-b="reveal" data-name="Copy">{PROFILE.summary}</p>
            <div className="ctas" data-b="box" data-name="CTA">
              <a className="btn pri" href="#projects">View Projects →</a><a className="btn" href="#contact">Contact Me</a>
            </div>
          </div>
        </section>

        <div className="gut"><div className="wrap">

          <section className="sec" id="about" data-sec="About">
            <div className="sec-head" data-b="region" data-name="About · Header">
              <h2 className="big"><span data-b="type" data-name="Title">About</span><span className="l2" data-b="type" data-name="Title">Me</span></h2>
            </div>
            <div className="about">
              <div className="about-text" data-b="region" data-name="About · Copy">
                <p data-b="reveal" data-name="Copy">Frontend Developer with <b>4.5+ years</b> of experience building scalable, high-performance <b>React and Next.js</b> applications for enterprise clients including <b>Verizon, Honeywell and Mastercard</b>.</p>
                <p data-b="reveal" data-name="Copy">Strong in <b>Redux state management</b>, <b>performance optimization</b> and <b>reusable component architecture</b>, with experience migrating legacy applications to modern React. Comfortable owning features end to end, from requirements and API integration to production delivery, in Agile teams.</p>
                <div className="edu" data-b="box" data-name="Education">
                  <p className="lbl">Education</p><b>{PROFILE.education.degree}</b>
                  <span>{PROFILE.education.school} · {PROFILE.education.year}</span>
                </div>
                <div data-b="box" data-name="Resume"><a className="btn pri" href={PROFILE.resume} target="_blank" rel="noopener">Get Resume ↗</a></div>
              </div>
              <div className="skills">
                {SKILLS.map((g) => (
                  <div className="group" data-b="box" data-name={`Skills · ${g.group}`} key={g.group}>
                    <h3>{g.group}</h3>
                    <div className="chips">{g.items.map((s) => <span key={s}>{s}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="sec" id="exp" data-sec="Experience">
            <div className="sec-head" data-b="region" data-name="Exp · Header">
              <h2 className="big"><span data-b="type" data-name="Title">Work</span><span className="l2" data-b="type" data-name="Title">Experience</span></h2>
            </div>
            <div className="track" data-b="box" data-name="Timeline">
              <div className="rail">
                {JOBS.map((j) => (
                  <i key={j.company} className={`seg ${j.to ? "past" : "now"}`}
                    style={{ left: `${pct(month(j.from))}%`, width: `${pct(endOf(j.to)) - pct(month(j.from))}%` }}>
                    <span>{j.short}</span>
                  </i>
                ))}
                <b className="nowdot" style={{ left: `${pct(NOW)}%` }}><em>Now</em></b>
              </div>
              <div className="ticks">{years.map((y) => <span key={y} style={{ left: `${pct(y * 12)}%` }}>{y}</span>)}</div>
            </div>
            <div className="jobs">
              {JOBS.map((j) => (
                <article key={j.company} className={`jobcard${j.to ? "" : " current"}`} data-b="frame" data-name={`${j.short} · ${j.to ? "Previous" : "Current"}`}>
                  <div className="head">
                    <span className={`tile${j.to ? "" : " now"}`} data-b="box" data-name="Logo">{j.tile}</span>
                    <div>
                      <p className={`badge${j.to ? "" : " live"}`} data-b="box" data-name="Status">{j.to ? "Previous" : "Current"}</p>
                      <h3 data-b="type" data-name="Company">{j.company}</h3>
                    </div>
                  </div>
                  <p className="jrole" data-b="box" data-name="Role">{j.role}<span>{fmt(j.from)} – {fmt(j.to)} · <b>{duration(j.from, j.to)}</b></span></p>
                  <p className="jsum" data-b="reveal" data-name="Summary">{j.summary}</p>
                  <div data-b="box" data-name="Projects">
                    <p className="lbl">{j.projects.length > 1 ? "Projects" : "Project"}</p>
                    <div className="pchips">{j.projects.map((p) => <a key={p} href="#projects">{p}</a>)}</div>
                  </div>
                  {j.awards && (
                    <div data-b="box" data-name="Awards">
                      <p className="lbl">Recognition</p>
                      <div className="pchips">{j.awards.map((a) => <span key={a}>★ {a}</span>)}</div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="sec" id="projects" data-sec="Projects">
            <div className="sec-head" data-b="region" data-name="Projects · Header">
              <h2 className="big"><span className="l2" data-b="type" data-name="Title">Projects</span></h2>
            </div>
            <div className="projects">{CLIENT_PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} n={i + 1} />)}</div>
          </section>

          <section className="sec" id="personal" data-sec="Personal Projects">
            <div className="sec-head" data-b="region" data-name="Personal Projects · Header">
              <h2 className="big"><span data-b="type" data-name="Title">Personal</span><span className="l2" data-b="type" data-name="Title">Projects</span></h2>
            </div>
            <div className="projects">{PERSONAL_PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} n={i + 1} />)}</div>
          </section>

          <section className="sec" id="awards" data-sec="Awards">
            <div className="sec-head" data-b="region" data-name="Awards · Header">
              <h2 className="big"><span data-b="type" data-name="Title">Awards</span></h2>
            </div>
            <div className="awards">
              {AWARDS.map((a) => <div className="award" data-b="box" data-name="Award" key={a}><h4>{a}</h4><p>TCS</p></div>)}
            </div>
          </section>

          <section className="contact" id="contact" data-sec="Contact">
            <h2 className="big"><span data-b="type" data-name="Title">Contact</span><span className="l2" data-b="type" data-name="Title">Me</span></h2>
            <div className="mailrow" data-b="box" data-name="Actions">
              <span className="email" id="email">{PROFILE.email}</span>
              <CopyEmail />
              <span className="email">{PROFILE.phone}</span>
              <a className="btn" href={PROFILE.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
            </div>
          </section>

          <footer><span>© {today.getFullYear()} {PROFILE.first} {PROFILE.last}</span><span>Built with React • TypeScript • SCSS</span></footer>
        </div></div>
      </div>

      <div className="you" id="you" aria-hidden="true"><span>You</span></div>
      <Analytics />
    </>
  );
}
