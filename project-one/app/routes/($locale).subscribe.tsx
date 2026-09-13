import {useState} from "react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  }

  return (
    <main className="subscribe-page">

      <section className="subscribe-hero">

        <div className="subscribe-content">

          <span className="subscribe-eyebrow">
            JAVA
          </span>

          <h1>
            Stay In The Loop
          </h1>

          <p>
            Get occasional updates about new coffees,
            seasonal releases, and what's happening
            behind the roast.
          </p>

          {!submitted ? (
            <form
              className="subscribe-form"
              onSubmit={handleSubmit}
            >

              <div className="subscribe-input-group">

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Email address"
                  aria-label="Email address"
                  required
                />

                <button type="submit">
                  Subscribe
                </button>

              </div>

              <p className="subscribe-note">
                No spam. Just coffee.
              </p>

            </form>
          ) : (
            <div className="subscribe-success">

              <span className="subscribe-success-mark">
                ✓
              </span>

              <h2>
                You're In.
              </h2>

              <p>
                Thanks for subscribing. We'll keep you
                posted on what's brewing.
              </p>

            </div>
          )}

        </div>

      </section>


      <section className="subscribe-benefits">

        <div className="subscribe-benefit">

          <span>
            01
          </span>

          <h2>
            New Coffee
          </h2>

          <p>
            Be the first to hear about new origins,
            blends, and seasonal coffees.
          </p>

        </div>


        <div className="subscribe-benefit">

          <span>
            02
          </span>

          <h2>
            Behind The Roast
          </h2>

          <p>
            Follow the process from green bean to
            finished roast.
          </p>

        </div>


        <div className="subscribe-benefit">

          <span>
            03
          </span>

          <h2>
            Special Releases
          </h2>

          <p>
            Get early access to limited coffees and
            special releases.
          </p>

        </div>

      </section>

    </main>
  );
}