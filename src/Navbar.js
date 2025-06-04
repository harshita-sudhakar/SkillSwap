import styles from './Navbar.css';

export default function Navbar () {
    return (
        <div>
            <nav className="nav">
                <a href="/" className="siteTitle">SkillSwap</a>
                <ul>
                    <li><a href="/#/bookjob">Book a Job</a></li>
                    <li><a href="/#/myprofile">My Profile</a></li>
                </ul>
            </nav>
        </div>
    );
}
