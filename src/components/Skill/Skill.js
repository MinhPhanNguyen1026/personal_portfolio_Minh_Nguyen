import style from "./Skill.module.css"

function Skill({skill}) {
    return (
        <span className={style.skill}>{skill}</span>
    )
} 

export default Skill;