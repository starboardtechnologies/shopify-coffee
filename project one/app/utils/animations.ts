import gsap from "gsap";

export function fadeUp(
  element: HTMLElement
) {
  gsap.from(element, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power3.out",
  });
}