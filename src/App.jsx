import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import AccountPage from './pages/AccountPage';
import Story from './pages/Story';
import LogIn from "./pages/LogIn";
import EditAccount from "./pages/EditAccount";
import Footer from "./components/Footer";
import { useAuth } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LogIn />}/>
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account/:id" element={<AccountPage />} />
            <Route path="/account/:id/edit" element={<EditAccount />} />
            <Route path="/story" element={<Story/>}/>
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;