// App.jsx
import LandingPage from "./Home/index.jsx";
import ProductPage from "./ProductPage/ProductPage.jsx";
import SignIn from "./Profile/Signin.jsx";
import {HashRouter, Routes, Route} from 'react-router-dom';
import Navbar from "./Home/navbar.jsx";
import {ThemeProvider} from './Home/ThemeContext';
import {AuthProvider} from "./GlobalVariables/AuthContext.jsx";
import {UserProvider} from "./GlobalVariables/UserContext.jsx";
import UserHome from "./Home/UserPortal/UserHome.jsx";
import ManageRobot from "./Home/UserPortal/ManageRobot.jsx";

function App() {
    return (
        <UserProvider>
        <AuthProvider>
            <ThemeProvider>
                <HashRouter>
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<LandingPage/>}/>
                        <Route path="/Signin" element={<SignIn/>}/>
                        <Route path="/Products" element={<ProductPage/>}/>
                        <Route path="/UserHome" element={<UserHome/>}/>
                        <Route path="/ManageRobot/:userId/:robotId" element={<ManageRobot />} />
                    </Routes>
                </HashRouter>
            </ThemeProvider>
        </AuthProvider>
        </UserProvider>

    );
}

export default App;
