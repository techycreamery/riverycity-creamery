import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="visit">
      <div className="footer-panel">
        <div>
          <p>River City Creamery</p>
          <p>Missoula, MT</p>
          <p>Daily 12 PM to 10 PM</p>
        </div>
        <div>
          <p>
            <a href="mailto:info@rivercity-creamery.com">info@rivercity-creamery.com</a>
          </p>
          <p>
            <a href="tel:+14062186410">(406) 218-6410</a>
          </p>
          <p>&copy; {year} Steel Barrel Ice Cream, Inc.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
