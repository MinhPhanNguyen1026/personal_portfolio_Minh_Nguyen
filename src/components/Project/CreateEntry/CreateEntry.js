import RoomAssigner from '../../AI/RoomAssigner';
import styles from './CreateEntry.module.css';
import { useState } from "react";

const CreateEntry = (props) => {
    const [formData, setFormData] = useState({
        year: "Freshman",
        attendance: 0,
        strikes: 0,
        isOnEboard: false,
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const submitHousingEntry = (event) => {
        event.preventDefault();
        props.setShowAIForm(!props.showAIForm)
        console.log(formData);
    }

    return (
        <div>
            <div className={styles.containerShadow}></div>
            <div className={styles.container}>
                <div className={styles.wrap}>
                    <div className={styles.aiContainer}>
                        <div className={styles.housingAssignment}>
                            <RoomAssigner newStudentData={formData}></RoomAssigner>
                        </div>
                    </div>
                </div>
                <div className={styles.goBack} onClick={() => {props.setShowAIForm(!props.showAIForm)}}> Go Back </div>
            </div>
        </div>
    );    
}

export default CreateEntry;