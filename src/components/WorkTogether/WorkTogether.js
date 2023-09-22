import style from "./WorkTogether.module.css"
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import AnimatedIcons from "../AnimatedIcon/AnimatedIcon";

function WorkTogether() {   
    return (
        <div className={style.workTogetherContainer}>
            <div className={style.workTogetherTextContainer}>
                <div className={style.title}>
                    LET'S WORK TOGETHER
                </div>
                <div className={style.line}></div>
                <div className={style.paragraph}>
                    From interactive websites to <b className={style.highlight}>maintainable</b> software,  
                    from single page web app to an application that deals with data pipeline, 
                    I would love to contribute to your <b className={style.highlight}>ambitious</b> yet <b className={style.highlight}>user-friendly</b> projects.
                </div>
                <div className={style.paragraphMobile}>
                    From interactive websites to <b className={style.highlight}>maintainable</b> software, single page 
                    web app to an application that deals with data pipeline, 
                    I would love to contribute to your <b className={style.highlight}>ambitious</b> yet <b className={style.highlight}>user-friendly</b> projects.
                    <Parallax speed={-9}>
                        <div className={style.dottedBackground}></div>
                    </Parallax>
                </div>
            </div>
            <div className={style.workTogetherAnimationContainer}>
                <Parallax speed={-12}>
                    <AnimatedIcons></AnimatedIcons>
                </Parallax>
            </div>
        </div>
    )
}

export default WorkTogether;