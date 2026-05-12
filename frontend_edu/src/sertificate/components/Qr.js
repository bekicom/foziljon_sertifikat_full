import React, { useContext } from 'react'
import QRCode from "react-qr-code";
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Qr() {
    const { path = "" } = useParams();
    const { URL } = useContext(AuthContext);
    const val = `${URL}/${path.replace(/^\/+/, "")}`;

    return (
        <div>
            <div className="qr" style={{ background: "red" }}>
                <QRCode style={{ background: "red" }} className='qrcode' value={val} />
            </div>
        </div>
    )
}

export default Qr
