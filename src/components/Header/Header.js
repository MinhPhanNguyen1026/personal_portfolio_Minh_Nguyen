import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-scroll';
import resume from "./Minh_Nguyen_Resume_CS.pdf"

function Header({ translateValues }) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const logoBack = document.querySelector(`.${styles.logoBack}`);
    if (logoBack) {
      logoBack.style.transition = '0.8s ease-out';
      logoBack.style.transform = `translate(calc(-85% + ${translateValues.x}px), calc(-0% + ${translateValues.y}px)) scale(1.1)`;
    }
  }, [translateValues]);

  const handleClickMenu = () => {
    console.log("Hi")
    setShowMenu(!showMenu)
  }

  const handleClickResume = () => {
    console.log("Ji")
  }

  return (
    <div className={styles.header}>
      <div className={!showMenu ? styles.logoFront : styles.logoFrontTwo}>M</div>
      <div className={styles.logoBack}>N</div>
      <div className={styles.verticalSlash} />
      <a className={styles.wrap} onClick={() => handleClickMenu()}>
        <span className={styles.button}>
          <b>MENU</b>
        </span>
        <svg className={styles.svgHeader} width="13px" height="10px" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
      </a>
      <div className={showMenu ? `${styles.menu} ${styles.activeMenu}` : styles.menu}>
        <div className={styles.flexContainer}>
          <div className={styles.horizontalSlash} />
          <Link
            activeClass="active"
            to="aboutMe"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            onClick={handleClickMenu}
          >
            <div className={styles.linkTitle}>Introduction</div>
          </Link>          
          <Link
            activeClass="active"
            to="introduction"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            onClick={handleClickMenu}
          >
            <div className={styles.linkTitle}>About Me</div>
          </Link>
          <Link
            activeClass="active"
            to="projectFrame"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            onClick={handleClickMenu}
          >
            <div className={styles.linkTitle}>My Projects</div>
          </Link>
          <Link
            activeClass="active"
            to="socialLinks"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            onClick={handleClickMenu}
          >
            <div className={styles.linkTitle}>Contact</div>
          </Link>
            <a className={styles.linkTitle}
              href={resume} 
              download="Minh_Nguyen_Resume.pdf"
            >My Resume</a>
        </div>
      </div>
    </div>
  );
}

export default Header;
