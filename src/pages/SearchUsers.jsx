import styles from './SearchUsers.module.css'
import React, { useState, useLocation } from 'react'
import ModalRate from './components/ModalRate';
import { useNavigate } from 'react-router-dom';


export function SearchUsers() {
    const [values, setValues] = useState({});
    const [userData, setUserData] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const navigate = useNavigate();

    const handleOpenModal = (value) => {
        setSelectedValue(value);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };


    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            email: values.email
        };

        try {
            const response = await fetch("http://localhost:3001/getuserfromemail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            const data = await response.json();
            if (data) {
                console.log(data);
                setUserData(data[0]);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUserData(null);
        }
    };
    const refreshUser = async () => {
        const inputTwo = {
            email: values.email
        };
        try {
            const response = await fetch("http://localhost:3001/getuserfromemail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputTwo)
            });
            if (response.ok) {
                const userData = await response.json();
                if (userData.length > 0) {
                    setUserData(userData[0]);
                }
            }
        } catch (error) {
            console.log("Failed to refresh user:", error);
        }
    };
    let skills = [];
    if (userData && typeof userData.skills === 'string') {
        skills = userData.skills.split(',').map(skill => skill.trim());
    }
    skills.pop();

    const goToBook = () => {
        navigate('/bookjob');
    };
    const goToProfile = () => {
        navigate('/myprofile');
    };



    return (
        <>
            <h1>Search User</h1>
            <div>
                <form className={styles.modalContainer} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor="email">Email<sup>*</sup></label>
                    <br/>
                    <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="email" placeholder="Email" name="email" onChange={handleChanges} required/>
                    <button className={styles.buttonItem} type="submit">
                        Search
                    </button>
                </form>
            </div>

            {userData && (
                <div className={styles.userBox}>
                    <p>Email: {userData.email}</p>
                    <p>Skills: {skills.join(', ')}</p>
                    <p onClick={() => handleOpenModal(userData)}>Rate: {userData.rate}</p>
                </div>
            )}
            <div className={styles.buttonBottomLeft}>
                <button onClick={goToBook} className={styles.buttonItemFour}>Book a job</button>
                <button onClick={goToProfile} className={styles.buttonItemFive}>My Profile</button>
            </div>
            {openModal && <ModalRate value={selectedValue} onClose={handleCloseModal} onRateAdded={refreshUser}/>}
        </>
    );
}