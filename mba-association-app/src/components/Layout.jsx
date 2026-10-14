import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
const nav = [
  ['Association', '#association'],
  ['Clubs', '/clubs'],
  ['Leadership', '/leadership'],
  ['Activities', '/activities'],
  ['Membership', '/membership'],
  ['Rules', '/rules'],
];
export function PublicLayout() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">M</span>
          <span>
            MBA PROFESSIONAL
            <br />
            CLUBS ASSOCIATION
          </span>
        </Link>
        <nav className="desktop-nav">
          {nav.map(([n, to]) => (
            <a
              key={n}
              href={to.startsWith('#') ? to : undefined}
              onClick={
                to.startsWith('/')
                  ? (e) => {
                      e.preventDefault();
                      location.href = to;
                    }
                  : undefined
              }
            >
              {n}
            </a>
          ))}
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && (
        <div className="mobile-nav">
          {nav.map(([n, to]) => (
            <a key={n} href={to} onClick={() => setOpen(false)}>
              {n}
            </a>
          ))}
        </div>
      )}
      <Outlet />
      <footer className="footer">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">M</span>
            <span>
              MBA PROFESSIONAL
              <br />
              CLUBS ASSOCIATION
            </span>
          </div>
          <p>Learn. Participate. Lead. Grow.</p>
        </div>
        <div>
          <strong>Professional clubs</strong>
          <p>NEXUS · HR</p>
          <p>VERTEX · Finance</p>
          <p>PULSE · Marketing</p>
        </div>
        <div>
          <strong>DKTE College</strong>
          <p>MBA Department</p>
          <a href="mailto:association@example.edu">
            Contact Association <ArrowUpRight size={14} />
          </a>
        </div>
        <small>
          © {new Date().getFullYear()} MBA Professional Clubs Association.
          Replace demo contact details before launch.
        </small>
      </footer>
    </>
  );
}
export function AdminLayout({ onSignOut }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="brand">
          <span className="brand-mark">M</span>
          <span>
            ASSOCIATION
            <br />
            ADMIN
          </span>
        </Link>
        <p className="side-label">WORKSPACE</p>
        {[
          ['Overview', '/admin'],
          ['Members', '/admin/members'],
          ['Clubs', '/admin/clubs'],
          ['Events', '/admin/events'],
          ['Content & announcements', '/admin/content'],
          ['Settings', '/admin/settings'],
        ].map(([n, p]) => (
          <NavLink end={p === '/admin'} key={p} to={p}>
            {n}
          </NavLink>
        ))}
        <button className="btn btn-outline side-logout" onClick={onSignOut}>
          Sign out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
