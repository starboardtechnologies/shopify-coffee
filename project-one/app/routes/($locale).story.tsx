export default function StoryPage() {
  return (
    <main className="story-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="story-hero">

        <div className="story-hero-content">

          <span className="story-eyebrow">
            THE JAVA STORY
          </span>

          <h1>
            From Farm
            <br />
            <em>To Cup.</em>
          </h1>

          <p className="story-hero-intro">
            Coffee is more than what fills the cup.
            It is a place, a harvest, a craft, and
            a moment shared.
          </p>

        </div>

        <div className="story-hero-image">

          <img
            src="/images/coffee-hero.jpg"
            alt="Freshly roasted coffee"
          />

        </div>

      </section>


      {/* ==================================================
          INTRO
      ================================================== */}

      <section className="story-intro">

        <div className="story-intro-number">
          01
        </div>

        <div className="story-intro-content">

          <span className="story-eyebrow">
            WHY JAVA
          </span>

          <h2>
            Coffee worth
            <br />
            <em>remembering.</em>
          </h2>

          <p>
            We believe exceptional coffee begins long
            before it reaches the roaster. It begins with
            the people who grow it, the land that gives
            it character, and the careful decisions made
            throughout the journey.
          </p>

          <p>
            Java brings those pieces together with a
            simple goal: make every cup worth slowing
            down for.
          </p>

        </div>

      </section>


      {/* ==================================================
          ORIGIN
      ================================================== */}

      <section className="story-feature story-origin">

        <div className="story-feature-image">

          <img
            src="/images/singleorigin-collection.jpg"
            alt="Single origin coffee"
          />

        </div>

        <div className="story-feature-content">

          <span className="story-eyebrow">
            02 — ORIGIN
          </span>

          <h2>
            Where the
            <br />
            <em>story begins.</em>
          </h2>

          <p>
            Every coffee carries the character of the
            place where it was grown. Altitude, climate,
            soil, and tradition all leave their mark on
            the final cup.
          </p>

          <p>
            We seek out coffees from remarkable growing
            regions and the farmers and cooperatives who
            care for them.
          </p>

        </div>

      </section>


      {/* ==================================================
          ROAST
      ================================================== */}

      <section className="story-feature story-roast">

        <div className="story-feature-content">

          <span className="story-eyebrow">
            03 — ROAST
          </span>

          <h2>
            Crafted with
            <br />
            <em>intention.</em>
          </h2>

          <p>
            Roasting isn't about changing the coffee.
            It's about revealing what is already there.
          </p>

          <p>
            We approach every batch with patience and
            precision, developing the natural sweetness,
            acidity, body, and character that make each
            coffee distinct.
          </p>

        </div>

        <div className="story-feature-image">

          <img
            src="/images/blend-collection.jpg"
            alt="Java coffee blend"
          />

        </div>

      </section>


      {/* ==================================================
          EXPERIENCE
      ================================================== */}

      <section className="story-experience">

        <div className="story-experience-heading">

          <span className="story-eyebrow">
            04 — EXPERIENCE
          </span>

          <h2>
            Make room
            <br />
            for the <em>moment.</em>
          </h2>

        </div>

        <div className="story-experience-copy">

          <p>
            Coffee can be part of the morning rush,
            but it doesn't have to be.
          </p>

          <p>
            The first aroma. The warmth of the cup.
            A conversation that lasts a little longer.
            Java is about those small moments that
            deserve your attention.
          </p>

        </div>

      </section>


      {/* ==================================================
          CLOSING
      ================================================== */}

      <section className="story-closing">

        <div className="story-closing-inner">

          <span className="story-eyebrow">
            JAVA COFFEE
          </span>

          <h2>
            From remarkable
            <br />
            <em>places to yours.</em>
          </h2>

        </div>

      </section>

    </main>
  );
}