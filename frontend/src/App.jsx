// App.jsx
import LandingPage from "./Home/index.jsx";
import ProductPage from "./ProductPage.jsx";
import SignIn from "./Profile/Signin.jsx";
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Home/navbar.jsx";
import { ThemeProvider } from './Home/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Signin" element={<SignIn />} />
          <Route path="/Products" element={<ProductPage />}/>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
