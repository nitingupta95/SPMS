import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

function Navigation() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));

  useEffect(() => {
    // Whenever storage changes (even from other tabs), update username
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }; 

    window.addEventListener("storage", handleStorageChange);
    // Also check once on component mount
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-br from-sky-300 to-gray-300 p-4 font-bold text-xl flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2 cursor-pointer">
        <img
          className="h-8 w-8"
          src="https://img.icons8.com/?size=100&id=jldAN67IAsrW&format=png&color=000000"
          alt="icon"
        />
        <span>SPMS</span>
      </Link>

      <nav className="flex items-center gap-x-4">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
          }
        >
          Contact Us
        </NavLink>

        {username ? (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <Button variant="destructive" className="cursor-pointer" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md transition ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
                }
              >Login
               </NavLink>

            <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md transition ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
                }
              >Signup
               </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navigation;
