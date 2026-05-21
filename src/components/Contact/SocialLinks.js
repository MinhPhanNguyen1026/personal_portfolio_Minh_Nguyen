import style from './SocialLinks.module.css'; // Importing the CSS file

const footerLinks = [
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

function SocialLinks() {
    return (
        <footer className={style.socialLinksContainer}>
            <div className={style.titleContact}>
                Designed and developed by Minh Nguyen.
            </div>
        </footer>
    );
}

export default SocialLinks;
