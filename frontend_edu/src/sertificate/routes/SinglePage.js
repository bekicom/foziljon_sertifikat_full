import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Logo from '../assets/main/IMGBaner.png'



function Single() {

  let data = JSON.parse(sessionStorage.getItem('data')) || {}
  console.log(data);
  return (
    <div className="pdf_Cont">
      <div className="darft_container ">
        <div className="boxDarft">
          <Link to="/" className="main_pageLink">
            <FiArrowLeft /> Asosiy
          </Link>
          <i></i>
        </div>

        {
          data?.map((data, inf) => {
            return (
              <div key={inf} className="pdf_Box">
                <div className="pdf_banner">
                  <div className="pdf_banner_img">
                    <div className="pdf_bannerImgBox">
                      <img src={Logo} alt="" />
                    </div>
                    <h1>Algorithm <br /> Education center</h1>

                  </div>


                  <div className="by">
                    <i>The following details are confirmed by:</i> <br />
                    <i><b>Algoritm21.uz</b></i>
                  </div>
                </div>
                <div className="pdf_main">
                  <p>Fullname</p>
                  <b>
                    {data?.name}  {data?.surname}
                  </b>
                </div>
                <div className="pdf_main">
                  <p>Catigory</p>
                  <b>
                    {data?.courseName}
                  </b>
                </div>
                <div className="pdf_main">
                  <p>ID </p>
                  <b>

                    {data?.id}
                  </b>

                </div>
                <div className="pdf_main">
                  <p>Given date</p>
                  <b>

                    {data?.givenDate}
                  </b>
                </div>

                <div className="pdf_main">
                  <p>Teacher's name</p>
                  <b>
                    {data?.teachername}
                  </b>
                </div>

                <div className="pdf_main pdf-text">
                  <p>© Algoritm Education, 2023 All rights reserved.</p>
                </div>

              </div>
            )
          })
        }


      </div >
    </div >
  );

}

export default Single;
