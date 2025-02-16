
import LandingPage from "./LandingPage.jsx";
import ProductPage from "./ProductPage.jsx";
import SignIn from "./Signin.jsx";
import Navbar from "./navbar.jsx";
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
          <HashRouter>
              <Navbar />
              {/* Route Definitions */}
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/Signin" element={<SignIn />} />
                  <Route path="/Products" element={<ProductPage />}/>
              </Routes>
          </HashRouter>

  )
}

export default App
