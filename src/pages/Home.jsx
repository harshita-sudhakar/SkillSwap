import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export function Home () {
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };
    const goToSignUp = () => {
        navigate('/signup');
    };
    return (
        <div>
            <h1>Home!</h1>
            <button onClick={goToLogin} className={styles.buttonItemFour}>Login</button>
            <button onClick={goToSignUp} className={styles.buttonItemFour}>Sign Up</button>
        </div>
    )
}