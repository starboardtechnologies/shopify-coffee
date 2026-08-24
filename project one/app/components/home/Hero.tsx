import {useLayoutEffect, useRef} from "react";
import gsap from "gsap";

export default function Hero() {

  const heroRef = useRef<HTMLDivElement>(null);


  useLayoutEffect(() => {

    const ctx = gsap.context(() => {

      gsap.from(".hero-content", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out",
      });


      gsap.from(".hero-image", {
        opacity: 0,
        scale: 1.05,
        duration: 1.4,
        ease: "power2.out",
        delay: 0.2,
      });


    }, heroRef);


    return () => ctx.revert();

  }, []);


  return (

    <section
      ref={heroRef}
      className="hero"
    >

      <div className="hero-content">

        <h1>
          Java
        </h1>

        <h2>
          Premium Specialty Coffee
        </h2>

        <p>
          Carefully roasted coffee from exceptional
          farms around the world.
        </p>

      </div>


      <div className="hero-image">

        <img
          src="/images/coffee-hero.jpg"
          alt="Java coffee"
        />

      </div>


    </section>

  );

}