import { APP_NAME, APP_TAGLINE } from "../utilis/brand";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div>
          <div className="brand footer-brand">
            <span className="brand-logo">
              <i className="fa-solid fa-earth-americas" />
            </span>
            <span className="title">{APP_NAME}</span>
          </div>
          <p className="footer-tagline">
            {APP_TAGLINE} Explore every country on Earth.
          </p>
        </div>
        <p className="footer-credits">
          Country data from{" "}
          <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer">
            REST Countries
          </a>{" "}
          · Maps ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          contributors &amp;{" "}
          <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">
            CARTO
          </a>
          <br />© {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
