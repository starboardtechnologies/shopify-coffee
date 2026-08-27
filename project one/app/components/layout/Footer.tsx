import {Link} from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">

      <div className="site-footer-inner">

        {/* BRAND */}

        <div className="site-footer-brand">

          <Link
            to="/"
            className="site-footer-logo"
          >
            Java
          </Link>

          <p>
            Specialty coffee, roasted with
            intention.
          </p>

        </div>


        {/* SHOP */}

        <div className="site-footer-column">

          <h3>
            Shop
          </h3>

          <Link to="/collections">
            Coffee
          </Link>

          <Link to="/collections">
            Espresso
          </Link>

          <Link to="/collections">
            Single Origin
          </Link>

        </div>


        {/* SITE */}

        <div className="site-footer-column">

          <h3>
            Explore
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/collections">
            Shop
          </Link>

          <Link to="/cart">
            Cart
          </Link>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="site-footer-bottom">

        <span>
          © {new Date().getFullYear()} Java Coffee
        </span>

        <span>
          Portfolio Demo
        </span>

      </div>

    </footer>
  );
}