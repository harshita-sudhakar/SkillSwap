import React, {useRef} from 'react'
import {X} from 'lucide-react'
import styles from './Modal.module.css'
function ModalBook ({value, buyerEmail, onClose}) {
    const modalRef = useRef();

    const {valueOne, email} = value;

    const closeModal = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            giver_email: value.user_email,
            buyer_email: buyerEmail,
            job_id: value.id
        };

        console.log(value)

        try {
            const response = await fetch("http://localhost:3001/transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            const data = await response.json();
            if (data !== null) {
                value.is_taken = 1;
                console.log(data);
            }
            onClose();
        } catch (error) {
            console.error("error sending data:", error);
        }

        const inputThree = {
            id: value.id
        };

        console.log(value)

        try {
            const response = await fetch("http://localhost:3001/updateistaken", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputThree)
            });

            const data = await response.json();
            if (data !== null) {
                value.is_taken = 1;
                console.log(data);
            }
        } catch (error) {
            console.error("error sending data:", error);
        }

        const inputTwo = {
            points: value.points_asked,
            email: buyerEmail,
        };

        console.log(value)

        try {
            const response = await fetch("http://localhost:3001/updatepoints", {
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
        } catch (error) {
            console.error("error sending data:", error);
        }
    };

    return (
        <div onClick = {closeModal}className={styles.modalBackground} ref={modalRef}>
            <div className={styles.modalContainer} onSubmit={handleSubmit}>
                <form>
                    <button onClick={onClose} className={styles.titleCloseBtn}><X size={30}/></button>
                    <h1>{value.title}</h1>
                    <p>{value.job_description}</p>
                    <p>{value.points_asked}</p>
                    <button type="submit" className={styles.buttonItem}>Book</button>
                </form>
            </div>
        </div>
    )
}

export default ModalBook;