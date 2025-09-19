
import styles from './Header.module.css';
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import logo from '../../assets/images/raifutilogo.png';


export default function Header() {
  const location = useLocation();
  const [showNav, setShowNav] = useState(true);

  // Map nav items to their routes
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu', scrollTo: 'ourMenu' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <div className={`${styles.logoContainer} ${!showNav ? styles.hideNav : ''}`}>
            <img src={logo} alt="Raifuti Meta Corner Logo" className={styles.logoImg} />
          </div>
        </div>
        <div className={styles.navCenter}>
          <div className={`${styles.navItems} ${!showNav ? styles.hideNav : ''}`}>
            {navItems.map((item) => {
              // Map nav label to scroll target id
              const scrollTargets = {
                'Menu': 'menu',
                'About Us': 'about',
                'Contact': 'contact',
              };
              if (scrollTargets[item.label]) {
                return location.pathname === '/' ? (
                  <ScrollLink 
                    key={item.label}
                    to={scrollTargets[item.label]}
                    smooth={true}
                    duration={100}
                    className={styles.navButton}
                  >
                    <span className={styles.navButtonText}>{item.label}</span>
                  </ScrollLink>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={styles.navButton}
                  >
                    <span className={styles.navButtonText}>{item.label}</span>
                  </Link>
                );
              }
              // Default case (Home)
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`${styles.navButton} ${location.pathname === item.path ? styles.active : ''}`}
                >
                  <span className={styles.navButtonText}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className={`${styles.searchContainer} ${!showNav ? styles.hideNav : ''}`}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input type="text" className={styles.searchBar} placeholder="Search..." />
        </div>
      </nav>
    </header>
  );
}