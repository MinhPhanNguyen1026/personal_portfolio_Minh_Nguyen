import './App.css';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import AboutMe from './components/AboutMe/AboutMe';
import TransitionComponent from './components/Transition/TransitionComponent'
import Introduction from './components/Introduction/Introduction';
import WorkTogether from './components/WorkTogether/WorkTogether';
import ProjectFrame from './components/Project/ProjectFrame';
import RoomAssigner from './components/AI/RoomAssigner';
import SocialLinks from './components/Contact/SocialLinks';

import { Link } from 'react-scroll';

function Loading() {
  return (
    <div className='loaderContainer'>
      <div className="loader"></div> 
    </div> 
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  const [translateValues, setTranslateValues] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
  
    const deltaX = x - centerX;
    const deltaY = y - centerY;
  
    // This will make the movement subtle and responsive to cursor position
    const factor = 0.01;
  
    const translateX = -deltaX * factor;
    const translateY = -deltaY * factor;
  
    setTranslateValues({ x: translateX, y: translateY });
  };

  
  return (
    <>
      {loading ? <Loading/> : 
        <ParallaxProvider>
          <div className="App" onMouseMove={handleMouseMove}>
            <Header translateValues={translateValues}></Header>
            <div id="aboutMe">
              <AboutMe></AboutMe>
            </div>
            <div id="transitionComponent">
              <Parallax speed={-8}> 
                <TransitionComponent></TransitionComponent>
              </Parallax>
            </div>
            <div id="introduction">
              <Introduction></Introduction>
            </div>
            <div id="workTogether">
              <WorkTogether></WorkTogether>
            </div>
            <div id="projectFrame">
              <ProjectFrame></ProjectFrame>
            </div>
            <div id="socialLinks">
              <SocialLinks></SocialLinks>
            </div>
          </div>
        </ParallaxProvider>     
      }
    </>
  );
}

export default App;
