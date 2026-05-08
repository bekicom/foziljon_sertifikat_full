import React, { useEffect, useState, useRef, useMemo } from "react";
import "./style.css";
import axios from "../../api/api";
import ReactToPrint from "react-to-print";
import { FiDownload } from "react-icons/fi";
import { BsFillTrashFill } from "react-icons/bs";
import { Input, Tabs } from "antd";
import LoadingTruck from "../loading/LoadingTruck";
import Cert from "../certificates/Sert/Cert";
import DipCertificat from "../certificates/Dip/Dip";

const { Search } = Input;

const History = () => {
  const componentRef = useRef();
  const [printData, setPrintData] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleteCertId, setDeleteCertId] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Ma'lumotlarni yuklash
  useEffect(() => {
    axios
      .get("/certificate/all")
      .then((response) => setData(response?.data || []))
      .catch((err) => console.log(err));
  }, []);

  // Qidiruv bo‘yicha filtrlash
  const filteredData = useMemo(() => {
    const lowercasedValue = searchQuery.toLowerCase();
    return data
      .filter(
        (item) =>
          item.firstname?.toLowerCase().includes(lowercasedValue) ||
          item.lastname?.toLowerCase().includes(lowercasedValue) ||
          item.other?.toLowerCase().includes(lowercasedValue) ||
          item.id?.toLowerCase().includes(lowercasedValue) ||
          item.courseName?.toLowerCase().includes(lowercasedValue)
      )
      .reverse(); // Eng oxirgi qo'shilganlarni oldinga qo'yish
  }, [data, searchQuery]);

  // Sertifikatni o'chirish funksiyasi
  const deleteCertificate = (id) => {
    if (id) {
      axios
        .delete(`/certificate/delete/${id}`)
        .then(() => {
          setData((prevData) => prevData.filter((cert) => cert._id !== id));
          setModal(false);
        })
        .catch((err) => console.log(err));
    }
  };

  // Har bir qator uchun komponent
  const TableRow = ({ obj }) => {
    const {
      firstname,
      lastname,
      other,
      _id,
      id,
    } = obj;

    return (
      <tr key={_id}>
        <td>{id}</td>
        <td>
          {firstname} {lastname} {other}
        </td>
        <td>
          <ReactToPrint
            onBeforeGetContent={() =>
              new Promise((resolve) => {
                setPrintData(obj);
                setTimeout(resolve, 100);
              })
            }
            trigger={() => (
              <button
                className="driverTableBodyDelBtn driverTableBodyPDFBtn"
              >
                <FiDownload />
                <span>PDF</span>
              </button>
            )}
            content={() => componentRef.current}
          />
        </td>
        <td>
          <button
            onClick={() => {
              setModal(true);
              setDeleteCertId(_id);
            }}
            className="driverTableBodyDelBtn"
          >
            <BsFillTrashFill />
            <span> O'chirish</span>
          </button>
        </td>
      </tr>
    );
  };

  const PrintableCertificate = () => {
    if (!printData) return <div ref={componentRef}></div>;

    if (printData.courseName === "cert") {
      return <Cert ref={componentRef} obj={printData} />;
    }

    if (printData.courseName === "dip") {
      return <DipCertificat ref={componentRef} obj={printData} />;
    }

    return <div ref={componentRef}></div>;
  };

  return (
    <div className="allLicense">
      <div className="allLicenseContainer">
        <div className="SearchBar">
          <h1 className="allLicenseTitle">
            O'quvchining Sertifikatlar Ro'yhati
          </h1>
          <Search
            placeholder="Qidirish"
            allowClear
            size="middle"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="driverTableContainer">
          {filteredData.length > 0 ? (
            <>
              <Tabs defaultActiveKey="0">
                <Tabs.TabPane tab="Sertifikatlar" key="0">
                  <table className="driverTable">
                    <thead className="driverTableHead">
                      <tr>
                        <th>ID</th>
                        <th>FIO</th>
                        <th>PDF chiqarish</th>
                        <th>O'chirish</th>
                      </tr>
                    </thead>
                    <tbody className="driverTableBody">
                      {filteredData
                        .filter((item) => item.courseName === "cert")
                        .map((item) => (
                          <TableRow key={item._id} obj={item} />
                        ))}
                    </tbody>
                  </table>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Diplomlar" key="1">
                  <table className="driverTable">
                    <thead className="driverTableHead">
                      <tr>
                        <th>ID</th>
                        <th>FIO</th>
                        <th>PDF chiqarish</th>
                        <th>O'chirish</th>
                      </tr>
                    </thead>
                    <tbody className="driverTableBody">
                      {filteredData
                        .filter((item) => item.courseName === "dip")
                        .map((item) => (
                          <TableRow key={item._id} obj={item} />
                        ))}
                    </tbody>
                  </table>
                </Tabs.TabPane>
              </Tabs>
              {modal && (
                <div className="driverModalMain">
                  <div className="driverModalContainer">
                    <BsFillTrashFill />
                    <h3>Ishinchingiz komilmi?</h3>
                    <div>
                      <button onClick={() => deleteCertificate(deleteCertId)}>
                        Ha
                      </button>
                      <button onClick={() => setModal(false)}>Yo'q</button>
                    </div>
                  </div>
                  <div
                    onClick={() => setModal(false)}
                    className="driverModalHide"
                  ></div>
                </div>
              )}
              <div style={{ position: "absolute", left: "-10000px", top: 0 }}>
                <PrintableCertificate />
              </div>
            </>
          ) : (
            <LoadingTruck />
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
