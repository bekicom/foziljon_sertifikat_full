
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./sertificate/context/AuthContext";
import { useAuthContext } from './sertificate/hooks/useAuthContext';
import { ToastContainer } from "react-toastify";
import Register from "./sertificate/pages/register/Register";
import History from "./sertificate/components/TableHistory/History";
import 'react-toastify/dist/ReactToastify.css';
import LoadingTruck from "./sertificate/components/loading/LoadingTruck";
import Qr from "./sertificate/components/Qr";
import ItPdf from "./sertificate/components/createCertificates/Create";
import HeroBanner from "./sertificate/components/hero-banner/HeroBanner";
import Login from "./sertificate/pages/login/Login";
import Draft from "./sertificate/routes/draft/Draft";
import Single from "./sertificate/routes/SinglePage";
import Admin from "./sertificate/routes/admin/Admin";

function App() {
  const { user } = useAuthContext();
  const { isLoading } = useContext(AuthContext);

  return (
    <>
      <div className="App">
        {/* <Draft /> */}
        <Routes>
          <Route path="/" element={<HeroBanner />} />
          <Route path="/qrcode/:path" element={<Qr />} />
          <Route path="/check/:id" element={<Draft />} />
          <Route path="/single/:id" element={user ? <Single /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={user ? <Register /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />}>
            <Route path="dasturlash" element={<ItPdf />} />
            <Route path="historyPdf" element={<History />} />
          </Route>
        </Routes>
      </div>

      <ToastContainer />
      {isLoading && <LoadingTruck />}
    </>
  );
}

export default App;

