import React, { useState } from 'react';
import style from './SocialLinks.module.css'; // Importing the CSS file

function SocialLinks() {
    const [isCopied, setIsCopied] = useState(false); // State to track whether email is copied
    const emailAddress = "mnguyen31@u.rochester.edu"; // Replace with your email address
    
    const emailCopy = () => {
        navigator.clipboard.writeText(emailAddress) // Using Clipboard API to copy email to clipboard
            .then(() => {
                setIsCopied(true); // If successful, set isCopied to true
                setTimeout(() => setIsCopied(false), 1300); // Reset isCopied to false after 3 seconds
            })
            .catch(err => console.error('Could not copy text: ', err));
    }
  
    const downloadResume = () => {
        console.log("RESUME")
    }
 
    return (
        <div className={style.socialLinksContainer}>
            <div className={style.titleContact}>
                Designed and developed by Minh Nguyen.
            </div>
            <div className={style.spaceHolder}></div>
            <div className={style.linkContainer}>
                <a className={style.linkContact} href="https://www.linkedin.com/in/minh-nguyen-98a48a245/">LinkedIn</a>
                <div className={style.linkContact} onClick={emailCopy}>
                    <div>
                        Gmail
                    </div>
                    <div style={{display: isCopied ? 'block' : 'none', position: isCopied ? 'absolute' : 'absolute'}}>
                        Copied!
                    </div>
                </div>
                <a className={style.linkContact} href="https://github.com/Sonicfires2">Github</a>
                <a 
                    className={style.linkContact} 
                    href="/Minh_Nguyen_Resume.pdf" 
                    download="Minh_Nguyen_Resume.pdf"
                >
                    Resume
                </a>
            </div>
        </div>
    );
}

export default SocialLinks;
