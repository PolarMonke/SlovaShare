import Footer from "./components/Footer";
import {Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Account from './pages/Account';
import AccountPage from './pages/AccountPage';
import Story from './pages/Story';
import LogIn from "./pages/LogIn";
import EditAccount from "./pages/EditAccount";

function App() {
  return (
      
      <BrowserRouter>
        <Header />
        <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LogIn />}/>
          <Route path="/account" element={<Account/>}/>
            <Route path="/account/:id" element={<AccountPage />} />
              <Route path="/account/:id/edit" element={<EditAccount />} />
          <Route path="/story" element={<Story/>}/>
          
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
      
  )
}

export default App;
