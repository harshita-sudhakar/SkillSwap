import React, {useRef} from 'react'
import {X} from 'lucide-react'
import styles from './Modal.module.css'
function Modal ({value, onClose}) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    }
    return (
        <div onClick = {closeModal}className={styles.modalBackground} ref={modalRef}>
            <div className={styles.modalContainer}>
                <button onClick={onClose} className={styles.titleCloseBtn}><X size={30}/></button>
                <h1>{value.title}</h1>
                <p>{value.job_description}</p>
                <p>{value.points_asked} points</p>
                <p>{value.user_email}</p>
            </div>
        </div>
    )
}

export default Modal;