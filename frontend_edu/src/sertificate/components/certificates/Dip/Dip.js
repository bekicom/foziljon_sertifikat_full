import React, { useContext } from "react";
import './style.css'
import QRCode from "react-qr-code";
import { AuthContext } from "../../../context/AuthContext";
import diplomaBackground from './2024-07-03 12.18.17.jpg';

const DipCertificat = React.forwardRef((props, ref) => {
  const { URL } = useContext(AuthContext);

  const {
    lastname,
    firstname,
    other,
    id,

    givenDate
  } = props.obj;
  return (
    <div className="certificat_ContainerEng" ref={ref}>
      <img
        className="diplomaBackground"
        src={diplomaBackground}
        alt=""
        aria-hidden="true"
      />
      <div className="containerDip">

        <h3 className="engID4">
          {id}
        </h3>
        <h3 className="engID5">
          {id}

          </h3>

        <div className="lineFullname oneName">
          <h4>
            {firstname}  {lastname} 
         
            </h4>
        </div>
        <div className="lineFullname oneName1">
          <h4>
            {other}
            </h4>
        </div>
        <div className="lineFullname oneName2">
          <h4>
            {other}

            </h4>
        </div>
        <div className="lineFullname twuName">
          <h4>
            {firstname}  {lastname} 


            </h4>
        </div>

        <div className="givenDate1">
          <h4>
            {givenDate}

            </h4>
        </div>

        <div className="givenDate2">
          <h4 >
            {givenDate}

          
            </h4>
        </div>

        <div className="QRCodedip1">
          <QRCode value={`${URL}/check/${encodeURIComponent(id)}`} />
        </div>

        <div className="QRCodedip2">
          <QRCode value={`${URL}/check/${encodeURIComponent(id)}`} />
        </div>
      </div>

    </div>

  );
});

export default DipCertificat;
