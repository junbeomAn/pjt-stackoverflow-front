import React from 'react';
import { Icon } from 'semantic-ui-react';

const Footer = () => (
  <footer className="footer">
      <div className="footer-nav">
        <ul>
          <li>About us</li>
          <li>Blog</li>
          <li>Github</li>
        </ul>
        <ul>
          <li><Icon name="github" size="large" className="github" /></li>
          <li><Icon name="ethereum" size="large" className="ethereum"/></li>
        </ul>
      </div>
      <p>Copyright &copy; 2019 All rights reserved, <span>DSU</span></p>
    </footer>
)

export default Footer;