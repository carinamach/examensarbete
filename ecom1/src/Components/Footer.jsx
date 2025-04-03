import React from 'react';
import './styles/style.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
        <ul className="footer-links">

          <li><Link to="/" className="nav-link">Hem</Link></li>
          <li><Link to="/about-us" className="nav-link">Om oss</Link></li>
          <li><Link to="/products" className="nav-link">Produkter</Link></li>
        </ul>
  
        <div className="social-icons">
          <Link to="#"><i className="fab fa-facebook-f"></i></Link>
          <Link to="#"><i className="fab fa-instagram"></i></Link>
          <Link to="#"><i className="fab fa-twitter"></i></Link>
        </div>
  
        <p className="copyright">© 2025 Happy Scribbles. Alla rättigheter förbehållna.</p>
      </footer>
    );
};

export default Footer;
