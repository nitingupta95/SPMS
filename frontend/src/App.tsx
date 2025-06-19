import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ContactForm from './components/ConatactForm';
import About from './components/About';
import Home from './components/Home';
import AddStudent from './components/student/AddStudent';
import EditStudent from './components/student/EditStudent';
import StudentProfile from './components/student/StudentProfile';
import { Login } from './components/Login';
import { Signup } from './components/Signup';

function App() {
  return (
    <div className="m-0 p-0 bg-[#F9F6EE] min-h-screen">
      <Navigation />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/add" element={<AddStudent />} />
          <Route path="/:studentId" element={<EditStudent />} />
          <Route path="/profile/:studentId" element={<StudentProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
