import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="footerWrapper">
        <div className="footerTile footerSocial">
          <ul className="socialIcons">
            <li>
              <a
                href="https://github.com/brianbixby"
                rel="noopener noreferrer"
                target="_blank"
                title="Github"
              >
                <span className="githubSpan"></span>{' '}
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/brianbixby1/"
                rel="noopener noreferrer"
                target="_blank"
                title="Linkedin"
              >
                <span className="linkedinSpan"></span>
              </a>
            </li>
          </ul>
        </div>
        <a
          className="creator"
          href="https://intense-spire-62825.herokuapp.com/"
          rel="noopener noreferrer"
          target="_blank"
          title="BuiltByBixby.us"
        >
          Built by Bixby
        </a>
      </div>
    </footer>
  );
}

export default Footer;
