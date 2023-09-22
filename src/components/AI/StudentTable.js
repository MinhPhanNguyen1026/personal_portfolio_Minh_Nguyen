import React, { useState } from 'react';
import style from './RoomAssignerTwo.module.css'; // Assuming your styles are in a file called 'YourStyles.css'

function StudentTable(props) {
    const [students, setStudents] = useState([
        new Student("Alice Johnson", "Senior", true, "ProjectorSuite", [711,712], "Double", 20, 1),
        new Student("Bob Smith", "Senior", true, "ArtSuite", [722,721], "Single", 18, 2),
        new Student("Charlie Brown", "Junior", true, "VideoGameSuite", [733,732], "Double", 19, 1),
        new Student("Daisy Ridley", "Junior", false, "BoardGameSuite", [742,741], "Single", 17, 2),
        new Student("Edward Stone", "Senior", false, "ProjectorSuite", [713,714], "Double", 15, 1),
        new Student("Fiona Green", "Sophomore", true, "ArtSuite", [724,725], "Single", 14, 0),
        new Student("George Lucas", "Freshman", false, "VideoGameSuite", [734,735], "Double", 10, 3),
        new Student("Hannah Abbot", "Sophomore", false, "BoardGameSuite", [744,743], "Single", 11, 0),
        new Student("Ian McKellen", "Senior", true, "ProjectorSuite", [715,714], "Single", 20, 1),
        new Student("Adoft Himmer", "Senior", true, "ProjectorSuite", [713,715], "Single", 16, 2),
        new Student("Julia Roberts", "Junior", false, "ArtSuite", [721,723], "Double", 18, 0),
        new Student("Kevin Costner", "Sophomore", true, "VideoGameSuite", [732,733], "Single", 16, 2),
        new Student("Lily Evans", "Senior", false, "BoardGameSuite", [743,745], "Double", 20, 0),
        new Student("Michael Scott", "Senior", true, "ProjectorSuite", [712,711], "Single", 15, 3),
        new Student("Nina Dobrev", "Junior", false, "ArtSuite", [723,724], "Double", 19, 1),
        new Student("Oscar Wilde", "Sophomore", true, "VideoGameSuite", [735,734], "Single", 17, 0),
        new Student("Obama Pres", "Senior", false, "BoardGameSuite", [741,742], "Double", 18, 1),
        new Student("Rachel Berry", "Junior", true, "ArtSuite", [722,725], "Double", 15, 1),
        new Student("Steven Spielberg", "Sophomore", false, "VideoGameSuite", [731,733], "Single", 13, 0),
        new Student("Tilda Swinton", "Senior", false, "BoardGameSuite", [744,745], "Double", 20, 0),
        new Student("Ursula Le Guin", "Senior", true, "ProjectorSuite", [714,713], "Single", 19, 1),
        new Student("Vincent Vega", "Junior", false, "ArtSuite", [724,723], "Double", 15, 0),
        new Student("Walter White", "Sophomore", true, "VideoGameSuite", [732,731], "Single", 12, 1),
        new Student("Xenia Onatopp", "Freshman", false, "BoardGameSuite", [745,742], "Double", 11, 2),
    ]);

    return (
        <div className={style.container}>
            <div className={style.title}>Raw Data</div>
            <div className={style.containerOfAllData}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Is Eboard</th>
                            <th>Suite Pref</th>
                            <th>Rooms Pref</th>
                            <th>Room Type</th>
                            <th>Points</th>
                            <th>No. of Strikes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.name}>
                                <td>{student.name}</td>
                                <td>{student.class}</td>
                                <td data-content={student.isEboard}>{student.isEboard ? 'Yes' : 'No'}</td>
                                <td>{student.suitePref}</td>
                                <td>{student.roomsPref.join(', ')}</td>
                                <td>{student.roomType}</td>
                                <td>{student.points}</td>
                                <td>{student.strikes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={style.goBack} onClick={() => {props.setShowRawData(!props.showRawData)}}>Go Back</div>
        </div>
    );
}

class Student {
    constructor(name, classLevel, isEboard, suitePref, roomsPref, roomType, points, strikes) {
        this.name = name;
        this.class = classLevel;
        this.isEboard = isEboard;
        this.suitePref = suitePref;
        this.roomsPref = roomsPref;
        this.roomType = roomType;
        this.points = points;
        this.strikes = strikes;
    }
}

export default StudentTable;
