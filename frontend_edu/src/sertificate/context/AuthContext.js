import { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sensor, setSensor] = useState(false)
  const [saveData, setSavaData] = useState("")
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({ type: 'LOGIN', payload: user })
    }
  }, [])

  const URL = "https://yagonabuxgalter.vercel.app/"

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading, setIsLoading, sensor, setSensor, URL, setSavaData, saveData }}>
      {children}
    </AuthContext.Provider>
  )

}