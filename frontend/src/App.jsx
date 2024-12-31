import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AllDoctor from './components/AllDoctors/AllDoctor';
import Doctor from './components/Doctor/Doctor';
import DoctorRegister from './components/DoctorRegister/DoctorRegister';
import DoctorLogin from './components/DoctorLogin/DoctorLogin';
import UserRegister from './components/UserRegister/UserRegister';
import UserLogin from './components/UserLogin/UserLogin';
import Footer from './components/Footer/Footer';
import User from './components/User/User';
import UserAppointments from './components/UserAppointments/UserAppointments';
import DoctorProfile from './components/DoctorProfile/DoctorProfile';
import DoctorAppointments from './components/DoctorAppointments/DoctorAppointments';
import Checkout from './components/BookingProcess/Checkout';
import FinancialReport from './components/BookingProcess/FinancialReport';
import DoctorReport from './components/BookingProcess/DoctorReport';
import Confirmation from './components/BookingProcess/Confirmation';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AllDoctor />} />
        <Route path="/all-doctors" element={<AllDoctor />} />
        <Route path="/doctor/:doctorId" element={<Doctor />} />
        <Route path='/register-doctor' element={<DoctorRegister />} />
        <Route path = '/doctor-login' element={<DoctorLogin />} />
        <Route path = '/register-user' element={<UserRegister />} />
        <Route path='/user-login' element ={<UserLogin />} />
        <Route path='/profile' element ={<User />} />  
        <Route path='/user-appointments' element ={<UserAppointments />} />
        <Route path='/d-profile' element ={<DoctorProfile />} />
        <Route path='/appointments' element ={<DoctorAppointments />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/patient/:patientId/financial-report" element={<FinancialReport />} /> {/* Route for financial report */}
        <Route path="/doctor/:doctorId/report" element={<DoctorReport />} /> {/* Route for doctor report */}
        <Route path="/confirmation" element={<Confirmation />} />
        {/* <Route path='/financial-report' element={<FinancialReport />} /> */}
        {/* <Route path="/register" element={<Register />} />
        
        <Route path="/wallet" element={<Wallet />} /> */}
      </Routes>
      <Footer />
      </Router>
  );
};

export default App;
