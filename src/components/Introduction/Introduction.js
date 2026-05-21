import React, { useEffect, useRef, useState } from 'react';
import style from "./Introduction.module.css";

function AnimatedSquare({ letter }) {
    return (
        <div className={style.animatedSquare}>
            {letter}
        </div>
    );
}

function Square({ letter }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseEnter = () => {
            el.classList.add("rubberBand");
        };

        const handleAnimationEnd = () => {
            el.classList.remove("rubberBand");
        };

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('animationend', handleAnimationEnd);
    }, []);

    return <div className={style.square} ref={ref}>{letter}</div>;
}

function Introduction() {
    return (    
        <div className={style.introductionContainer}>
            <div className={style.aboutMeHeaderContainer}>
                <div className={style.menu} id="menu">
                    <li className={style.line}>
                        <Square letter="A" />
                        <Square letter="B" />
                        <Square letter="O" />
                        <Square letter="U" />
                        <Square letter="T" />
                    </li>
                    <li className={style.line}>
                        <Square letter="M" />
                        <AnimatedSquare letter="E" />
                    </li>
                </div>
            </div>
            <div className={style.aboutMeTextContainer}>
                <p>
          I’m a software engineer with a passion for building fast, and amazing user experiences with responsive and accessible frontend
          and dependable, scalable backend.
                </p>
                <p>
          I’ve worked across startups, big tech, and research labs—turning ideas into production
          features and partnering with forward-thinking teams to design inclusive, polished products.
                </p>
                <p>In my toolbox, you'll find technologies like:</p>
                <ul className={style.toolbox}>
                    <li className={style.javascript}>JavaScript</li>
                    <li className={style.typescript}>TypeScript</li>
                    <li className={style.go}>Go</li>
                    <li className={style.rust}>Rust</li>
                    <li className={style.react}>React</li>
                    <li className={style.reactNative}>React Native</li>
                    <li className={style.flask}>Flask</li>
                    <li className={style.llm}>RAG System</li>
                    <li className={style.rag}>Flask</li>
                    <li className={style.redux}>Redux</li>
                    <li className={style.html}>HTML</li>
                    <li className={style.css}>CSS</li>
                    <li className={style.less}>LESS</li>
                    <li className={style.python}>Python</li>
                    <li className={style.java}>Java</li>
                    <li className={style.assembly}>Assembly</li>
                    <li className={style.firebase}>Firebase</li>
                    <li className={style.mongoDB}>MongoDB</li>
                    <li className={style.sql}>SQL</li>
                    <li className={style.webpack}>Webpack</li>
                    <li className={style.sql}>PopSQL</li>
                    <li className={style.charm}>Charm</li>
                    <li className={style.kubernetes}>Kubernetes</li>
                    <li className={style.docker}>Docker</li>
                </ul>
            </div>
        </div>
    );
}

export default Introduction;
