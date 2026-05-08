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
  const [error, setError] = useState(null);
  const componentRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`certificate/check/${id}`);
        setData(response.data);
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Sertifikat topilmadi. Iltimos, ID ni tekshirib qaytadan urinib ko'ring.");
        } else {
          setError("Sertifikatni olishda xatolik. Iltimos, qaytadan urinib ko'ring.");
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, setIsLoading]);

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


