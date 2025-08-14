import {useLocation, useNavigate} from 'react-router-dom';
import styles from '../main.module.scss';
// import {Link} from 'react';
function Nav(props){
    const navigate = useNavigate();
    const location = useLocation();
    let navList = [
        {txt:'메뉴1'},
        {txt:'메뉴2'},
        {txt:'메뉴3'},
        {txt:'메뉴4'},
    ]
    return(
        <div className='navWrap'>
            <nav>
                <ul className={styles.listNav}>
                    {navList.map((item, index) => (
                        <li key={index}>
                            {item.txt}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
export default Nav;