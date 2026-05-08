import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import { useAuthContext } from '../../hooks/useAuthContext';

const Header = () => {
    const { user } = useAuthContext()

    return (
        <div className="header">
            <h2>Yagona Buxgalteriya</h2>
            {user ? (<>
                <NavLink to={"/admin/dasturlash"}>
                    <button className="order-btn">Tizimga kirish</button>
                </NavLink>
            </>
            ) : (
                <Link to="/login">
                    <button className="order-btn">Login</button>
                </Link>
            )}
        </div>

    )
}
export default Header;




// import React from 'react'
// import { Link, NavLink } from 'react-router-dom';
// import './Header.css';

// const Header = () => {
//     const token = localStorage.getItem('userSert');

//     return (
//         <div className="header">
//             <h2>Yagona Buxgalteriya</h2>
//             {token ? (<>
//                 {/* <button className='header_logout' onClick={logout}>Log out</button> */}
//                 <NavLink to={"/admin/dasturlash"}>
//                     <button className="order-btn">Tizimga kirish</button>
//                 </NavLink>
//             </>
//             ) : (
//                 <Link to="/login">
//                     <button className="order-btn">Login</button>
//                 </Link>
//             )}
//         </div>

//     )
// }
// export default Header;