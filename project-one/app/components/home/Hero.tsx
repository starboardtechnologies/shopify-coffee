import {Link} from 'react-router';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">
          JAVA COFFEE
        </p>

        <h1>
          Premium
          <br />
          Specialty Coffee
        </h1>

        <p className="hero-description">
          Carefully roasted coffee from exceptional
          farms around the world.
        </p>

        <Link
          to="/collections"
          className="hero-button"
        >
          Explore Coffee
        </Link>
      </div>

      <div className="hero-image">
        <img
          src="/images/coffee-hero.jpg"
          alt="Java specialty coffee"
        />
      </div>
    </section>
  );
}