import styles from "./MyProfile.module.css"
import plus from './plus.png';
import React, { useEffect, useState } from 'react';
import Modal from './components/Modal';
import ModalJob from './components/ModalJob';
import ModalAdd from './components/ModalAdd';
import { useNavigate } from 'react-router-dom';

export function MyProfile () {
    const [openModal, setOpenModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const [selectedValue, setSelectedValue] = useState('');

    const handleOpenModal = (value) => {
        setSelectedValue(value);
        setShowModal(true);
    };
     const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModalAdd = (value) => {
        setSelectedValue(value);
        setAddModal(true);
    };
     const handleCloseModalAdd = () => {
        setAddModal(false);
    };

    const handleOpenModalJob = (value) => {
        setSelectedValue(value);
        setOpenModal(true);
    };
     const handleCloseModalJob = () => {
        setOpenModal(false);
    };


    const navigate = useNavigate();
    const [dataPastJobs, setData] = useState([]);
    const [dataCurrentJobs, setDataCurrent] = useState([]);
    const [dataPurchasedJobs, setDataPurchased] = useState([]);
    const [detailedPurchasedJobs, setDetailedPurchasedJobs] = useState([]);

    

    const [user, setUser] = useState(null);

    useEffect (() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("no token found, redirecting");
                navigate('/login')
                return;
            }
            try {
                const response = await fetch("http://localhost:3001/", {
                    method: "GET",
                    headers: {
                        "authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    console.log("invalid token");
                    return;
                }
                const user = await response.json();
                console.log(user);
                if (user.length > 0) {
                    setUser(user[0]);
                } 
                else {
                    console.log("No user found in response");
                }
            } catch (error) {
                console.log("error in my profile.jsx:", error);
            }        };
        fetchUserData();
    }, []);
    useEffect(() => {
        const fetchPastJobs = async () => {
            if (!user || !user.email) return;

            const input = {
                email: user.email
            };

            try {
                const response = await fetch("http://localhost:3001/pastjobs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(input)
                });

                const dataPastJobs = await response.json();
                if (dataPastJobs !== null) {
                    console.log(dataPastJobs);
                    setData(dataPastJobs);
                }
            } catch (error) {
                console.error("error sending data:", error);
            }
        };

        fetchPastJobs();
    }, [user]); 
    const fetchCurrentJobs = async () => {
        if (!user || !user.email) return;

        const input = {
            email: user.email
        };

        try {
            const response = await fetch("http://localhost:3001/currentjobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            const dataCurrentJobs = await response.json();
            if (dataCurrentJobs !== null) {
                console.log(dataCurrentJobs);
                setDataCurrent(dataCurrentJobs);
            }
        } catch (error) {
            console.error("error sending data:", error);
        }
    };

    useEffect(() => {
        fetchCurrentJobs();
    }, [user]);

    useEffect(() => {
    const fetchPurchasedJobs = async () => {
        if (!user || !user.email) return;

        try {
            const input = { email: user.email };
            const response = await fetch("http://localhost:3001/purchasedjobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            const jobList = await response.json();
            if (jobList !== null && Array.isArray(jobList)) {
                setDataPurchased(jobList);

                const detailedJobs = await Promise.all(
                    jobList.map(async (item) => {
                        const res = await fetch("http://localhost:3001/getjobfromid", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ id: item.job_id })
                        });

                        const job = await res.json();
                        return job[0];
                    })
                );

                setDetailedPurchasedJobs(detailedJobs);
            }
        } catch (error) {
                console.error("error fetching purchased jobs:", error);
         }
        };

        fetchPurchasedJobs();
    }, [user]);

    const goToBook = () => {
        navigate('/bookjob', { state: {email: user.email, name: user.name}});
    };
    const goToSearch = () => {
        navigate('/searchusers', { state: {email: user.email}});
    };


    let skills = [];
    if (user && typeof user.skills === 'string') {
        skills = user.skills.split(',').map(skill => skill.trim());
    }
    skills.pop();

    const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:3001/", {
            method: "GET",
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            if (userData.length > 0) {
                setUser(userData[0]);
            }
        }
    } catch (error) {
        console.log("Failed to refresh user:", error);
    }
    };

    const refreshAll = async () => {
        await refreshUser();
        fetchCurrentJobs();
    };


    return (
        <>
        <h1 className={styles.welcomeHeader}> {user ? `Welcome, ${user.name}!` : "Loading..."} </h1>
        <div className={styles.containerBig}>
        <div className={styles.myProfileTopInfo}>
            <div className={styles.points}>
                <h1 className={[styles.pointsInfo, styles.numberOfPoints].join(" ")}>{user ? user.points : "error"}</h1>
                <h1 className={styles.pointsInfo}>points</h1>
            </div>
            <div className={styles.skills}>
                <div className={styles.addInfo}>
                    <p className={styles.mySkillsTag}>My Skills:</p>
                    <button className={styles.buttonItemThree} onClick={() => handleOpenModalAdd(user.email)}>Add Skill</button>
                </div>
                <div className={styles.unorderedList}>
                    <ul>
                    { skills && skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <p style={{paddingLeft: 20}}>Past jobs...</p>
            <ul className={styles.unorderedListPast}>
            { dataPastJobs && dataPastJobs.map(item => (
                <li className={[styles.listItem, styles.listItemTwo].join(" ")} onClick={() => handleOpenModalJob(item)} key={item.id}>{item.title}</li>
            ))}
            </ul>
        </div>
        <div className={styles.currentJobs}>
            <p style={{paddingLeft: 20}}>Current jobs...</p>
            <ul className={styles.unorderedListPast}>
                <li className={styles.listItem} onClick={() => handleOpenModal(user)}><img src={plus} className={styles.plusSign}/></li>
            { dataCurrentJobs && dataCurrentJobs.map(item => (
                <li className={[styles.listItem, styles.listItemTwo].join(" ")} onClick={() => handleOpenModalJob(item)} key={item.id}>{item.title}</li>
            ))}            
            </ul>
        </div>
        <div>
            <p style={{paddingLeft: 20}}>Purchased jobs...</p>
            <ul className={styles.unorderedListPast}>
                { detailedPurchasedJobs && detailedPurchasedJobs.map((item, index) => (<li className={[styles.listItem, styles.listItemTwo].join(" ")} onClick={() => handleOpenModalJob(item)} key={index}>
                {item.title}</li>
        ))}        
            </ul>
        </div>
        <button onClick={goToBook} className={styles.buttonItemFour}>Book a job</button>
        <button onClick={goToSearch} className={styles.buttonItemFive}>Search Users</button>
        </div>
        {openModal && <Modal value={selectedValue} onClose={handleCloseModalJob}/>}
        {showModal && <ModalJob value={selectedValue} onClose={handleCloseModal} onJobAdded={refreshAll}/>}
        {addModal && <ModalAdd value={selectedValue} onClose={handleCloseModalAdd} onSkillAdded={refreshUser}/>}
        </>
    )
}