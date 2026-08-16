import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { useParallax } from "react-scroll-parallax";
import style from "./AboutMe.module.css";
import PathDrawing from "./PathDrawing";

const AboutMe = () => {
    // Gentle parallax on the decorative art so the hero feels alive without
    // distracting from the headline.
    const art = useParallax({ speed: -8 });

    return (
        <section className={style.heroSection} aria-label="Introduction">
            <div className={style.heroInner}>
                <div className={style.heroText}>
                    <span className={style.eyebrow}>Portfolio</span>

                    <h1 className={style.bigName}>
                        Hi, I&rsquo;m{" "}
                        <span className={style.nameMinh}>Minh</span>{" "}
                        <span className={style.nameNguyen}>Nguyen</span>.
                    </h1>

                    <p className={style.tagline}>
                        Software engineer with a soft spot for thoughtful detail.
                    </p>

                    <ScrollLink
                        to="introduction"
                        smooth={true}
                        duration={700}
                        offset={-70}
                        className={style.scrollCue}
                        aria-label="Scroll to the About me section"
                    >
                        <span className={style.scrollDot} aria-hidden="true" />
                        <span className={style.scrollText}>About me</span>
                        <svg
                            className={style.scrollArrow}
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            aria-hidden="true"
                        >
                            <path
                                d="M7 2 L7 12 M3 8 L7 12 L11 8"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </ScrollLink>
                </div>

                <div
                    ref={art.ref}
                    className={style.heroArt}
                    aria-hidden="true"
                >
                    <PathDrawing />
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
