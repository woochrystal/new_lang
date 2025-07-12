import {useLocation, useNavigate} from 'react-router-dom';
function Nav(props){
    const navigate = useNavigate();
    const location = useLocation();
    const navList = [
        {},
    ]
    return(
        <div className='navWrap'>
            <nav>
                <ul>
                    <li>테스트1</li>
                </ul>
            </nav>
        </div>
    )
}
export default Nav;