import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BusPassForm from './pages/BusPassForm';
import TicketDetails from './pages/TicketDetails';  

import { Toaster } from 'react-hot-toast';
import Buses from './pages/Buses';
import ProfileScreen from './pages/Profile';
import DailyPass from './pages/DailyPass';
import ViewPass from './pages/ViewPass';
import ViewTickets from './pages/ViewTickets';
import RouteTimeTable from './pages/RouteTimeTable';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply-pass" element={<BusPassForm />} />
          <Route path="/ticket-details" element={<TicketDetails />} />  
          <Route path="/buses" element={<Buses />} />
           <Route path="/profile" element={<ProfileScreen />} />
           <Route path="/daily-pass" element={<DailyPass />} />
           <Route path="/viewpass" element={<ViewPass />} />
            <Route path="/view-tickets" element={<ViewTickets />} />
            <Route path="/routetimetable" element={<RouteTimeTable />} />
             <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
