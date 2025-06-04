import React, {useRef, useState} from 'react'
import {X} from 'lucide-react'
import styles from './ModalAdd.module.css'
function ModalAdd ({value, onClose, onSkillAdded}) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    }

    const [values, setValues] = useState({
        skill: '',
    });

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            email: value,
            skill: values.skill
        };

        console.log(value)

        try {
        const response = await fetch("http://localhost:3001/addskill", {
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
        if (onSkillAdded) {
            onSkillAdded();
        }
        if (onClose) {
            onClose();
        }

        } catch (error) {
        console.error("error sending data:", error);
        }
    };

    return (
        <div onClick = {closeModal}className={styles.modalBackground} ref={modalRef}>
          <form className = {styles.modalContainer} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="title">Skill<sup>*</sup></label>
            <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="text" placeholder="Skill" name="skill" onChange={handleChanges} required/>
            <br/>
            <button className={styles.buttonItem} type="submit">Add skill!</button>
          </form>
        </div>
    )
}

export default ModalAdd;