import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/api";
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import './Draft.css';
import { AuthContext } from "../../context/AuthContext";
import ReactToPrint from 'react-to-print';
import Cert from "../../components/certificates/Sert/Cert";
import DipCertificat from "../../components/certificates/Dip/Dip";
import bug from './bug.jpg';

function Draft() {
  const { setIsLoading } = useContext(AuthContext);
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    other: '',
    courseName: '',
    prosent: '',
    id: '',
    givenDate: ''
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [canRetry, setCanRetry] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const componentRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setCanRetry(false);

      // Server "uyqudan" uyg'onayotganda birinchi so'rov xato berishi mumkin: 3 martagacha qayta uriniladi
      for (let attempt = 1; attempt <= 3 && !cancelled; attempt++) {
        try {
          const response = await axios.get(`/certificate/check/${id}`);
          if (!cancelled) setData(response.data);
          break;
        } catch (error) {
          console.error(error);

          if (error.response?.status === 404) {
            if (!cancelled) setErrorMessage("Sertifikat topilmadi.");
            break;
          }

          if (attempt === 3) {
            if (!cancelled) {
              setErrorMessage("Server bilan aloqa yo'q. Qayta urinib ko'ring.");
              setCanRetry(true);
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          }
        }
      }

      setIsLoading(false);
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey, setIsLoading]);

  const PdfCertificate = () => {
    if (data.courseName === "dip") {
      return <DipCertificat ref={componentRef}
        obj={data} />
    } else if (data.courseName === "cert") {
      return <Cert ref={componentRef}
        obj={data} />
    }
    return null;
  }

  return (
    <div className="pdf_Cont">
      <div className="boxDraft">
        <Link to="/" className="main_pageLink">
          <FiArrowLeft /> Asosiy
        </Link>
        <div className="draft_container">
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />

        <div id="qrBarBox" className={`pdf_Box ${data.firstname ? 'show' : 'hide'}`}>

          <br />
          <p>Sertifikatni yuklab olish uchun quyidagi tugmani bosing.</p>
          <ReactToPrint
            trigger={() => <button className="pdf_controllers"> <FiDownload /> Yuklab olish</button>}
            content={() => componentRef.current}
          />
        </div>
        <div style={{ display: "none" }}>
          <PdfCertificate />
        </div>
        {errorMessage && (
          <div className="pdf_Box show">
            <p>{errorMessage}</p>
            {canRetry && (
              <button className="pdf_controllers" onClick={() => setReloadKey((key) => key + 1)}>
                Qayta urinish
              </button>
            )}
          </div>
        )}
      </div>
      <br />
      <br />


      <div className="pdf_main pdf-text">
        <p>© Yagona Buxgalteriya, 2024 Barcha huquqlar himoyalangan.</p>
      </div>
      <div className="imgLogo">
        <img src={bug} alt="" />
      </div>
    </div>
  );
}

export default Draft;


