import { useState } from 'react';
import styles from './SignUp.module.css';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload on submit

    const input = {
      name: values.firstname + " " + values.lastname,
      email: values.email,
      username: values.username,
      password: values.password
    };

    try {
      const response = await fetch("http://localhost:4001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const data = await response.text();
      console.log("response from backend:", data);
      navigate("/login")
    } catch (error) {
      console.error("error sending data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Get started with SkillSwap!</h1>
      <form onSubmit={handleSubmit} className = {styles.form}>
        <label className={styles.label} htmlFor="name">Name<sup>*</sup></label>
        <div className={styles.fullname}>
          <input className={styles.inputBox} type="text" placeholder="First name" name="firstname" onChange={handleChanges} required/>
          <input className={styles.inputBox} type="text" placeholder="Last name" name="lastname" onChange={handleChanges} required/>
        </div>
        <br/>
        <br/>
        <label className={styles.label} htmlFor="email">Email<sup>*</sup></label>
        <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="email" placeholder="Email" name="email" onChange={handleChanges} required/>
        <br/>
        <br/>
        <label className={styles.label} htmlFor="username">Username<sup>*</sup></label>
        <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="text" placeholder="Username" name="username" onChange={handleChanges} required/>
        <br/>
        <br/>
        <label className={styles.label} htmlFor="password">Password<sup>*</sup></label>
        <input className={[styles.inputBox, styles.inputBoxTwo].join(" ")} type="password" placeholder="Password" name="password" onChange={handleChanges} required/>
        <br/>
        <br/>
        <button className={styles.buttonItemTwo} type="submit">Create account!</button>
      </form>
      <p>Already have an account? Click <a href='/#/login'>here</a> to log in.</p>
    </div>
  )
}
