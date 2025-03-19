import Footer from "./components/Footer";
import {Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Account from './pages/Account';
import Story from './pages/Story';
import LogIn from "./pages/LogIn";

function App() {
  return (
      
      <BrowserRouter>
        <Header />
        <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/story" element={<Story/>}/>
          <Route path="/login" element={<LogIn />}/>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
      
  )
}

export default App;
