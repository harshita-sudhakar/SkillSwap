/*import React, {useRef, useState} from 'react'
import {X} from 'lucide-react'
import styles from './ModalRate.module.css'
function ModalAdd ({value, onClose, onSkillAdded}) {
    const modalRef = useRef();
    const [values, setValues] = useState({
        rate: 0.0
    });

    let number = value.rate;

    const closeModal = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    }
    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            email: value.email
        };

        console.log(value)

        number = number * value.rateNumber;
        number += parseFloat(values.rate);

        try {
        const response = await fetch("http://localhost:3001/updateratenumber", {
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
        data = data[0];
        } catch (error) {
        console.error("error sending data:", error);
        }

        number = number/value.rateNumber;
        console.log(number);

        const inputTwo = {
            email: value.email,
            rate: number

        };

        try {
        const response = await fetch("http://localhost:3001/updatenumber", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputTwo)
        });
        const data = await response.json();
        if (data !== null) {
            console.log(data);
        }
        data = data[0];
        } catch (error) {
        console.error("error sending data:", error);
        }
    };



    return (
        <div onClick = {closeModal}className={styles.modalBackground} ref={modalRef} onSubmit={handleSubmit}>
          <form className = {styles.modalContainer}>
            <label className={styles.label} htmlFor="title">Rate<sup>*</sup></label>
            <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="number" placeholder="Skill" name="rate" onChange={handleChanges} required/>
            <br/>
            <button className={styles.buttonItem} type="submit">Rate</button>
          </form>
        </div>
    )
}

export default ModalAdd;*/
import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import styles from './ModalAdd.module.css';

function ModalRate({ value, onClose, onRateAdded }) {
    const modalRef = useRef();
    const [values, setValues] = useState({
        rate: 0.0
    });

    const closeModal = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    };

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEmail = value.email;
        const userRate = parseFloat(value.rate);
        const userRateNumber = parseFloat(value.rateNumber);
        const newRate = parseFloat(values.rate);

        const newRateNumber = userRateNumber + 1;
        const updatedRate = ((userRate * userRateNumber) + newRate) / newRateNumber;

        try {
            const rateNumberResponse = await fetch("http://localhost:3001/updateratenumber", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail })
            });
            await rateNumberResponse.json();
        } catch (error) {
            console.error("Error updating rate number:", error);
        }

        try {
            const rateResponse = await fetch("http://localhost:3001/updatenumber", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    rate: updatedRate
                })
            });
            const rateData = await rateResponse.json();
            console.log("Updated rate:", rateData);
        } catch (error) {
            console.error("Error updating rate:", error);
        }

        if (onRateAdded) {
            onRateAdded();
        }

        onClose();
    };
    

    return (
        <div onClick={closeModal} className={styles.modalBackground} ref={modalRef}>
            <form className={styles.modalContainer} onSubmit={handleSubmit}>
                <label className={styles.label} htmlFor="rate">Rate<sup>*</sup></label>
                <input
                    className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="number" step="0.1" min="0" max="5" placeholder="Rate 0-5" name="rate"
                    onChange={handleChanges}
                    required
                />
                <br />
                <button className={styles.buttonItem} type="submit">Rate</button>
            </form>
        </div>
    );
}

export default ModalRate;
