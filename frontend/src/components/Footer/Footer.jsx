import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo">Amrutam</div>
        <div className="footer__links">
          <a href="/about" className="footer__link">About Us</a>
          <a href="/contact" className="footer__link">Contact</a>
          <a href="/privacy" className="footer__link">Privacy Policy</a>
          <a href="/terms" className="footer__link">Terms of Service</a>
        </div>
        <div className="footer__socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">Instagram</a>
        </div>
      </div>
      <div className="footer__bottom">
        &copy; {new Date().getFullYear()} Amrutam. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
