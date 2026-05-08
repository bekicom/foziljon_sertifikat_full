import React, { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import "./Login.css";
import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom"
import axios from '../../api/api';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [eyeOpen, setEyeOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post('/auth/login', formData);
      const json = response.data;

      // Handle successful login
      if (response.status === 200) {
        toast.success("Muvaffaqqiyatli saytga kirdingiz!");
        localStorage.setItem('user', JSON.stringify(json));
        localStorage.setItem('userSert', json.token);
        window.location.href = "/admin/dasturlash"
        navigate("/admin/dasturlash"); // navigate to home page
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error.response?.data?.error || 'Noma`lum xato yuz berdi';
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="login">
      <h1>Tizimga kirish uchun login <br /> parolingizni kiriting!</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="login__input">
          <div className="iconreg">
            <BsPerson />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Foydalanuvchi ismingiz"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="login__input">
          <div className="iconreg">
            <RiLockPasswordLine />
          </div>
          <input
            type={eyeOpen ? "password" : "text"}
            name="password"
            placeholder="Foydalanuvchi parolingiz"
            value={formData.password}
            onChange={handleChange}
          />
          <span onClick={() => setEyeOpen(!eyeOpen)} className="eye">{eyeOpen ? <BsEyeSlashFill /> : <BsEyeFill />}</span>
        </div>

        <button disabled={isLoading} className="logbtn" type="submit">Tizimga kiring</button>
        <Link to="/">
          <button disabled={isLoading} className="btnOutLog" type="submit">Asosiy sahifa</button>
        </Link>
      </form>
    </div>
  );
}

export default Login;
















// import React, { useState } from "react";
// import { BsPerson } from "react-icons/bs";
// import { RiLockPasswordLine } from "react-icons/ri";
// import "./Login.css";
// import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs'
// import { Link } from "react-router-dom"
// import axios from '../../api/api';
// import { toast } from 'react-toastify';

// function Login() {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [eyeOpen, setEyeOpen] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);


//   const handleSubmit = async (value) => {
//     console.log(value);
//     try {
//       setIsLoading(true)
//       const response = await axios.post('/auth/login', value);
//       const json = response.data;

//       // Handle successful login
//       if (response.status === 200) {
//         toast.success("Muvaffaqqiyatli saytga kirdingiz!");

//         localStorage.setItem('user', JSON.stringify(json));
//       } else {
//         console.log(response.data.error);
//       }
//     } catch (error) {
//       setIsLoading(false)
//       const errorMessage = error.response?.data?.error || 'Noma`lum xato yuz berdi';
//       setError(errorMessage);
//     }
//   };
//   return (
//     <div className="login">
//       <h1>Tizimga kirish uchun login <br /> parolingizni kiriting!</h1>
//       {error && <div className="error">{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="login__input">
//           <div className="iconreg">
//             <BsPerson />
//           </div>
//           <input
//             type="text"
//             placeholder="Foydalanuvchi ismingiz"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>

//         <div className="login__input">
//           <div className="iconreg">
//             <RiLockPasswordLine />
//           </div>
//           <input
//             type={eyeOpen ? "password" : "text"}
//             placeholder="Foydalanuvchi parolingiz"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <span onClick={() => setEyeOpen(!eyeOpen)} className="eye">{eyeOpen ? <BsEyeSlashFill /> : <BsEyeFill />}</span>
//         </div>

//         <button disabled={isLoading} className="logbtn" type="submit">Tizimga kiring</button>
//         <Link to="/">
//           <button disabled={isLoading} className="btnOutLog" type="submit">Asosiy sahifa</button>
//         </Link>
//       </form>
//     </div>
//   );
// }

// export default Login;


