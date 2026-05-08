import { useAuthContext } from './useAuthContext'
import { toast } from 'react-toastify';

export const useLogout = () => {
  const { dispatch } = useAuthContext()


  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    toast.success("Muvaffaqqiyatli saytdan chiqdingiz!", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  return { logout }
}