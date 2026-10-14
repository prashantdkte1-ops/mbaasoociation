import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Flag,
  Search,
  CalendarDays,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
const clubs = [
  {
    name: 'NEXUS',
    discipline: 'Human Resources',
    short: 'HR CLUB',
    desc: 'People, culture, talent and workplace learning.',
    color: 'blue',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'VERTEX',
    discipline: 'Finance',
    short: 'FINANCE CLUB',
    desc: 'Financial literacy, analysis and decision-making.',
    color: 'green',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'PULSE',
    discipline: 'Marketing',
    short: 'MARKETING CLUB',
    desc: 'Brand strategy, consumer insights and campaigns.',
    color: 'gold',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80',
  },
];
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-photo"></div>
        <div className="hero-copy">
          <p className="eyebrow">DKTE · MBA DEPARTMENT</p>
          <h1>
            Learn.
            <br />
            Participate.
            <br />
            Lead.
            <br />
            <em>Grow.</em>
          </h1>
          <p className="hero-desc">
            A student-driven professional ecosystem that turns classroom
            knowledge into practical experience, leadership and professional
            growth.
          </p>
          <div className="hero-actions">
            <a className="btn btn-gold" href="#association">
              Explore association
            </a>
            <Link className="btn btn-ghost" to="/clubs">
              Meet our clubs
            </Link>
          </div>
        </div>
        <div className="hero-aside">
          <p className="eyebrow">THREE CLUBS, ONE ASSOCIATION</p>
          {clubs.map((c) => (
            <div className="hero-club" key={c.name}>
              <span className={`club-dot ${c.color}`}></span>
              <div>
                <strong>{c.name}</strong>
                <small>{c.discipline}</small>
              </div>
              <ArrowRight size={17} />
            </div>
          ))}
          <div className="hero-stats">
            <div>
              <b>3</b>
              <small>Clubs</small>
            </div>
            <div>
              <b>1</b>
              <small>Association</small>
            </div>
            <div>
              <b>∞</b>
              <small>Possibilities</small>
            </div>
          </div>
        </div>
      </section>
      <section id="association" className="section">
        <div className="section-intro">
          <p className="eyebrow">THE ASSOCIATION</p>
          <h2>
            More than a club.
            <br />
            <em>A professional ecosystem.</em>
          </h2>
          <p>
            Students gain opportunities to learn, contribute, lead and grow
            through discipline-focused clubs, workshops, competitions and
            cross-club projects.
          </p>
        </div>
        <div className="steps">
          {[
            [
              BookOpen,
              '01',
              'Learn',
              'Build practical knowledge beyond the classroom.',
            ],
            [
              Users,
              '02',
              'Participate',
              'Contribute to projects and club activities.',
            ],
            [Flag, '03', 'Lead', 'Take responsibility for outcomes and teams.'],
            [
              TrendingUp,
              '04',
              'Grow',
              'Develop confidence and professional capability.',
            ],
          ].map(([Icon, n, t, d]) => (
            <article className="step-card" key={n}>
              <span>{n}</span>
              <Icon />
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-soft">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR CLUBS</p>
            <h2>Find your professional edge.</h2>
          </div>
          <Link to="/clubs" className="text-link">
            Explore all clubs <ArrowRight size={16} />
          </Link>
        </div>
        <div className="club-grid">
          {clubs.map((c) => (
            <article className="club-card" key={c.name}>
              <img src={c.image} alt={`${c.discipline} club`} loading="lazy" />
              <div className="club-card-body">
                <span className={`club-tag ${c.color}`}>{c.short}</span>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <Link
                  to={`/clubs/${c.name.toLowerCase()}`}
                  className="text-link"
                >
                  Discover club <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cta">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2>
          Make your MBA
          <br />
          more than a degree.
        </h2>
        <p>
          Participate in initiatives that build real skills, meaningful
          connections and leadership experience.
        </p>
        <Link to="/membership" className="btn btn-gold">
          Membership information <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
export function Clubs() {
  const [data, setData] = useState(clubs);
  useEffect(() => {
    if (isSupabaseConfigured)
      supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .then(({ data }) => {
          if (data?.length)
            setData(
              data.map((c) => ({
                ...c,
                discipline: c.discipline || '',
                desc: c.description || '',
                image: c.cover_image_path
                  ? supabase.storage
                      .from('club-images')
                      .getPublicUrl(c.cover_image_path).data.publicUrl
                  : '',
              }))
            );
        });
  }, []);
  return (
    <Page
      title="Our professional clubs"
      kicker="THREE DISCIPLINES · ONE COMMUNITY"
      intro="Specialised student communities to turn management concepts into practical experience."
    >
      {data.map((c) => (
        <article className="list-card" key={c.id || c.name}>
          <div className="list-icon">{c.name?.slice(0, 1) || 'C'}</div>
          <div>
            <h3>{c.name}</h3>
            <p>{c.discipline}</p>
            <p>{c.desc || c.description}</p>
          </div>
          <Link to={`/clubs/${c.slug || c.name.toLowerCase()}`}>
            View club <ArrowRight size={15} />
          </Link>
        </article>
      ))}
    </Page>
  );
}
export function ClubDetail() {
  return (
    <Page
      title="Club profile"
      kicker="OUR CLUBS"
      intro="Club profile information will be shown here once the club is selected from the database."
    />
  );
}
export function Leadership() {
  const [members, setMembers] = useState([]),
    [search, setSearch] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Connect Supabase to load verified leadership profiles.');
      return;
    }
    supabase
      .from('members')
      .select(
        'id,full_name,designation,photo_path,bio,clubs(name),academic_years(label)'
      )
      .eq('is_published', true)
      .eq('is_active', true)
      .order('display_order')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setMembers(data || []);
      });
  }, []);
  const filtered = members.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Page
      title="Meet our leadership"
      kicker="PEOPLE BEHIND THE PROGRESS"
      intro="Discover the students who help coordinate our professional clubs and association initiatives."
    >
      <div className="searchbar">
        <Search />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by member name"
        />
      </div>
      {error && <p className="notice">{error}</p>}
      <div className="member-grid">
        {filtered.map((m) => (
          <article className="member-card" key={m.id}>
            <img
              src={
                m.photo_path
                  ? supabase.storage
                      .from('member-photos')
                      .getPublicUrl(m.photo_path).data.publicUrl
                  : ''
              }
              alt=""
              onError={(e) =>
                (e.currentTarget.src =
                  'https://placehold.co/240x240/f0f3f7/123b6d?text=Profile')
              }
            />
            <div>
              <h3>{m.full_name}</h3>
              <span>{m.designation}</span>
              <p>
                {m.clubs?.name || 'Association'} ·{' '}
                {m.academic_years?.label || ''}
              </p>
              {m.bio && <small>{m.bio}</small>}
            </div>
          </article>
        ))}
      </div>
      {!members.length && !error && <p>No published profiles yet.</p>}
    </Page>
  );
}
export function Activities() {
  return (
    <Page
      title="Activities & events"
      kicker="LEARN BY DOING"
      intro="Workshops, competitions, simulations and collaborative initiatives create opportunities to put management learning into practice."
    />
  );
}
export function Membership() {
  return (
    <Page
      title="Become part of the community"
      kicker="MEMBERSHIP"
      intro="Membership eligibility, benefits and contributions should be confirmed by the Association and College before publication."
    >
      <div className="info-panel">
        <h3>Membership information</h3>
        <p>
          General membership fee: ₹150 (draft content, pending official
          approval).
        </p>
        <p>
          Office-bearer contribution: ₹500 (draft content, pending official
          approval).
        </p>
        <p>Contact the MBA Department for the approved joining process.</p>
      </div>
    </Page>
  );
}
export function Rules() {
  return (
    <Page
      title="Rules & governance"
      kicker="OUR SHARED RESPONSIBILITY"
      intro="Members are expected to follow college and department rules, maintain professional conduct, use Association resources responsibly, and protect confidential information."
    />
  );
}
export function Contact() {
  return (
    <Page
      title="Contact the Association"
      kicker="GET IN TOUCH"
      intro="For verified contact details, please contact the MBA Department of DKTE College. Replace demo contact details before launching publicly."
    />
  );
}
export function Privacy() {
  return (
    <Page
      title="Privacy notice"
      kicker="YOUR INFORMATION"
      intro="Only approved profile details should be published. Personal phone numbers and email addresses remain private unless a member explicitly consents. Members can request correction or removal through the Association administrator."
    />
  );
}
export function NotFound() {
  return (
    <Page
      title="Page not found"
      kicker="404"
      intro="We couldn't find that page. Return to the homepage to continue exploring."
    />
  );
}
function Page({ title, kicker, intro, children }) {
  return (
    <main className="page-shell">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p className="page-intro">{intro}</p>
      <div className="page-content">{children}</div>
    </main>
  );
}
