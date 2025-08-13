import { useState } from "react";
import CreateEntry from "./CreateEntry/CreateEntry";
import style from "./ProjectFrame.module.css"
import project1Image from './project1.png';
import project2Image from './project2.png';
import project3Image from './project3.png';
import project4Image from './project4.png';

import { Parallax, useParallax } from 'react-scroll-parallax';
import StudentTable from "../AI/StudentTable";
import SkillSet from "../Skill/SkillSet";

function ProjectFrame() {
    const [showAIForm, setShowAIForm] = useState(false)
    const [showRawData, setShowRawData] = useState(false)


    return (
        <div className={style.projectContainer}>
            <Parallax speed={-7}>
                <div className={style.projectTitle}>
                    MY PERSONAL PROJECTS
                </div>
                <div className={style.projectDescription}>
                    Some of the things I have built/am currently working on.
                    <br></br>
                    Including both website and software projects.
                </div>
            </Parallax>
            <div className={style.firstProjectContainer}>
                <div className={style.imageContainer}>
                    <img src={project1Image} width="77%" height="77%" alt="A sample image in the images folder"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        Anime Interest Floor landing page
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            A landing page for the most active Special Interest Housing Organization of University of Rochester. A landing page for the Anime Interest Floor which has over 300 members. 
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <a className={style.gitHubLinkContainer} href="https://github.com/Sonicfires2/landing-page-aif">
                            GitHub Code
                        </a>
                        <a className={style.websiteLinkContainer} href="https://sonicfires2.github.io/landing-page-aif/">
                            Website Link
                        </a>
                        <SkillSet listOfSkill={["JavaScript", "CSS", "HTML"]}></SkillSet>
                    </div>
                </div>
            </div>

            <div className={style.secondProjectContainer}>
                <div className={style.imageContainer}>
                    <img src={project2Image} width="100%" height="100%" alt="A sample image in the images folder"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        KPI Dashboard
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            Designed, coded, and embedded an automated dashboard containing different KPI for the data pipeline of Onc.ai onto their Confluence page. 
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <a disable className={style.disablegitHubLinkContainer} href="#">
                            Confidental Code
                        </a>
                        <a className={style.websiteLinkContainer} href="https://test-react-to-make-data-analysis-dashboard-two.atlassian.net/l/cp/JjJFkWo1">
                            Mockup/Study Case in Confluence 
                        </a>
                        <SkillSet listOfSkill={["Python", "JavaScript", "MongoDB", "Google Cloud Platform", "Trello API", "Valohai API", "SharePoint"]}></SkillSet>
                    </div>
                </div>
            </div>

            <div className={style.firstProjectContainer}>
                <div className={style.imageContainer}>
                    <img src={project3Image} width="100%" height="100%" alt="A sample image in the images folder"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        Teacher Authoring Tool
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            Teacher Authoring Tool is a web application specifically built to help promote
                            AI literacy among K-12 students by allowing teachers to create interactive AI-related assignments for students. 
                            This project is currently under development.
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <a disable className={style.disablegitHubLinkContainer} href="#">
                            Confidental Code
                        </a>
                        <a className={style.websiteLinkContainer} href="https://advait.org/files/zhou_2024_k12_ML.pdf">
                            Published Paper 
                        </a>
                        <SkillSet listOfSkill={["React","JavaScript","TypeScript", "HTML","CSS", "Redux", "LESS"]}></SkillSet>
                    </div>
                </div>
            </div>

            <div className={style.secondProjectContainer}>
                <div className={style.imageContainer}>
                    <img src={project4Image} width="100%" height="100%" alt="A sample image in the images folder"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        Melcourse CDCS System 
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            With the old course description course system - also known as CDCS - being outdated, 
                            there was a need for a new CDCS for the students to utilize. This website is a solution to this issue. 
                            The website was official acquired and endorsed by the University. Current, over 1200 students actively use it.
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <a disable className={style.disablegitHubLinkContainer}>
                            Confidental Code 
                        </a>
                        <a className={style.websiteLinkContainer} href="https://melcourses.com">
                            Website Link
                        </a>
                        <SkillSet listOfSkill={["JavaScript", "TypeScript", "NextJS","React", "HTML", "CSS", "SQL"]}></SkillSet>
                    </div>
                </div>
            </div>
            {showAIForm ?             
                <CreateEntry showAIForm={showAIForm} setShowAIForm={setShowAIForm}></CreateEntry>
                :
                null
            }
            {showRawData ?
                <StudentTable showRawData={showRawData} setShowRawData={setShowRawData}/>
                :
                null
            }
        </div>
    )
}

export default ProjectFrame;