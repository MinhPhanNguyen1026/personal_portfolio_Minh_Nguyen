import { useState } from "react";
import CreateEntry from "./CreateEntry/CreateEntry";
import style from "./ProjectFrame.module.css"
import project1Image from './project1.png';
import project2Image from './project2.png';
import project3Image from './project3.png';
import project4Image from './project4.png';

import { Parallax } from 'react-scroll-parallax';
import StudentTable from "../AI/StudentTable";
import SkillSet from "../Skill/SkillSet";

function ProjectFrame() {
    const [showAIForm, setShowAIForm] = useState(false)
    const [showRawData, setShowRawData] = useState(false)


    return (
        <div className={style.projectContainer}>
            <Parallax speed={-7}>
                <div className={style.projectIntro}>
                    <span className={style.projectEyebrow}>
                        <span className={style.projectDot} aria-hidden="true" />
                        Selected work
                    </span>
                    <div className={style.projectTitle}>
                        MY PERSONAL PROJECTS
                    </div>
                    <div className={style.projectDescription}>
                        A few shipped and in-progress projects across web products,
                        internal dashboards, research tools, and campus software.
                    </div>
                </div>
            </Parallax>
            <div className={style.firstProjectContainer}>
                <div className={style.imageContainer}>
                    <img className={style.projectImage} src={project1Image} alt="Anime Interest Floor landing page preview"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        Anime Interest Floor Landing Page
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            Designed and built a responsive landing page for the
                            University of Rochester's Anime Interest Floor, giving
                            a 300+ member community a clearer home for events,
                            identity, and organization details.
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <div className={style.projectLinks}>
                            <a className={style.gitHubLinkContainer} href="https://github.com/Sonicfires2/landing-page-aif" target="_blank" rel="noreferrer noopener">
                                GitHub Code
                            </a>
                            <a className={style.websiteLinkContainer} href="https://sonicfires2.github.io/landing-page-aif/" target="_blank" rel="noreferrer noopener">
                                Live Site
                            </a>
                        </div>
                        <SkillSet listOfSkill={["React", "Node", "JavaScript", "CSS", "HTML", "Responsive UI"]}></SkillSet>
                    </div>
                </div>
            </div>

            <div className={style.secondProjectContainer}>
                <div className={style.imageContainer}>
                    <img className={style.projectImage} src={project2Image} alt="KPI Dashboard preview"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        KPI Dashboard
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            Built an embedded operations dashboard for Onc.AI to
                            surface pipeline health, task progress, and
                            team-facing KPIs directly inside Confluence.
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <div className={style.projectLinks}>
                            <span className={style.disablegitHubLinkContainer}>
                                Confidential Code
                            </span>
                            <a className={style.websiteLinkContainer} href="https://test-react-to-make-data-analysis-dashboard-two.atlassian.net/l/cp/JjJFkWo1" target="_blank" rel="noreferrer noopener">
                                Confluence Case Study
                            </a>
                        </div>
                        <SkillSet listOfSkill={["Python", "JavaScript", "MongoDB", "Google Cloud Platform", "Trello API", "Valohai API", "SharePoint"]}></SkillSet>
                    </div>
                </div>
            </div>

            <div className={style.firstProjectContainer}>
                <div className={style.imageContainer}>
                    <img className={style.projectImage} src={project3Image} alt="Teacher Authoring Tool preview"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        Teacher Authoring Tool
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            Contributed to a research-backed authoring platform
                            that helps K-12 teachers create interactive
                            AI-literacy assignments and classroom activities.
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <div className={style.projectLinks}>
                            <span className={style.disablegitHubLinkContainer}>
                                Confidential Code
                            </span>
                            <a className={style.websiteLinkContainer} href="https://advait.org/files/zhou_2024_k12_ML.pdf" target="_blank" rel="noreferrer noopener">
                                Published Paper
                            </a>
                        </div>
                        <SkillSet listOfSkill={["React", "TypeScript", "JavaScript", "Redux", "LESS", "AI Literacy", "Education"]}></SkillSet>
                    </div>
                </div>
            </div>

            <div className={style.secondProjectContainer}>
                <div className={style.imageContainer}>
                    <img className={style.projectImage} src={project4Image} alt="Melcourses CDCS System preview"></img>
                </div>
                <div className={style.textContainer}>
                    <div className={style.specificProjectTitle}>
                        Melcourses CDCS System
                    </div>
                    <div className={style.specificProjectDescriptionContainer}>
                        <p>
                            Helped build a modern course description and discovery
                            system for University of Rochester students, replacing
                            an outdated CDCS workflow and supporting active course
                            planning at scale.
                        </p>
                    </div>
                    <div className={style.linkContainer}>
                        <div className={style.projectLinks}>
                            <span className={style.disablegitHubLinkContainer}>
                                Confidential Code
                            </span>
                            <a className={style.websiteLinkContainer} href="https://melcourses.com" target="_blank" rel="noreferrer noopener">
                                Live Site
                            </a>
                        </div>
                        <SkillSet listOfSkill={["Next.js", "React", "TypeScript", "JavaScript", "SQL", "CSS"]}></SkillSet>
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
