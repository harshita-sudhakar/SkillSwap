import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import styles from './BookJob.module.css';
import ModalBook from './components/ModalBook';
import { useNavigate } from 'react-router-dom';


export function BookJob () {
    const location = useLocation();
    const {email, name} = location.state || {};

    const [openModal, setOpenModal] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const navigate = useNavigate();

    const handleOpenModal = (value, valueTwo) => {
        setSelectedValue(value);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };


    const [data, setData] = useState([]);

    
    
    useEffect(() => {
        const fetchJobs = async () => {
            const input = {
                email: email,
            };

            try {
                const response = await fetch("http://localhost:3001/getjobs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(input)
                });

                const data = await response.json();
                if (data !== null) {
                    console.log(data);
                }
                setData(data);
            } catch (error) {
                console.error("error sending data:", error);
            }
        };

        if (email) {
            fetchJobs();
        }
    }, [email]);
    const goToSearch = () => {
        navigate('/searchusers');
    };
    const goToProfile = () => {
        navigate('/myprofile');
    };

    return (
        <>
        <h1>Book a job!</h1>
            <div className={styles.container}>
            {data.map(item => (<div key={item.id} className={styles.indivJob}>
                <p className={styles.title}>{item.title}</p> 
                <p className={styles.description}>{item.job_description}</p>
                <p className={styles.name}>{item.name}</p> 
                <p className={styles.bookNow} onClick={() => handleOpenModal(item)}>Book it now!</p> 
            </div>))}
            {openModal && <ModalBook value = {selectedValue} buyerEmail={email} onClose={handleCloseModal}/>}
            </div>
            <div className={styles.buttonBottomLeft}>
                <button onClick={goToSearch} className={styles.buttonItemFour}>Search Users</button>
                <button onClick={goToProfile} className={styles.buttonItemFive}>My Profile</button>
            </div>
        </>
    )
}