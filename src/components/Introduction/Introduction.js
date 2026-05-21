import React from "react";
import { useParallax } from "react-scroll-parallax";
import style from "./Introduction.module.css";

const SKILLS = [
    "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "Assembly",
    "React", "React Native", "Redux", "HTML", "CSS", "LESS", "Webpack",
    "Flask", "RAG System", "Firebase", "MongoDB", "SQL", "PopSQL",
    "Charm", "Docker", "Kubernetes",
];

function Introduction() {
    // Explicit translateY (vs. `speed`) gives the library two known endpoints
    // and a continuous interpolation between them, which avoids the small
    // "teleport" jump that can happen when `speed` first activates as the
    // section enters the viewport.
    const watermark = useParallax({ translateY: ["-120px", "120px"] });

    return (
        <section
            className={style.introductionContainer}
            aria-labelledby="about-heading"
        >
            <div className={style.inner}>
                <span
                    ref={watermark.ref}
                    className={style.watermark}
                    aria-hidden="true"
                >
                    About
                </span>

                <div className={style.content}>
                    <span className={style.eyebrow}>
                        <span className={style.dot} aria-hidden="true" />
                        About me
                    </span>

                    <h2 id="about-heading" className={style.heading}>
                        Crafting software,{" "}
                        <span className={style.headingAccent}>end to end</span>.
                    </h2>

                    <p className={style.lead}>
                        I&rsquo;m a software engineer focused on building fast,
                        accessible frontend experiences and dependable backend
                        systems.
                    </p>
                    <p className={style.lead}>
                        I&rsquo;ve worked across startups, big tech, and research
                        labs, turning ideas into production features and
                        collaborating with teams to build inclusive, polished
                        products.
                    </p>

                    <div className={style.toolboxSection}>
                        <h3 className={style.toolboxTitle}>
                            <span className={style.dot} aria-hidden="true" />
                            In my toolbox
                        </h3>
                        <ul
                            className={style.toolbox}
                            aria-label="Technologies I work with"
                        >
                            {SKILLS.map((skill) => (
                                <li key={skill} className={style.badge}>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Introduction;
