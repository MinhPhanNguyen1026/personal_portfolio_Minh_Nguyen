import style from "./Skill.module.css"
import Skill from "./Skill";

function SkillSet({listOfSkill}) {
    return (
        <div className={style.skillSetContainer}>
            {listOfSkill.map((skill, index) => 
                <Skill key={index} skill={skill} 
            />)}
        </div>
    )
} 

export default SkillSet;