import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { EventProvider } from '@/context/EventContext';
import { Toaster } from 'react-hot-toast';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import CreateEvent from '@/pages/CreateEvent';
import EventDetails from '@/pages/EventDetails';
import MyEvents from '@/pages/MyEvents';
import EditEvent from '@/pages/EditEvent';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/edit/:id" element={<EditEvent />} />
          </Routes>

          <Toaster 
            position="top-center" 
            containerStyle={{
              top: '75px',
            }}
          />

        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}