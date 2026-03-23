import React from 'react';

function Features() {
  return (
    <>
      <section className="content-block" id="flavors">
        <div className="section">
          <div className="section-title">
            <h2>Everything from a quick scoop to dessert for the whole party.</h2>
            <p>
              River City Creamery serves everyday favorites, take-home formats,
              espresso treats, and celebration-ready options for Missoula families
              and events.
            </p>
          </div>

          <div className="menu-grid">
            <article className="menu-card">
              <span>By the scoop</span>
              <h3>Scoops, soft serve, and toppings</h3>
              <p>
                Build your perfect cup or cone with hand-dipped scoops, smooth soft
                serve, and toppings that let you keep it classic or go fully loaded.
              </p>
            </article>
            <article className="menu-card">
              <span>Cafe favorite</span>
              <h3>Affogato</h3>
              <p>
                A rich shot of espresso poured over ice cream for the kind of dessert
                that works just as well in the afternoon as it does after dinner.
              </p>
            </article>
            <article className="menu-card">
              <span>Take home</span>
              <h3>Pints, quarts, and half gallons</h3>
              <p>
                Stock the freezer with your favorite flavors in sizes built for date
                night, family movie night, or a full weekend crowd.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-block" id="story">
        <div className="section story-grid">
          <article className="story-card story-card-dark">
            <h3>Built like a neighborhood institution.</h3>
            <p>
              We started with a simple idea: make dessert that feels celebratory
              on a random Tuesday. That means local milk, scratch-made inclusions,
              and a menu that respects both kids ordering sprinkles and adults
              hunting for something more interesting in Missoula.
            </p>
            <div className="metrics">
              <div className="metric">
                <strong>24</strong>
                <span>rotating flavors</span>
              </div>
              <div className="metric">
                <strong>7</strong>
                <span>days a week</span>
              </div>
              <div className="metric">
                <strong>100%</strong>
                <span>made in-house</span>
              </div>
            </div>
          </article>

          <article className="story-card">
            <h3>What you can order</h3>
            <p>
              Take-home pints, quarts, and half gallons, affogato, scoops, soft serve,
              toppings, ice cream party in a box, and custom ice cream cakes. The
              experience is equal parts dessert counter and Missoula gathering place.
            </p>
          </article>
        </div>
      </section>

      <section className="content-block" id="events">
        <div className="section">
          <div className="section-title">
            <h2>Catering for weddings, team nights, and city festivals.</h2>
            <p>
              Bring the creamery to your event with scooping stations, sundae bars,
              take-home pints, and branded dessert carts that actually look good.
            </p>
          </div>

          <div className="events-grid">
            <article className="event-card">
              <span>On-site service</span>
              <h3>Scoop Cart Package</h3>
              <p>
                Two attendants, multiple flavors, toppings service, and a polished
                dessert setup for parties from 50 to 250 guests.
              </p>
            </article>
            <article className="event-card">
              <span>Custom orders</span>
              <h3>Party in a Box and Ice Cream Cakes</h3>
              <p>
                Bring home a ready-to-serve celebration with party packs, toppings,
                and custom ice cream cakes designed for birthdays and gatherings.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-block">
        <div className="section">
          <div className="section-title">
            <h2>People come back for the atmosphere as much as the ice cream.</h2>
            <p>
              The site should feel like the shop: warm, a little indulgent, and
              unmistakably local.
            </p>
          </div>

          <div className="testimonials-grid">
            <article className="testimonial">
              <h3>“Best stop after a river walk.”</h3>
              <p>
                House-made waffle cones, no filler flavors, and staff who actually
                want you to sample half the menu before deciding.
              </p>
            </article>
            <article className="testimonial">
              <h3>“They catered our launch party.”</h3>
              <p>
                The scoop cart looked sharp, the service was fast, and the maple pecan
                disappeared first.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;
