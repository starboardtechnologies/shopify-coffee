import {Link} from "react-router";

export default function Story() {
  return (
    <section className="story">

      <div className="story-content">

        <span className="story-label">
          OUR STORY
        </span>

        <h2>
          From Origin to Extraordinary
        </h2>

        <p>
          Every Java coffee begins with relationships built at
          origin. We partner with growers who share our passion for
          sustainability, craftsmanship, and exceptional quality. Every roast
          is carefully developed to celebrate the unique character of each
          coffee.
        </p>

        <Link to="/story" className="story-link">
          Learn More →
        </Link>

      </div>

      <div className="story-image">
        <img
          src="/images/coffee-roasting.jpg"
          alt="Coffee roasting"
        />
      </div>

    </section>
  );
}