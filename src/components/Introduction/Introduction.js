import React, { useEffect, useRef } from 'react';
import style from "./Introduction.module.css";

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
                        <Square letter="E" />
                    </li>
                </div>
            </div>
            <div className={style.aboutMeTextContainer}>
                <p>
                    I am a computer science student at the
                    University of Rochester with a passion for 
                    web development and software development. 
                </p>
                <p>
                    I have had the honor of working for 
                    a startup, a corporation, and a research lab,
                    where I worked with forward thinking people to 
                    design accessible products. 
                </p>
                <p>In my toolbox, you'll find technologies like:</p>
                <ul className={style.toolbox}>
                    <li className={style.javascript}>JavaScript</li>
                    <li className={style.react}>React</li>
                    <li className={style.redux}>Redux</li>
                    <li className={style.html}>HTML</li>
                    <li className={style.css}>CSS</li>
                    <li className={style.less}>LESS</li>
                    <li className={style.python}>Python</li>
                    <li className={style.java}>Java</li>
                    <li className={style.firebase}>Firebase</li>
                    <li className={style.mongoDB}>MongoDB</li>
                    <li className={style.sql}>SQL</li>
                </ul>
            </div>
        </div>
    );
}

export default Introduction;