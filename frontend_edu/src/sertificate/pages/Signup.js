
import { useContext, useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate()
  const { isLoading, setIsLoading } = useContext(AuthContext)
  const [visible, setVisible] = useState(false)

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
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        required
      />
      <label>Password:</label>
      <div className="login_password">
        <input
          type={`${visible ? "text" : "password"}`}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {visible ? <AiFillEyeInvisible onClick={() => setVisible(!visible)} className="aye_svg" /> : <AiFillEye onClick={() => setVisible(!visible)} className="aye_svg" />}
      </div>
      <label>Ismi:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
      />
      <label>Familiya:</label>
      <input
        type="text"
        onChange={(e) => setLastname(e.target.value)}
        value={lastname}
        required
      />
      <label>Telefon raqam:</label>
      <input
        type="number"
        onChange={(e) => setNumber(e.target.value)}
        value={number}
        required
      />
      <label>Fani:</label>
      <select required onChange={(e) => setSubject(e.target.value)} >
        <option value="">O'quv fanini tanglang!</option>
        <option value="it">Dasturlash</option>
        <option value="eng">Ingliz tili</option>
        <option value="ru">Rus tili</option>
        <option value="math">Matematika</option>
        <option value="chemistry">Kimyo</option>
        <option value="law">Huquq</option>
      </select>

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup