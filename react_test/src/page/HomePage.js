import {useLocation, useNavigate} from 'react-router-dom';
function HomePage(props){
    const navigate = useNavigate();
    const location = useLocation();
    return(
        <div>
            <nav>
                <ul>
                    {
                        // menuItem.map((index, item)=>{
                        //     console.log(index, item)
                        // })
                    }
                    {/* <li><link></link></li> */}
                </ul>
            </nav>
        </div>
    )
}
export default HomePage;