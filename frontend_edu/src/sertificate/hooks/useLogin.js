

// import { useContext, useState } from 'react';
// import { useAuthContext } from './useAuthContext';
// import axios from '../api/api';
// import { AuthContext } from '../context/AuthContext';
// import { toast } from 'react-toastify';

// export const useLogin = () => {
//   const [error, setError] = useState(null);

//   const { isLoading, setIsLoading } = useContext(AuthContext)

//   const { dispatch } = useAuthContext();

//   const login = async (username, password) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post('/auth/login', {
//         username,
//         password
//       });
//       if (response.status !== 200) {
//         setIsLoading(false);
//         setError(response.data.error);

//       } else {
//         const json = response.data;
//         console.log(json);
//         toast.success("Muvaffaqqiyatli saytga kirdingiz!", {
//           position: toast.POSITION.TOP_RIGHT
//         });
//         // Save the user to local storage
//         localStorage.setItem('user', JSON.stringify(json));

//         // Update the auth context
//         dispatch({ type: 'LOGIN', payload: json });

//         // Update loading state
//         setIsLoading(false);
//       }
//     } catch (error) {
//       let errors = error.response.data?.slice(7)
//       setIsLoading(false);
//       toast.error(errors, {
//         position: toast.POSITION.TOP_RIGHT
//       });
//     }
//   };

//   return { login, isLoading, error };
// };
