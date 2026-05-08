import { useContext, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const { user, dispatch } = useAuthContext();
  const { isLoading, setIsLoading } = useContext(AuthContext)


  const signup = async (username, password, name, lastname, number, subject) => {
    setIsLoading(true);
    setError(null);

    if (!user.role === "root" || !username || !lastname || !password || !number || !subject || !name) {
      alert("user root admin bolishi kerak")
    } else {
      try {
        const response = await axios.post('/user/register', {
          username, password, name, lastname, number, subject
        }, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.status !== 200) {
          setIsLoading(false);
          setError(response.data.error);
        } else {
          const json = response.data;
          toast.success("Muvaffaqqiyatli ro'yhatdan o'tdingiz!", {
            position: toast.POSITION.TOP_RIGHT
          });
          // Save the user to local storage
          localStorage.setItem('user', JSON.stringify(json));

          // Update the auth context
          dispatch({ type: 'LOGIN', payload: json });

          // Update loading state
          setIsLoading(false);
        }
      } catch (error) {
        let errors = error.response.data?.slice(7)
        setIsLoading(false);
        toast.error(errors, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }

  };

  return { signup, isLoading, error };
};
