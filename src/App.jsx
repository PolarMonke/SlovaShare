import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import AccountPage from './pages/AccountPage';
import Story from './pages/Story';
import LogIn from "./pages/LogIn";
import EditAccount from "./pages/EditAccount";
import Footer from "./components/Footer";
import NewStoryForm from "./pages/NewStoryForm";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StoryPage from './pages/StoryPage';
import EditStoryPage from './pages/EditStoryPage';


function AppContent() {

  const { loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn />}/>
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account/:id" element={<AccountPage />} />
          <Route path="/account/:id/edit" element={<EditAccount />} />
          <Route path="/story/" element={<Story/>}/>
          <Route path="/story/:id" element={<StoryPage/>}/>
          <Route path="/story/new" element={<NewStoryForm/>}/>
          <Route path="/story/:id/edit" element={<EditStoryPage/>}/>
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;