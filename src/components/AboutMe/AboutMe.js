import React from 'react';
import style from "./AboutMe.module.css"
import { Parallax, useParallax } from 'react-scroll-parallax';
const AboutMe = () => {
  const parallax = useParallax({
    speed: -17,
  });

  return (
    <div className={style.aboutContainer}>
    <div className={style.introTextContainer} ref={parallax.ref}>
      <div className={style.bigContainer}>
        <div className={style.introTextBlock}>Hi, my</div>    
        <div className={style.introTextBlock}>name is <b><span className={style.minh}>Minh</span> <span className={style.nguyen}>Nguyen</span></b>.</div>
      </div>
      <div className={style.bigContainer}>
        <div className={style.introAboutMeBlock}>I'm an aspiring web developer 
          and software developer. <b className={style.highlight}>I am eager to learn.</b> And  I enjoy 
          creating <b className={style.highlight}>maintainable</b> codebase, <b className={style.highlight}>KPI dashboard</b> with <b className={style.highlight}>clean and user-friendly</b> user interface. 
        </div> 
      </div>   
    </div>
    <div className={style.imageContainer}>
      <div className={style.dottedBackground}></div>
    </div>
    </div>
  )
};

export default AboutMe;
