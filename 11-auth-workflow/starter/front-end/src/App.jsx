import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {
  Home,
  Error,
  Register,
  Login,
  Verify,
  Dashboard,
  ProtectedRoute,
  ForgotPassword,
  ResetPassword,
} from './pages';
import Navbar from './components/Navbar';
import { useGlobalContext } from './context';
function App() {
  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return (
      <section className='page page-center'>
        <div className='loading'></div>
      </section>
    );
  }
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        
        <Route path='/' element={ <Home />} />
        <Route path='/login' element={ <Login />} />
        <Route path='/register' element={ <Register />} />
        <Route path='/dashboard' element={ <Dashboard />} />
        <Route path='/forgot-password' element={ <ForgotPassword />} />
        <Route path='/user/verify-email' element={ <Verify />} />
        <Route path='/user/reset-password' element={ <ResetPassword />} />
        <Route path='*' element={ <Error />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
