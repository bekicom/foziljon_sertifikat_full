import React, { useContext, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import "./style.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import axios from '../../api/api';
import Loading from '../loading/Loading';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiDownload, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
import { customAlphabet } from 'nanoid';
import Cert from "../certificates/Sert/Cert";
import DipCertificat from "../certificates/Dip/Dip";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import moment from 'moment';

const ItPdf = () => {
  const { setIsLoading, setSensor } = useContext(AuthContext);
  const navigate = useNavigate();
  const componentRef = useRef();
  const [newCertificate, setNewCertificate] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [show, setShow] = useState(true);
  const [prosent, setProsent] = useState("");
  const [courseName, setCourseName] = useState("");
  const [id, setId] = useState('');
  const [fullname, setFullname] = useState("");
  const [nameObject, setNameObject] = useState({ firstname: "", lastname: "", other: "" });

  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 6);


  const handleInputChange = (e) => {
    setFullname(e.target.value);
  };

  const processName = (name) => {
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return { firstname: nameParts[0], lastname: "", other: "" };
    } else if (nameParts.length === 2) {
      return { firstname: nameParts[0], lastname: nameParts[1], other: "" };
    } else {
      return {
        firstname: nameParts[0],
        lastname: nameParts[1],
        other: nameParts.slice(2).join(" "),
      };
    }
  };



  const view = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const enteredFullname = String(formData.get("fullname") || "").trim();
    const enteredCourseName = String(formData.get("courseName") || "");
    const enteredDate = String(formData.get("givenDate") || "");
    const enteredProsent = String(formData.get("prosent") || "");

    if (
      !enteredFullname ||
      !enteredCourseName ||
      !enteredDate ||
      (enteredCourseName === "cert" && !enteredProsent)
    ) {
      toast.warn("Bo'sh joylarni to'ldiring!");
      return;
    }

    const formattedDate = moment(enteredDate, "YYYY-MM-DD", true).format("DD/MM/YYYY");
    if (formattedDate === "Invalid date") {
      toast.warn("Sanani to'g'ri kiriting!");
      return;
    }

    setFullname(enteredFullname);
    setCourseName(enteredCourseName);
    setSelectedFromDate(formattedDate);
    setProsent(enteredProsent);
    setNameObject(processName(enteredFullname));
    setId(nanoid());
    setShow(false);
    setTimeout(() => setSensor(true), 1000);
  };

  const goBack = () => setShow(true);

  const createCertificate = async () => {
    if (newCertificate) return;

    setNewCertificate(true);
    setIsLoading(true);
    const certificateData = {
      firstname: nameObject.firstname,
      lastname: nameObject.lastname,
      other: nameObject.other,
      courseName: courseName,
      givenDate: selectedFromDate,
      id: id,
      prosent: prosent,
    };

    try {
      await axios.post("/certificate", certificateData);
      toast.success("Sertifikat muvaffaqiyatli qayd etildi");
      navigate("/admin/historyPdf");
    } catch (err) {
      const message = err.response?.data?.error || "Sertifikatni qayd etishda xato yuz berdi";
      toast.error(message);
      console.error(err);
    } finally {
      setNewCertificate(null);
      setIsLoading(false);
    }
  };

  const FilterCertificate = () => {
    if (courseName === "dip") {
      return <DipCertificat obj={{
        lastname: nameObject.lastname,
        firstname: nameObject.firstname,
        other: nameObject.other,
        courseName,
        id,
        givenDate: selectedFromDate,
        prosent,
        pdf_class: "pdf_mainContainer",
      }} />
    } else if (courseName === "cert") {
      return <Cert
        obj={{
          lastname: nameObject.lastname,
          firstname: nameObject.firstname,
          other: nameObject.other,
          courseName,
          givenDate: selectedFromDate,
          prosent,
          id,
          pdf_class: "pdf_mainContainer",
        }} />
    }
  }

  const PdfCertificate = () => {
    if (courseName === "dip") {
      return <DipCertificat ref={componentRef}
        obj={{
          name: fullname,
          courseName,
          prosent,
          id,
          givenDate: selectedFromDate,
        }} />
    } else if (courseName === "cert") {
      return <Cert ref={componentRef}
        obj={{
          name: fullname,
          courseName,
          prosent,
          id,
          givenDate: selectedFromDate,
        }} />
    }
  }




  return (
    <>
      <div style={show ? { display: "block" } : { display: "none" }}>
        <div className="pdf_formMain">
          <h1 className="pdf_formMainTitle">
            SERTIFIKAT
          </h1>
          <p className="pdf_formMainDesc">
            <FiAlertCircle className="iconsM" />
            SERTIFIKAT yaratish uchun quyidagi ma'lumotlarni kiritish zarur! Sertifikatni ko'rish tugmasi orqali SERTIFIKAT ni namunasini ko'rasiz.
          </p>
          <div className="pdf_formContainer">
            <form className="pdf_form" onSubmit={view}>
              <div className="pdf_formFISH">
                <div className="pdf_formFISHitem">
                  <label htmlFor="">FIO</label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Familya, Ism, Otasining ismi"
                    className="pdf_inputFISH"
                    required
                    value={fullname} onChange={handleInputChange}
                  />
                </div>

              </div>

              <div className="pdf_formFISH">
                <div className="pdf_formFISHitem">
                  <label htmlFor="">Daraja</label>
                  <div className="RusEng">
                    <select
                      placeholder=""
                      className="pdf_inputFISHCat"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      name="courseName"
                      required
                    >
                      <option value="" disabled hidden>Kategoriyani tanlang!</option>
                      <option value="cert">Sertifikat</option>
                      <option value="dip">Diplom</option>
                    </select>
                    <input
                      onChange={(e) => setProsent(e.target.value)}
                      name="prosent"
                      value={prosent}
                      required={courseName === "cert"}
                      min="0"
                      max="100"
                      className={`pdf_inputFISHRus 
                        ${courseName === "cert"
                          ? "rusopen"
                          : "pdf_inputFISHRus"
                        }`}
                      placeholder="Ballni kiriting (Foizda)"
                      type="number"
                    />
                  </div>
                </div>
                <div className="pdf_formFISHitem">
                  <label htmlFor="">Berilgan sanasi</label>
                  <input
                    className="pdf_inputFISH"
                    name="givenDate"
                    required
                    type="date"
                  />
                </div>
              </div>

              <div className="pdf_formFISH">

                <div className="pdf_formFISHitem">
                  <input className="pdf_viewBtn" type="submit" value="Sertifikatni ko'rish" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        style={!show ? { display: "block" } : { display: "none" }}
        className="pdf_page"
      >
        <FilterCertificate />

        <div className="pdf_controllersWrapper">
          <button type="button" className="pdf_controllers" onClick={goBack}> <FiChevronLeft /> Orqaga</button>
          <button
            type="button"
            className="pdf_controllers"
            onClick={createCertificate}
            disabled={Boolean(newCertificate)}
          >
            {newCertificate ? <Loading /> : <FiSave />} Sertifikatni qayd etish
          </button>
          <ReactToPrint
            trigger={() => <button className="pdf_controllers"> <FiDownload /> Yuklab olish</button>}
            content={() => componentRef.current}
          />
        </div>

        <div style={{ display: "none" }}>
          <PdfCertificate />
        </div>
      </div>
    </>
  );
};

export default ItPdf;















// import React, { useContext, useRef, useState } from "react";
// import ReactToPrint from "react-to-print";
// import "./style.css";
// import "react-modern-calendar-datepicker/lib/DatePicker.css";
// import axios from '../../api/api';
// import Loading from '../loading/Loading';
// import { useNavigate } from 'react-router-dom';
// import { FiSave, FiDownload, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
// import { customAlphabet } from 'nanoid';
// import Cert from "../certificates/Cert/cert";
// import DipCertificat from "../certificates/Dip/Dip";
// import { AuthContext } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import moment from 'moment';

// const ItPdf = () => {
//   const { setIsLoading, setSensor } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const componentRef = useRef();
//   const [newCertificate, setNewCertificate] = useState(null);
//   const [selectedFromDate, setSelectedFromDate] = useState("");
//   const [teacherName, setTeacherName] = useState("");
//   const [show, setShow] = useState(true);
//   const [name, setName] = useState("");
//   const [prosent, setProsent] = useState("");
//   const [surname, setSurname] = useState("");
//   const [courseName, setCourseName] = useState("");

//   const alphabet = '0123456789';
//   const nanoid = customAlphabet(alphabet, 6);

//   const [id, setId] = useState('');

//   const view = (e) => {
//     e.preventDefault();
//     setTimeout(() => {
//       setSensor(true);
//     }, 1000);

//     if (name === "" || surname === "" || teacherName === "" || courseName === "" || selectedFromDate === "") {
//       toast.warn("Bo'sh joylarni to'ldiring!");
//     } else {
//       setId(nanoid());
//       setShow((prev) => !prev);
//     }
//   };

//   const createCertificate = async () => {
//     setNewCertificate(true);
//     setIsLoading(true);

//     await axios
//       .post("certificate", {
//         name: name,
//         surname: surname,
//         teachername: teacherName,
//         courseName: courseName,
//         givenDate: selectedFromDate,
//         id: id,
//         prosent: prosent,
//       })
//       .then((res) => {
//         navigate("/admin/historyPdf");
//         setNewCertificate(null);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//         console.log(err);
//       });
//   };

//   const FilterCertificate = () => {
//     if (courseName === "dip") {
//       return <DipCertificat obj={{
//         name,
//         surname,
//         teacherName,
//         courseName,
//         id,
//         givenDate: selectedFromDate,
//         prosent,
//         pdf_class: "pdf_mainContainer",
//       }} />
//     } else if (courseName === "cert") {
//       return <Cert
//         obj={{
//           name,
//           surname,
//           teacherName,
//           courseName,
//           givenDate: selectedFromDate,
//           prosent,
//           id,
//           pdf_class: "pdf_mainContainer",
//         }} />
//     }
//   }

//   const PdfCertificate = () => {
//     if (courseName === "dip") {
//       return <DipCertificat ref={componentRef}
//         obj={{
//           name,
//           surname,
//           courseName,
//           prosent,
//           id,
//           givenDate: selectedFromDate,
//         }} />
//     } else if (courseName === "cert") {
//       return <Cert ref={componentRef}
//         obj={{
//           name,
//           surname,
//           courseName,
//           prosent,
//           id,
//           givenDate: selectedFromDate,
//         }} />
//     }
//   }

//   return (
//     <>
//       <div style={show ? { display: "block" } : { display: "none" }}>
//         <div className="pdf_formMain">
//           <h1 className="pdf_formMainTitle">
//             SERTIFIKAT
//           </h1>
//           <p className="pdf_formMainDesc">
//             <FiAlertCircle className="iconsM" />
//             SERTIFIKAT yaratish uchun quyidagi ma'lumotlarni kiritish zarur! Sertifikatni ko'rish tugmasi orqali SERTIFIKAT ni namunasini ko'rasiz.
//           </p>
//           <div className="pdf_formContainer">
//             <form className="pdf_form" onSubmit={view}>
//               <div className="pdf_formFISH">
//                 <div className="pdf_formFISHitem">
//                   <label htmlFor="">Ism</label>
//                   <input
//                     type="text"
//                     placeholder="Ism"
//                     className="pdf_inputFISH"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </div>
//                 <div className="pdf_formFISHitem">
//                   <label htmlFor="">Familiya</label>
//                   <input
//                     type="text"
//                     placeholder="Familiya"
//                     className="pdf_inputFISH"
//                     required
//                     value={surname}
//                     onChange={(e) => setSurname(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="pdf_formFISH">
//                 <div className="pdf_formFISHitem">
//                   <label htmlFor="">Daraja</label>
//                   <div className="RusEng">
//                     <select placeholder="" className="pdf_inputFISHCat" onChange={(e) => setCourseName(e.target.value)} name="" id="">
//                       <option value="" disabled selected hidden>Kategoriyani tanlang!</option>
//                       <option value="cert">Sertifikat</option>
//                       <option value="dip">Diplom</option>
//                     </select>
//                     <input
//                       onChange={(e) => setProsent(e.target.value)}
//                       className={`pdf_inputFISHRus
//                         ${courseName === "cert"
//                           ? "rusopen"
//                           : "pdf_inputFISHRus"
//                         }`}
//                       placeholder="Ballni kiriting (Foizda)"
//                       type="number"
//                     />
//                   </div>
//                 </div>
//                 <div className="pdf_formFISHitem">
//                   <label htmlFor="">Berilgan sanasi</label>
//                   <input
//                     className="pdf_inputFISH"
//                     onChange={(e) => {
//                       const selectedDate = e.target.value;
//                       const today = moment().format('DD/MM/YYYY');
//                       const formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : today;
//                       setSelectedFromDate(formattedDate);
//                     }}
//                     type="date"
//                   />
//                 </div>
//               </div>

//               <div className="pdf_formFISH">
//                 <div className="pdf_formFISHitem">
//                   <input
//                     type="text"
//                     placeholder="O'qituvchi ism familyasi"
//                     className="pdf_inputFISH"
//                     required
//                     value={teacherName}
//                     onChange={(e) => setTeacherName(e.target.value)}
//                   />
//                 </div>
//                 <div className="pdf_formFISHitem">
//                   <input className="pdf_viewBtn" type="submit" value="Sertifikatni ko'rish" />
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <div
//         style={!show ? { display: "block" } : { display: "none" }}
//         className="pdf_page"
//       >
//         <FilterCertificate />

//         <div className="pdf_controllersWrapper">
//           <button className="pdf_controllers" onClick={view}> <FiChevronLeft /> Orqaga</button>
//           <button className="pdf_controllers" onClick={createCertificate}> {newCertificate ? <Loading /> : <FiSave />} Setifikatni qayd etish</button>
//           <ReactToPrint
//             trigger={() => <button className="pdf_controllers"> <FiDownload /> Yuklab olish</button>}
//             content={() => componentRef.current}
//           />
//         </div>

//         <div style={{ display: "none" }}>
//           <PdfCertificate />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ItPdf;











