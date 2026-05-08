import React, { useContext } from "react";
import './style.css';
import Bux from './img/buxred.png';
import p1 from './img/p1.png';
import p2 from './img/p2.png';
import QRCode from "react-qr-code";
import { AuthContext } from "../../../context/AuthContext";

const Cert = React.forwardRef((props, ref) => {
    const { URL } = useContext(AuthContext);

    // Destructure with default values to prevent errors if props.obj is undefined
    const {
        firstname = '',
        lastname = '',
        other = '',
        id = '',
        prosent = '',
        givenDate = ''
    } = props.obj || {};

    return (

        <div className="certificate" ref={ref}>
            <div className="certificate-inner">
                <br />
                <h2>"YAGONA BUXGALTERIYA" MChJ</h2>
                <div className="borderTop">
                    <h1>SERTIFIKAT</h1>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="idBox">
                    <h2> N° ATB </h2>
                    <h2>{id}</h2>
                </div>

                <div className="bor">
                    <h2> {firstname} {lastname}   {other}</h2>
                    <b>ga</b>
                </div>
                <div className="Border">
                    <div className="border_box">
                        <div className="border_box_right">
                            <b>"Buxgalteriya: 1C" o'quv kurslarini</b>
                        </div>
                        <div className="border_box_right1"></div>
                        <div className="border_box_right2"></div>
                    </div>
                </div>

                <p>
                    Muvaffaqiyatli tamomlagani uchun berildi. <br />
                    U buxgalteriya kurslarini 96 soat dars mashg'ulotlarida<br /> o'qidi va yakuniy imtihonni <b className="prosent">{prosent}</b> % ko'rsatkich
                    bilan yakunladi.<br />
                    Bitiruvchi O'zbekiston hududida korxona va barcha turdagi<br /> tadbirkorlik subyektlarida buxgalter
                    (hisobchi)<br /> lavozimida faoliyat yuritishi mumkin.
                </p>
                <div className="signature">
                    <p>"Yagona buxgalteriya" <br /> MChJ direktori</p>
                    <div className="pech">
                        <img className="" src={p2} alt="Stamp" />
                    </div>
                    <img className="pech_img" src={p1} alt="" />
                    <p>F. JALOLIDINOV</p>
                </div>

                <div className="QRBOX">
                    <QRCode value={`${URL}/check/${id}`} />
                </div>
                <div className="sanaBoz">
                    <b>{givenDate}</b>
                    <b>BERILGAN VAQT SANA</b>
                </div>
            </div>

            <div className="our"></div>
            <div className="our2"></div>
            <div className="our3"></div>
            <div className="our4"></div>
            <div className="our5"></div>
            <img width="330" className="imageLogo" src={Bux} alt="" />
        </div>

    )
})

export default Cert;


