import style from "./Transition.module.css"

function TransitionComponent() {
    return (
        <div className={style.TransitionComponentContainer}>
            <div className={style.scrollContainer}>
                <span className={style.letter} style={{ animationDelay: '0s' }}>S</span>
                <span className={style.letter} style={{ animationDelay: '0.3s' }}>C</span>
                <span className={style.letter} style={{ animationDelay: '0.6s' }}>R</span>
                <span className={style.letter} style={{ animationDelay: '0.9s' }}>O</span>
                <span className={style.letter} style={{ animationDelay: '1.2s' }}>L</span>
                <span className={style.letter} style={{ animationDelay: '1.5s' }}>L</span>
            </div>
            <div className={style.arrow}></div>
            <div className={style.arrow}></div>
            <div className={style.arrow}></div>
        </div>
    )
}

export default TransitionComponent;