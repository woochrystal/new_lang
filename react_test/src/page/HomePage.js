import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Nav from './Nav'

function HomePage(props){
    return(
        <div className='main_page'>
            <Nav/>
        </div>
    )
}
export default HomePage;