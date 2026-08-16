import style from "./WorkTogether.module.css"

const contactLinks = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/minh-nguyen-98a48a245/",
    },
    {
        label: "Gmail",
        href: "mailto:mnguyen31@u.rochester.edu",
    },
    {
        label: "GitHub",
        href: "https://github.com/Sonicfires2",
    },
    {
        label: "Resume",
        href: `${process.env.PUBLIC_URL}/Minh_Nguyen_Resume.pdf`,
        download: "Minh_Nguyen_Resume.pdf",
    },
];

function WorkTogether() {   
    return (
        <section className={style.workTogetherContainer} aria-labelledby="contact-heading">
            <div className={style.inner}>
                <div className={style.workTogetherTextContainer}>
                    <span className={style.eyebrow}>
                        <span className={style.dot} aria-hidden="true" />
                        Contact
                    </span>
                    <h2 id="contact-heading" className={style.title}>
                        LET&rsquo;S WORK TOGETHER
                    </h2>
                    <div className={style.line}></div>
                    <p className={style.paragraph}>
                        From interactive websites to <b className={style.highlight}>maintainable</b> software,
                        I like building polished products that are clear, useful, and easy to keep improving.
                    </p>
                    <p className={style.paragraph}>
                        Reach out on LinkedIn or Gmail, browse the code on GitHub, or grab the resume for a quick overview.
                    </p>
                    <div className={style.ctaLinks} aria-label="Contact links">
                        {contactLinks.map((link) => (
                            <a
                                key={link.label}
                                className={style.ctaLink}
                                href={link.href}
                                download={link.download}
                            >
                                <span className={style.linkDot} aria-hidden="true" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className={style.contactVisual} aria-hidden="true">
                    <div className={style.visualGrid}>
                        <span className={`${style.shape} ${style.circleOne}`} />
                        <span className={`${style.shape} ${style.crossOne}`} />
                        <span className={`${style.shape} ${style.squareOne}`} />
                        <span className={`${style.shape} ${style.circleTwo}`} />
                        <span className={`${style.shape} ${style.crossTwo}`} />
                        <span className={`${style.shape} ${style.squareTwo}`} />
                    </div>
                    <div className={style.visualCard}>
                        <span className={style.cardDot} />
                        <div className={style.cardLines}>
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WorkTogether;
