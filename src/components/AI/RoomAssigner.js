import React, { useEffect, useState } from 'react';
import style from "./RoomAssigner.module.css"

const HousingAssignmentList = ({ assignments }) => {
    return (
        <div className={style.scrollableContainer}>
            <table className={style.containerOfAllData}>
                <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Room Number</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(assignments).map(([studentName, roomNumber]) => (
                    <tr key={studentName}>
                    <td>{studentName}</td>
                    <td>{roomNumber}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
  };
  

const RoomAssigner = (props) => {
    const AIF = {
        "ProjectorSuite": [
            {
                "RoomNumber": "711",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "712",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "713",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "714",
                "Double": false,
                "OnePointFive": true,
            },
            {
                "RoomNumber": "715",
                "Double": true,
                "OnePointFive": false,
            },
        ],
        "ArtSuite": [
            {
                "RoomNumber": "721",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "722",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "723",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "724",
                "Double": false,
                "OnePointFive": true,
            },
            {
                "RoomNumber": "725",
                "Double": true,
                "OnePointFive": false,
            },
        ],
        "VideoGameSuite": [
            {
                "RoomNumber": "731",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "732",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "733",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "734",
                "Double": false,
                "OnePointFive": true,
            },
            {
                "RoomNumber": "735",
                "Double": true,
                "OnePointFive": false,
            },
        ],
        "BoardGameSuite": [
            {
                "RoomNumber": "741",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "742",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "743",
                "Double": false,
                "OnePointFive": false,
            },
            {
                "RoomNumber": "744",
                "Double": false,
                "OnePointFive": true,
            },
            {
                "RoomNumber": "745",
                "Double": true,
                "OnePointFive": false,
            },
        ],
    }    
    
    class Student {
        constructor(name, year, isEnrolled, suite, roomNumbers, roomType, age, numFriends) {
          this.name = name;
          this.seniority = year;
          this.isInEBoard = isEnrolled;
          this.suitePref = suite;
          this.roomPref = roomNumbers;
          this.sizeRoomPref = roomType;
          this.numberOfAttendance = age;
          this.numberOfStrike = numFriends;
        }
    }

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
    const [solution, setSolution] = useState({});
    const [newStudent, setNewStudent] = useState(new Student);
    let rooms = Object.values(AIF).flat().map(room => room["RoomNumber"]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleAddStudent = () => {
        setStudents(prev => [...prev, newStudent]);
        setNewStudent(newStudent);
    };

    function simulatedAnnealing(students, rooms, initialTemperature, coolingRate) {
        const objectiveFunction = (solution, students) => {
            let score = 0;
            const seniorityWeights = {
                "Senior": 200,
                "Junior": 3,
                "Sophomore": 2,
                "Freshman": 1
            };
            for (let student of students) {
                let room = solution[student.name];
                room = parseInt(room)
                if (student.roomPref.includes(room)) {
                    score += 700;
                }
    
                score += seniorityWeights[student.seniority];
                if (student.isInEboard) {
                    score += 100;
                }
            }
            return score;
        }
    
        const getNeighbor = (solution) => {
            const students = Object.keys(solution);
            const [s1, s2] = [students[Math.floor(Math.random() * students.length)], students[Math.floor(Math.random() * students.length)]];
            const temp = solution[s1];
            solution[s1] = solution[s2];
            solution[s2] = temp;
            return solution;
        }

        function isDoubleRoom(roomNumber) {
            // Loop over all suites
            for (let suiteName in AIF) {
                const suite = AIF[suiteName];
        
                // Find the room with the provided number
                for (let room of suite) {
                    if (room.RoomNumber === roomNumber) {
                        return room.Double;
                    }
                }
            }
            return false;
        }

        function initialSolutionGen(students, rooms) {
            let initialSolution = {};
            let assignedRooms = new Map();
    
            for (let student of students) {
                let roomAssigned = false;
            
                // Try to assign based on student's room preference
                for (let prefRoom of student.roomPref) {
                    const currentCount = assignedRooms.get(prefRoom) || 0;
                    const maxCapacity = isDoubleRoom(prefRoom) ? 2 : 1;
                    if (currentCount < maxCapacity && rooms.includes(prefRoom)) {
                        initialSolution[student.name] = prefRoom;
                        assignedRooms.set(prefRoom, currentCount + 1);
                        roomAssigned = true;
                        break;
                    }
                }
            
                // If none of the preferred rooms are available, assign a random room
                if (!roomAssigned) {
                    let availableRooms = rooms.filter(room => {
                        const currentCount = assignedRooms.get(room) || 0;
                        const maxCapacity = isDoubleRoom(room) ? 2 : 1;
                        return currentCount < maxCapacity;
                    });
            
                    let randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
                    const currentCount = assignedRooms.get(randomRoom) || 0;
                    initialSolution[student.name] = randomRoom;
                    assignedRooms.set(randomRoom, currentCount + 1);
                }
            }
            
            return initialSolution;
        }
    
        // Function to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Shuffle the rooms array
        const shuffledRooms = [...rooms];
        shuffleArray(shuffledRooms);

        // Assign rooms sequentially from the shuffled array
        let currentSolution = initialSolutionGen(students, rooms);
        let currentValue = objectiveFunction(currentSolution, students);
    
        let bestSolution = { ...currentSolution };
        let bestValue = currentValue;
    
        let temperature = initialTemperature;
    
        while (temperature > 1) {
            const neighborSolution = getNeighbor({ ...currentSolution });
            const neighborValue = objectiveFunction(neighborSolution, students);
    
            // If the neighbor solution is better or the difference in objective value is accepted by Simulated Annealing criterion
            if (neighborValue > currentValue || Math.random() < Math.exp((neighborValue - currentValue) / temperature)) {
                Object.assign(currentSolution, neighborSolution);
                currentValue = neighborValue;
            }
    
            if (currentValue > bestValue) {
                Object.assign(bestSolution, currentSolution);
                bestValue = currentValue;
            }
            temperature *= coolingRate;
        }
        
        setSolution(bestSolution)
        return bestSolution;
    }
    
    return (
        <div>
            <div>
                <div className={style.headingsContainer} onClick={() => {simulatedAnnealing(students, rooms, 1000, 0.995)}}>Housing Assignment AI - Click Me</div>
                <HousingAssignmentList assignments={solution} />
            </div>
        </div>
    );
}

export default RoomAssigner;
