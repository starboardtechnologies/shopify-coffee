import {Link} from "react-router";

const collections = [
  {
    title: "Espresso",
    image: "/images/espresso-collection.jpg",
    link: "/collections",
  },
  {
    title: "Single Origin",
    image: "/images/singleorigin-collection.jpg",
    link: "/collections",
  },
  {
    title: "Blends",
    image: "/images/blend-collection.jpg",
    link: "/collections",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="featured-collections">

      <div className="section-heading">
        <span>Java</span>

        <h2>Shop Our Coffee</h2>

        <p>
          Discover exceptional coffees sourced from the world's finest growing
          regions and roasted with precision.
        </p>
      </div>

      <div className="collection-grid">
        {collections.map((collection) => (
          <Link
            key={collection.title}
            to={collection.link}
            className="collection-card"
          >
            <img
              src={collection.image}
              alt={collection.title}
            />

            <div className="collection-overlay">
              <h3>{collection.title}</h3>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}