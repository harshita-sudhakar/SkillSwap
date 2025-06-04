import { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login ({history}) {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload on submit

        const input = {
            email: values.email,
            password: values.password
        };

        try {
        const response = await fetch("http://localhost:4001/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        });

        const data = await response.json();
        if (data !== null) {
          localStorage.setItem("token", data.accessToken);
          console.log(data.accessToken);
          navigate('/myprofile')
        }
        } catch (error) {
        console.error("error sending data:", error);
        }
    };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Welcome back to SkillSwap!</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label} htmlFor="email">Email<sup>*</sup></label>
        <input className={styles.inputBox} type="email" placeholder="Enter email" name="email" onChange={handleChanges} required/>
        <br/>
        <br/>
        <label className={styles.label} htmlFor="password">Password<sup>*</sup></label>
        <input className={styles.inputBox} type="password" placeholder="Enter password" name="password" onChange={handleChanges} required/>
        <br/>
        <br/>
        <button className={styles.buttonItem} type="submit">Submit</button>
      </form>
      <p>New to SkillSwap? Create account <a href='/#/signup'>here</a>.</p>
    </div>
  )
}

export default Login;