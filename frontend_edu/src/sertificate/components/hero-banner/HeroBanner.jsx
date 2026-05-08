import React, { useEffect, useState, useRef } from "react";
import "./HeroBanner.css";
import { FiSearch, FiDownload } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import axios from '../../api/api';
import hero_banner from "../../assets/main/bg.png";
import Header from "../header/Header";
import ReactToPrint from 'react-to-print';
import Cert from '../certificates/Sert/Cert';
import DipCertificat from '../certificates/Dip/Dip';

const HeroBanner = () => {
  const componentRef = useRef();
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedID, setSelectedID] = useState("S0001");

  useEffect(() => {
    if (searchValue.trim().length) {
      axios
        .get(`/certificate/check/${searchValue.trim()}`)
        .then(response => setData([response.data]))
        .catch(() => setData([]));
    } else {
      setData([]);
    }
  }, [searchValue]);

  const searchedData = data.filter(item => item?.id === searchValue.trim());
  sessionStorage.setItem("data", JSON.stringify(searchedData));

  const TableRow = ({ obj }) => {
    const {
      firstname,
      lastname,
      other,
      givenDate,
      courseName,
      _id,
      id,
      prosent,
    } = obj;

    return (
      <table border={1} className="SearchPDF" key={_id}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Familiya Ism Otasining ismi</th>
            <th>Yuklab olish</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{id}</td>
            <td>{`${lastname} ${firstname} ${other}`}</td>
            <td>
              <ReactToPrint
                trigger={() => (
                  <button onFocus={() => setSelectedID(_id)} className="driverTab">
                    <FiDownload /><span>PDF</span>
                  </button>
                )}
                content={() => componentRef.current}
              />
            </td>
          </tr>
        </tbody>
        <tfoot style={{ display: "none" }}>
          {courseName === "cert" && _id === selectedID ? (
            <Cert
              ref={componentRef}
              obj={{ idD: _id, id, prosent, firstname, lastname, courseName, other, givenDate }}
            />
          ) : courseName === "dip" && _id === selectedID ? (
            <DipCertificat
              ref={componentRef}
              obj={{ idD: _id, id, prosent, firstname, lastname, courseName, other, givenDate }}
            />
          ) : null}
        </tfoot>
      </table>
    );
  };

  return (
    <div className="bannerHero">
      <Header />
      <div className="heroBanner">
        <div className="heroBanner-left">
          <h1 className="heroBanner-title">Yagona buxgalteriya rasmiy diplom va sertifikatlari</h1>
          <div className="imgBanerMobile">
            <img src={hero_banner} alt="heroBanner-images" />
          </div>
          <div className="checker_wrapper">
            <input
              id="certificate_number"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="ID raqamingizni kiriting"
              className="check_certificate-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <FiSearch />
          </div>
          {searchValue ? (
            <div className="studentResult">
              {searchedData.length ? (
                searchedData.map(item => (
                  <TableRow key={item._id} obj={item} />
                ))
              ) : (
                <div className="Loadin">
                  <h3 className="Load">Loading<span className="Load_1">.</span><span className="Load_2">.</span><span className="Load_3">.</span></h3>
                </div>
              )}
            </div>
          ) : (
            <div className="imgBox">
              <img src="https://media2.giphy.com/media/IzWnWcZHgGVaR3vglp/giphy.gif?cid=ecf05e47nya1o7uxhopxiaahv84cb3dphxwifktoy8ut9tci&ep=v1_gifs_search&rid=giphy.gif&ct=g" alt="placeholder" />
            </div>
          )}
        </div>
        <div className="imgBaner">
          <img src={hero_banner} alt="heroBanner-images" />
        </div>
        <div className="bottomBG"></div>
      </div>
      <Outlet />
    </div>
  );
};

export default HeroBanner;
