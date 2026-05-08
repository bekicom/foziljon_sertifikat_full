import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";

function Qr({ match }) {
    const [val, setVal] = useState("")
    useEffect(() => {
        setVal(prev => prev = "https://yagonabuxgalter.vercel.app/" + match.params.path)
    }, [match])
    return (
        <div>
            <div className="qr" style={{ background: "red" }}>
                <QRCode style={{ background: "red" }} className='qrcode' value={val} />
            </div>
        </div>
    )
}

export default Qr
