import React, {useState, useRef} from 'react'
import {X} from 'lucide-react'
import styles from './ModalJob.module.css'
import { GiSevenPointedStar } from 'react-icons/gi';
function ModalJob ({value, onClose, onJobAdded}) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    }

    const [values, setValues] = useState({
        title: '',
        description: '',
        price: 0,
    });

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            title: values.title,
            description: values.description,
            points: values.price,
            email: value.email,
            name: value.name
        };

        try {
        const response = await fetch("http://localhost:3001/postjob", {
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
        if (onJobAdded) {
            await onJobAdded();
        }
        onClose();
        } catch (error) {
        console.error("error sending data:", error);
        }
    };
    
    return (
        <div onClick = {closeModal}className={styles.modalBackground} ref={modalRef}>
          <form className = {styles.modalContainer} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="title">Title<sup>*</sup></label>
            <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="text" placeholder="Title" name="title" onChange={handleChanges} required/>
            <br/>
            <br/>
            <label className={styles.label} htmlFor="description">Description<sup>*</sup></label>
            <textarea className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="text" placeholder="Description" name="description" onChange={handleChanges} required/>
            <br/>
            <br/>
            <label className={styles.label} htmlFor="price">Price<sup>*</sup></label>
            <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="number" placeholder="Price" name="price" onChange={handleChanges} required/>
            <br/>
            <br/>
            <button className={styles.buttonItemTwo} type="submit">Post job!</button>
          </form>
        </div>
    )
}

export default ModalJob;