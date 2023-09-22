import React from 'react';
import styles from './AnimatedIcon.module.css'; // Assume you saved the CSS above to a file named YourStylesheet.css

const AnimatedIcons = () => {
    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles["shape-container--1"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--2"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--3"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--4"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--5"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--6"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--7"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--8"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--9"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--10"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
                <div className={styles["shape-container--11"]}>
                    <div className={styles["random-shape"]}></div>
                </div>
            </div>
        </div>
    );
}

export default AnimatedIcons;
