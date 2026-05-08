import { useContext, useState } from "react"
import { useSignup } from "../../hooks/useSignup"
import { BsPerson } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import "./style.css";
import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs'
import { IoIosPhonePortrait } from 'react-icons/io'
import { toast } from 'react-toastify';
import { AuthContext } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()
  const { isLoading, setIsLoading } = useContext(AuthContext)
  const [eyeOpen, setEyeOpen] = useState(false)

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [number, setNumber] = useState('')
  const [subject, setSubject] = useState('')
  const { signup, error } = useSignup()


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await signup(username, password, name, lastname, number, subject)
      .then(res => {
        navigate("/login")
        // console.log(res)
        toast.success("Muvaffaqiyatli ro`yhatdan otdingiz!", {
          position: toast.POSITION.TOP_CENTER
        });
        setIsLoading(false)

      })
      .catch(error => {
        // console.log(error)
        setIsLoading(false)
        toast.error("serverda xatolik bor", {
          position: toast.POSITION.TOP_LEFT
        });
      })
  }
  return (
    <div className="registerSer">
      <h1>O'qtuvchilarni ro'yhatdan o'tqazish!</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <div className="register__input">
          <div className="iconreg">
            <BsPerson />
          </div>
          <input
            type="text"
            placeholder="Firstname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="register__input">
          <div className="iconreg">
            <BsPerson />
          </div>
          <input
            type="text"
            placeholder="Lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="register__input">
          <div className="iconreg">
            <BsPerson />
          </div>
          <select required onChange={(e) => setSubject(e.target.value)} >
            <option value="">O'quv fanini tanglang!</option>
            <option value="it">Dasturlash</option>
            <option value="eng">Ingliz tili</option>
            <option value="ru">Rus tili</option>
            <option value="math">Matematika</option>
            <option value="chemistry">Kimyo</option>
            <option value="law">Huquq</option>
          </select>
        </div>
        <div className="register__input">
          <div className="iconreg">
            <IoIosPhonePortrait />
          </div>
          <input
            type="text"
            placeholder="Phone number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div className="register__input">
          <div className="iconreg">
            <BsPerson />
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="register__input">
          <div className="iconreg">
            <RiLockPasswordLine />
          </div>
          <input
            type={eyeOpen ? "password" : "text"}
            placeholder="Foydalanuvchi parolingiz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setEyeOpen(!eyeOpen)} className="eye">{eyeOpen ? <BsEyeSlashFill /> : <BsEyeFill />}</span>
        </div>

        <button disabled={isLoading} className="btnREG" type="submit">Ro'yhatga olish</button>
        <Link to="/admin/dasturlash">
          <button disabled={isLoading} className="btnOut" type="submit">Asosiy sahifa</button>
        </Link>
      </form>
    </div>
  );
}

export default Register;


