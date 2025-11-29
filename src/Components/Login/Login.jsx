import React, { useState } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import axios from 'axios';
import Logo from '../../images/photo_2025-08-11_07-51-02-removebg-preview.png'

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      const Data = {
        username: username,
        password: password
      }
      const response = await axios.post(`api/v1/auth/login`, Data)
      Swal.fire({
        title: 'Xush kelibsiz!',
        icon: 'success',
        timer: 2000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      localStorage.setItem(`token`, response?.data?.data?.token)
      localStorage.setItem('isAuthenticated', true)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      Swal.fire({
        title: 'Xato!',
        text: 'Login yoki parol noto‘g‘ri',
        icon: 'error',
        timer: 3000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-md">
        <div className='flex items-center justify-center'>
          <img className='w-[200px]' src={Logo} alt="Foto" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              // placeholder="Admin"
              className="text-black"
              crossOrigin={undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parol
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                // placeholder="Admin123"
                className="text-black"
                crossOrigin={undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="h-5 w-5" />
                ) : (
                  <VisibilityIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button
            onClick={handleLogin}
            className="w-full bg-MainColor text-white font-semibold py-2 rounded hover:bg-gray-800"
          >
            Kirish
          </Button>
        </div>
      </div>
    </div>
  );
}
