import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./propertyDetail.css";
import Sidenav from "../../../components/sidebar/Sidenav";
import Navbar from "../../../components/navbar/Navbar";
import demo from "../../../assets/dashboard/demo.jpg";
import bucket from "../../../assets/dashboard/bucket.png";
import offer from "../../../assets/dashboard/offer.svg";
import SendSingleOfferModal from "../modals/SendSingleOfferModal";
import ImageModal from "../modals/ImageModal";
import backarrow from "../../../assets/propertyDetail/backarrow.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";

export default function PropertyDetail({ dataId, onBack, muiId }) {
  const navigate = useNavigate();
  const [comps, setComps] = useState([]);
  const [foreclosureInfo, setForeclosureInfo] = useState([]);
  const [mlsHistory, setMlsHistory] = useState([]);
  const [sale, setSale] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [property, setProperty] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [propertyImage, setPropertyImage] = useState([]);
  const { id } = useParams();
  const [loader, setloader] = useState(true);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleImageShow = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
  const [loading, setLoading] = useState(false);
  const [toastCheck, setToastCheck] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [idi, setIdi] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);

  const [savedOfferSent, setSavedOfferSent] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Owner Profile");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      // case "Comparable":
      //   return (
      //     <div className="comparable-section">
      //       <h2>Comparable</h2>
      //       <div className="comps-list">
      //         {comps.map((comp, index) => (
      //           // <div className="value-container mt-3">
      //           <div key={index} className="comp-item value-container mt-3">
      //             {/* <p className="value-text">comps</p> */}
      //             <div class="d-flex flex-row mt-3">
      //               <p class="field-text">Address:</p>
      //               <p class="field-value" title={comp.address || "No"}>
      //                 {comp.address || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">Bedrooms:</p>
      //               <p class="field-value">{comp.bedrooms || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Bathrooms:</p>
      //               <p class="field-value"> {comp.bathrooms || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Cash Buyer:</p>
      //               <p class="field-value">{comp.cashBuyer || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Company Name:</p>
      //               <p class="field-value" title={comp.companyName || "No"}>
      //                 {comp.companyName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Equity Percent:</p>
      //               <p class="field-value">{comp.equityPercent || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Estimated Value:</p>
      //               <p class="field-value">{comp.estimatedValue || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">ID:</p>
      //               <p class="field-value">{comp.id || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Last Sale Amount:</p>
      //               <p class="field-value">{comp.lastSaleAmount || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">LandUse:</p>
      //               <p class="field-value">{comp.landUse || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Last Sale Date:</p>
      //               <p class="field-value">{comp.lastSaleDate || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Latitude:</p>
      //               <p class="field-value">{comp.latitude || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">LenderName:</p>
      //               <p class="field-value" title={comp.lenderName || "No"}>
      //                 {comp.lenderName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Longitude:</p>
      //               <p class="field-value">{comp.longitude || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Mail Address:</p>
      //               <p class="field-value" title={comp.mailAddress || "No"}>
      //                 {comp.mailAddress || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">Lot Square Feet:</p>
      //               <p class="field-value" title={comp.lotSquareFeet || "No"}>
      //                 {comp.lenderName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Mls Days On Market:</p>
      //               <p class="field-value">{comp.mlsDaysOnMarket || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Mls Last Status Date:</p>
      //               <p
      //                 class="field-value"
      //                 title={comp.mlsLastStatusDate || "No"}
      //               >
      //                 {comp.lenderName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Mls Listing Date:</p>
      //               <p class="field-value">{comp.mlsListingDate || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Open Mortgage Balance:</p>
      //               <p
      //                 class="field-value"
      //                 title={comp.openMortgageBalance || "No"}
      //               >
      //                 {comp.lenderName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Owner1 Last Name:</p>
      //               <p class="field-value" title={comp.owner1LastName || "No"}>
      //                 {comp.owner1LastName || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">Property Id:</p>
      //               <p class="field-value">{comp.propertyId || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Property Type:</p>
      //               <p class="field-value">{comp.propertyType || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Property Use:</p>
      //               <p class="field-value" title={comp.propertyUse || "No"}>
      //                 {comp.propertyUse || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">propertyUseCode:</p>
      //               <p class="field-value">{comp.propertyUseCode || "No"}</p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">Square Feet:</p>
      //               <p class="field-value">{comp.squareFeet || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Year Built:</p>
      //               <p class="field-value">{comp.yearBuilt || "No"}</p>
      //             </div>
      //           </div>
      //           // <div key={index} className="comp-item">
      //           //   <h3>{comp.address}</h3>
      //           //   <p>Bedrooms: {comp.bedrooms}</p>
      //           //   <p>Bathrooms: {comp.bathrooms}</p>
      //           //   <p>Estimated Value: ${comp.estimatedValue}</p>
      //           //   <p>Last Sale Amount: ${comp.lastSaleAmount}</p>
      //           //   <p>Year Built: {comp.yearBuilt}</p>
      //           //   <p>Last Sale Amount: ${comp.lastSaleAmount}</p>
      //           //   <p>Year Built: {comp.yearBuilt}</p>
      //           // </div>
      //         ))}
      //       </div>
      //     </div>
      //   );

      // case "Sale & Loan":
      //   return (
      //     <div>
      //       <div className="comp-item  mt-3">
      //         {sale ? (
      //           <>
      //             <div class="d-flex flex-row mt-3">
      //               <p class="field-text">Buyer Names:</p>
      //               <p class="field-value" title={sale.buyerNames || "No"}>
      //                 {sale.buyerNames || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">Document Type:</p>
      //               <p class="field-value">{sale.documentType || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Document Type Code:</p>
      //               <p class="field-value">{sale.documentTypeCode || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Down Payment:</p>
      //               <p class="field-value">{sale.downPayment || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">LTV:</p>
      //               <p class="field-value">{sale.ltv || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Recording Date:</p>
      //               <p class="field-value">{sale.recordingDate || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Sale Amount :</p>
      //               <p class="field-value">{sale.saleAmount || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Sale Date:</p>
      //               <p class="field-value">{sale.saleDate || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Seller Names:</p>
      //               <p class="field-value" title={sale.sellerNames || "No"}>
      //                 {sale.sellerNames || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Seq No:</p>
      //               <p class="field-value">{sale.seqNo || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Transaction Type:</p>
      //               <p class="field-value">{sale.transactionType || "No"}</p>
      //             </div>
      //           </>
      //         ) : (
      //           <p>No sale information found</p>
      //         )}
      //       </div>
      //     </div>
      //   );
      // case "MLS":
      //   return (
      //     <div className="comparable-section">
      //       <h2>MLS</h2>
      //       <div className="comps-list">
      //         {mlsHistory.map((mls, index) => (
      //           <div key={index} className="comp-item value-container mt-3">
      //             {/* <p className="value-text">comps</p> */}
      //             <div class="d-flex flex-row mt-3">
      //               <p class="field-text">Property Id:</p>
      //               <p class="field-value" title={mls.propertyId || "No"}>
      //                 {mls.propertyId || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">Type:</p>
      //               <p class="field-value">{mls.type || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Price:</p>
      //               <p class="field-value"> {mls.price || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Beds:</p>
      //               <p class="field-value">{mls.beds || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Baths:</p>
      //               <p class="field-value" title={mls.baths || "No"}>
      //                 {mls.baths || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Days On Market:</p>
      //               <p class="field-value">{mls.daysOnMarket || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Agent Name:</p>
      //               <p class="field-value" title={mls.agentName || "No"}>
      //                 {mls.agentName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Agent Office:</p>
      //               <p class="field-value" title={mls.agentOffice || "No"}>
      //                 {mls.agentOffice || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Agent Phone:</p>
      //               <p class="field-value" title={mls.agentPhone || "No"}>
      //                 {mls.agentPhone || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Status:</p>
      //               <p class="field-value" title={mls.status || "No"}>
      //                 {mls.status || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Status Date:</p>
      //               <p class="field-value">{mls.statusDate || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Seq No:</p>
      //               <p class="field-value">{mls.seqNo || "No"}</p>
      //             </div>
      //           </div>
      //         ))}
      //       </div>
      //     </div>
      //   );
      // case "Demographics":
      //   return (
      //     <div>
      //       <div className="comp-item  mt-3">
      //         {demographics ? (
      //           <>
      //             <div class="d-flex flex-row mt-3">
      //               <p class="field-text">FMR Efficiency:</p>
      //               <p class="field-value">
      //                 {demographics.fmrEfficiency || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">FMR Four Bedroom:</p>
      //               <p class="field-value">
      //                 {demographics.fmrFourBedroom || "No"}
      //               </p>
      //             </div>

      //             <div class="d-flex flex-row">
      //               <p class="field-text">FMR One Bedroom:</p>
      //               <p class="field-value">
      //                 {demographics.fmrOneBedroom || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">FMR Three Bedroom:</p>
      //               <p class="field-value">
      //                 {demographics.fmrThreeBedroom || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">FMR Two Bedroom:</p>
      //               <p class="field-value">
      //                 {demographics.fmrTwoBedroom || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">FMR Year:</p>
      //               <p class="field-value">{demographics.fmrYear || "No"}</p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Hud Area Code:</p>
      //               <p
      //                 class="field-value"
      //                 title={demographics.hudAreaCode || "No"}
      //               >
      //                 {demographics.hudAreaCode || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Hud Area Name:</p>
      //               <p
      //                 class="field-value"
      //                 title={demographics.hudAreaName || "No"}
      //               >
      //                 {demographics.hudAreaName || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Median Income:</p>
      //               <p class="field-value">
      //                 {demographics.medianIncome || "No"}
      //               </p>
      //             </div>
      //             <div class="d-flex flex-row">
      //               <p class="field-text">Suggested Rent:</p>
      //               <p class="field-value">
      //                 {demographics.suggestedRent || "No"}
      //               </p>
      //             </div>
      //           </>
      //         ) : (
      //           <p>No demographics information found</p>
      //         )}
      //       </div>
      //     </div>
      //   );

      // case "Foreclosure & Lien":
      // return (
      //   <div className="comparable-section">
      //     <h2>Foreclosure & Lien</h2>
      //     <div className="comps-list">
      //       {foreclosureInfo.map((fore, index) => (
      //         // <div className="value-container mt-3">
      //         <div key={index} className="comp-item value-container mt-3">
      //           {/* <p className="value-text">comps</p> */}
      //           <div class="d-flex flex-row mt-3">
      //             <p class="field-text">Foreclosure Id:</p>
      //             <p class="field-value" title={fore.foreclosureId || "No"}>
      //               {fore.foreclosureId || "No"}
      //             </p>
      //           </div>

      //           <div class="d-flex flex-row">
      //             <p class="field-text">Original Loan Amount:</p>
      //             <p class="field-value">
      //               {fore.originalLoanAmount || "No"}
      //             </p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Estimated Bank Value:</p>
      //             <p class="field-value">
      //               {" "}
      //               {fore.estimatedBankValue || "No"}
      //             </p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Recording Date:</p>
      //             <p class="field-value">{fore.recordingDate || "No"}</p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Default Amount:</p>
      //             <p class="field-value" title={fore.defaultAmount || "No"}>
      //               {fore.companyName || "No"}
      //             </p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Opening Bid:</p>
      //             <p class="field-value">{fore.openingBid || "No"}</p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Auction Date:</p>
      //             <p class="field-value">{fore.auctionDate || "No"}</p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Auction Time:</p>
      //             <p class="field-value">{fore.auctionTime || "No"}</p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Auction Street Address:</p>
      //             <p
      //               class="field-value"
      //               title={fore.auctionStreetAddress || "No"}
      //             >
      //               {fore.auctionStreetAddress || "No"}
      //             </p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Document Type:</p>
      //             <p class="field-value" title={fore.documentType || "No"}>
      //               {fore.documentType || "No"}
      //             </p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Trustee Sale Number:</p>
      //             <p class="field-value">{fore.trusteeSaleNumber || "No"}</p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Type Name:</p>
      //             <p class="field-value">{fore.typeName || "No"}</p>
      //           </div>
      //           <div class="d-flex flex-row">
      //             <p class="field-text">Active:</p>
      //             <p class="field-value">{fore.active || "No"}</p>
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // );

      case "Owner Profile":
        return (
          <div>
            <div className="comp-item  mt-3">
              {ownerInfo ? (
                <>
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">FullName:</p>

                    <p class="field-value" title={ownerInfo.ListAgentFullName}>
                      {ownerInfo.ListAgentFullName || "No"}
                    </p>
                  </div>
                  <div class="d-flex flex-row ">
                    <p class="field-text">Originating System name:</p>
                    <p
                      class="field-value"
                      title={ownerInfo?.response.OriginatingSystemName}
                    >
                      {ownerInfo?.response.OriginatingSystemName || "No"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">MLS Id:</p>
                    <p class="field-value" title={ownerInfo.ListAgentMlsId}>
                      {ownerInfo.ListAgentMlsId || "No"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Mobile Phone:</p>
                    <p class="field-value">
                      {ownerInfo.ListAgentMobilePhone || "No"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Home Phone:</p>
                    <p class="field-value" title={ownerInfo.ListAgentHomePhone}>
                      {ownerInfo.ListAgentHomePhone || "No"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Preferred Phone:</p>
                    <p
                      class="field-value"
                      title={ownerInfo.ListAgentPreferredPhone}
                    >
                      {ownerInfo.ListAgentPreferredPhone || "No"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Direct Phone:</p>
                    <p
                      class="field-value"
                      title={ownerInfo.ListAgentDirectPhone}
                    >
                      {ownerInfo.ListAgentDirectPhone || "No"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">State License:</p>
                    <p class="field-value">
                      {ownerInfo.ListAgentStateLicense || "No"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Fax:</p>
                    <p class="field-value">{ownerInfo.ListAgentFax || "No"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Email:</p>
                    <p class="field-value" title={ownerInfo.ListAgentEmail}>
                      {ownerInfo.ListAgentEmail || "No"}
                    </p>
                  </div>
                </>
              ) : (
                <p>No owner information found</p>
              )}
            </div>
          </div>
        );
      default:
        return <div>Select an item to view data</div>;
    }
  };
  const isSavedOffer = savedOfferSent.some(
    (svPropertyOffer) => svPropertyOffer.property_id === property?.id
  );

  const isSaved = savedProperties.some(
    (svProperty) => svProperty.property_id === id
  );
  useEffect(() => {
    const fetchSavedOffers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/send-offer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedOfferSent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };
    const fetchSavedProperties = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/saved-lists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    fetchSavedOffers();
    fetchSavedProperties();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/properties/${dataId}`);

      setloader(false);
      let priImage = response.data.primary_photo;
      let images = response.data.alt_photos;
      const slicedImages = images.slice(0, 3);

      setProperty(response.data);
      console.log("object 1212121", response.data);
      setPrimaryImage(priImage);
      setPropertyImage(slicedImages);
      setSale(response.data.lastSale);
      setOwnerInfo(response.data);
      setDemographics(response.data.demographics);
      const compsData = response.data.comps.map((comp) => ({
        absenteeOwner: comp.absenteeOwner,
        address:
          `${comp.address.street}, ${comp.address.city}, ${comp.address.state} ${comp.address.zip}` ||
          "No",
        bedrooms: comp.bedrooms,
        bathrooms: comp.bathrooms,
        cashBuyer: comp.cashBuyer,
        companyName: comp.companyName,
        corporateOwned: comp.corporateOwned,
        equityPercent: comp.equityPercent,
        estimatedValue: comp.estimatedValue,
        id: comp.id,
        inStateAbsenteeOwner: comp.inStateAbsenteeOwner,
        lastSaleAmount: comp.lastSaleAmount,
        lastSaleDate: comp.lastSaleDate,

        latitude: comp.latitude,
        lenderName: comp.lenderName,
        longitude: comp.longitude,
        lotSquareFeet: comp.lotSquareFeet,
        mailAddress:
          `${comp.mailAddress.street}, ${comp.mailAddress.city}, ${comp.mailAddress.state} ${comp.mailAddress.zip}` ||
          "No",
        mlsDaysOnMarket: comp.mlsDaysOnMarket,
        mlsLastStatusDate: comp.mlsLastStatusDate,
        mlsListingDate: comp.mlsListingDate,
        openMortgageBalance: comp.openMortgageBalance,
        outOfStateAbsenteeOwner: comp.outOfStateAbsenteeOwner,
        owner1LastName: comp.owner1LastName,
        preForeclosure: comp.preForeclosure,
        privateLender: comp.privateLender,
        propertyId: comp.propertyId,
        propertyType: comp.propertyType,
        propertyUse: comp.propertyUse,
        propertyUseCode: comp.propertyUseCode,
        squareFeet: comp.squareFeet,
        vacant: comp.vacant,
        yearBuilt: comp.yearBuilt,
      }));

      setComps(compsData);
      const foreclosureData = response.data.foreclosureInfo.map((fore) => ({
        foreclosureId: fore.foreclosureId,
        originalLoanAmount: fore.originalLoanAmount,
        estimatedBankValue: fore.estimatedBankValue,
        defaultAmount: fore.defaultAmount,
        recordingDate: fore.recordingDate,
        openingBid: fore.openingBid,
        auctionDate: fore.auctionDate,
        auctionTime: fore.auctionTime,
        auctionStreetAddress: fore.auctionStreetAddress,
        documentType: fore.documentType,
        trusteeSaleNumber: fore.trusteeSaleNumber,
        typeName: fore.typeName,
        active: fore.active,
      }));

      setForeclosureInfo(foreclosureData);
      const mlsHistory = response.data.mlsHistory.map((mls) => ({
        propertyId: mls.propertyId,
        type: mls.type,
        price: mls.price,
        beds: mls.beds,
        baths: mls.baths,
        daysOnMarket: mls.daysOnMarket,
        agentName: mls.agentName,
        agentOffice: mls.agentOffice,
        agentPhone: mls.agentPhone,
        status: mls.status,
        statusDate: mls.statusDate,
        seqNo: mls.seqNo,
      }));

      setMlsHistory(mlsHistory);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  useEffect(() => {
    // console.log("123", property);
    fetchData();
  }, [id]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data[0];
        // console.log("object check", data);
        setIsChecked(data.on_sms_setting);
        setIdi(data.id);
        if (data.on_sms_setting === true) {
          setToastCheck(false);
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the notification setting!",
          error
        );
      });
  }, []);
  const handleSaveBucket = async (propertyDetail) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/saved-lists",
        {
          property_id: propertyDetail.id,
          property_address: propertyDetail.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!toastCheck) {
        toast.success("Property added to saved");
      }
      setSavedProperties((prevProperties) => [
        ...prevProperties,
        response.data,
      ]);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  // const ownerFullName = property.owner1FirstName && property.owner1LastName
  //   ? `${property.owner1FirstName} ${property.owner1LastName}`
  //   : "No";
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="app-main-container">
        <div className="app-main-left-container">
          <Sidenav />
        </div>
        <div className="app-main-right-container">
          <Navbar />
          <SendSingleOfferModal
            show={showModal}
            handleClose={handleClose}
            property={property}
          />
          <ImageModal
            show={showImageModal}
            handleClose={handleImageClose}
            property={property}
          />
          <div className="dashboard-main-container">
            <div className="d-flex justify-content-center m-1">
              {loader && <CircularProgress color="secondary" />}
            </div>
            {property && (
              <div className="row">
                <div className="col-12">
                  {/* <button
                    className="back-arrow-btn"
                    onClick={() => navigate("/dashboard")}
                  >
                    ← Back
                  </button> */}
                </div>
                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                  <p className="prop-detail-text mb-4">
                    {/* <span onClick={() => navigate("/dashboard")}> */}
                    <span
                      onClick={() => {
                        onBack();
                      }}
                    >
                      <img
                        src={backarrow}
                        alt="backarrow"
                        className="backarrow_img"
                      />
                    </span>
                    <span
                      onClick={() => {
                        onBack();
                      }}
                    >
                      {" "}
                      <span className="dashboard_filters">DASHBOARD</span>{" "}
                    </span>
                    <span className="arrow_dashboard">&#62;</span>
                    <span className="property_detail_head">
                      PROPERTY DETAILS
                    </span>
                  </p>
                  <div>
                    {propertyImage.length === 0 ? (
                      <div
                        className="prop-main-img red-border"
                        onClick={handleImageShow}
                      >
                        No Image
                      </div>
                    ) : (
                      <img
                        className="prop-main-img"
                        src={propertyImage[0] ? propertyImage[0] : primaryImage}
                        alt="demo"
                        onClick={handleImageShow}
                      />
                    )}
                  </div>
                  <div className="d-flex flex-row gap-3 mt-3 mb-3">
                    {propertyImage.map((photo, index) => (
                      <img
                        key={index}
                        className="prop-small-img"
                        src={photo}
                        alt="demo"
                        onClick={handleImageShow}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                  <div className="row gap-3 mb-3">
                    {isSaved ? (
                      <div className="bucket-container">
                        <p className="bucket-text saved-bucket-text">
                          Already saved in Bucket
                        </p>
                        <img className="" src={bucket} alt="bucket" />
                      </div>
                    ) : (
                      <div
                        className="bucket-container"
                        onClick={() => handleSaveBucket(property)}
                      >
                        <p className="bucket-text">Save to the Bucket</p>
                        <img className="" src={bucket} alt="bucket" />
                      </div>
                    )}
                    {/* <div
                      className="offer-container"
                      onClick={!isSavedOffer ? handleShow : undefined}
                    >
                      {isSavedOffer ? (
                        <span className="already_sent">Offer Already Sent</span>
                      ) : (
                        <>
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <p className="offer-text">Send Single Offer</p>
                          )}
                        </>
                      )}
                      <img className="" src={offer} alt="offer" />
                    </div> */}
                  </div>

                  <p className="property-address-text">
                    {property.location || "No"}
                  </p>
                  <div className="row">
                    <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
                      <div class="d-flex flex-row mt-3">
                        <p class="field-text1">Year Built</p>
                        <p class="field-value">{property.year_built || "No"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Living Area SqFt</p>
                        <p class="field-value">{property.sqft || "No"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Bedrooms</p>
                        <p class="field-value">{property.beds || "No"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Bathrooms</p>
                        <p class="field-value">{property.full_baths || "No"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">No. of Units</p>
                        <p class="field-value">{property.unit || "No"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Last Sale Date</p>
                        <p class="field-value">
                          {property.response.CloseDate || "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Property Vacant</p>
                        <p class="field-value">No</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Mail Vacant</p>
                        <p class="field-value">No</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Owner Name</p>

                        <p
                          class="field-value ownernameproperty"
                          title={property.owner1FirstName}
                        >
                          {property.owner1FirstName && property.owner1LastName
                            ? `${property.owner1FirstName} ${property.owner1LastName}`
                            : "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">APN</p>
                        <p class="field-value" title={property.lotInfo?.apn}>
                          {" "}
                          {property.lotInfo?.apn || "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Owner Type</p>
                        <p class="field-value">
                          {" "}
                          {property.response.Ownership || "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Ownership Length</p>
                        <p class="field-value">No</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Owner Occupied</p>
                        <p class="field-value">
                          {property.response.OccupantType === "Owner"
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Mortgage Recording Date:</p>
                        <p class="field-value" title={property.recordingDate}>
                          {property.recordingDate || "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">Interest Rate:</p>
                        <p class="field-value" title={muiId}>
                          {muiId || "No"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text1">HOA:</p>
                        <p class="field-value" title={property.AssociationFee}>
                          {property.response.AssociationFee || "No"}
                        </p>
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
                      <div className="value-container mt-3">
                        <p className="value-text">Value</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Estimated Value</p>
                          <p class="field-value">
                            {property.estimated_value || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Confidence Score</p>
                          <p class="field-value">No</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Est. Equity</p>
                          <p class="field-value">
                            {" "}
                            {property.estimatedEquity || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Estimated Rent</p>
                          <p class="field-value">No</p>
                        </div>
                      </div>
                      <div className="value-container mt-3">
                        <p className="value-text">MLS</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">MLS Status</p>
                          <p class="field-value">{property.status || "No"}</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">MLS Number</p>
                          <p class="field-value">{property.mls_id || "No"}</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Listing Date</p>
                          <p class="field-value">
                            {property.list_date
                              ? new Date(property.list_date)
                                  .toISOString()
                                  .split("T")[0]
                              : "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Listing Amount</p>
                          <p class="field-value">
                            ${property.listingAmount || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">After Repair Value</p>
                          <p class="field-value">No</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Agent Name</p>
                          <p class="field-value">
                            {property.mlsHistory?.agentName || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Office</p>
                          <p
                            class="field-value"
                            title={property.response.ListOfficeName}
                          >
                            {property.response.ListOfficeName || "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      {/* <div className="value-container mt-3">
                        <p className="value-text">Mortgage / Debt Summary</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Open Mortgages</p>
                          <p class="field-value">
                            {" "}
                            {property.openMortgageBalance || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Total Mortgage Balance</p>
                          <p class="field-value">No</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Recording Date</p>
                          <p class="field-value">
                            {property.mortgageHistory?.recordingDate || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Sale Amount</p>
                          <p class="field-value">
                            {property.mortgageHistory?.amount || "No"}
                          </p>
                        </div>
                      </div> */}
                      <div>
                        <div className="value-container mt-3">
                          <p className="value-text">List Agent</p>
                          {ownerInfo ? (
                            <>
                              <div class="d-flex flex-row mt-3">
                                <p class="field-text">FullName:</p>
                                <p
                                  class="field-value"
                                  title={ownerInfo.ListAgentFullName}
                                >
                                  {ownerInfo.ListAgentFullName || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row ">
                                <p class="field-text">
                                  Originating System name:
                                </p>
                                <p
                                  class="field-value"
                                  title={
                                    ownerInfo?.response.OriginatingSystemName
                                  }
                                >
                                  {ownerInfo?.response.OriginatingSystemName ||
                                    "No"}
                                </p>
                              </div>

                              <div class="d-flex flex-row">
                                <p class="field-text">MLS Id:</p>
                                <p
                                  class="field-value"
                                  title={ownerInfo.ListAgentMlsId}
                                >
                                  {ownerInfo.ListAgentMlsId || "No"}
                                </p>
                              </div>

                              <div class="d-flex flex-row">
                                <p class="field-text">Mobile Phone:</p>
                                <p class="field-value">
                                  {ownerInfo.ListAgentMobilePhone || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row">
                                <p class="field-text">Home Phone:</p>
                                <p
                                  class="field-value"
                                  title={ownerInfo.ListAgentHomePhone}
                                >
                                  {ownerInfo.ListAgentHomePhone || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row">
                                <p class="field-text">Preferred Phone:</p>
                                <p
                                  class="field-value"
                                  title={ownerInfo.ListAgentPreferredPhone}
                                >
                                  {ownerInfo.ListAgentPreferredPhone || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row">
                                <p class="field-text">Direct Phone:</p>
                                <p
                                  class="field-value"
                                  title={ownerInfo.ListAgentDirectPhone}
                                >
                                  {ownerInfo.ListAgentDirectPhone || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row">
                                <p class="field-text">State License:</p>
                                <p class="field-value">
                                  {ownerInfo.ListAgentStateLicense || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row">
                                <p class="field-text">Fax:</p>
                                <p class="field-value">
                                  {ownerInfo.ListAgentFax || "No"}
                                </p>
                              </div>
                              <div class="d-flex flex-row">
                                <p class="field-text">Email:</p>
                                <p
                                  class="field-value"
                                  title={ownerInfo.ListAgentEmail}
                                >
                                  {ownerInfo.ListAgentEmail || "No"}
                                </p>
                              </div>
                            </>
                          ) : (
                            <p>No owner information found</p>
                          )}
                        </div>
                      </div>
                      {/* <div className="value-container mt-3">
                        <p className="value-text">Distress Indicators</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Active Auction</p>
                          <p class="field-value">
                            {" "}
                            {property.auction || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Expired Listing</p>
                          <p class="field-value">No</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Inherited</p>
                          <p class="field-value">
                            {" "}
                            {property.inherited || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Active Pre-Foreclosure</p>
                          <p class="field-value">
                            {property.foreclosure || "No"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Tax Default</p>
                          <p class="field-value">No</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Tired Landlord</p>
                          <p class="field-value">No</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Unknown Equity</p>
                          <p class="field-value">No</p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <div className="prop-detail-main-container mt-5">
              <div className="d-flex flex-wrap justify-content-start gap-2">
                <div
                  className={`prop-text-container ${
                    selectedItem === "Comparable" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Comparable")}
                >
                  Comparable
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Sale & Loan" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Sale & Loan")}
                >
                  Last Sale
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "MLS" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("MLS")}
                >
                  MLS
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Demographics" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Demographics")}
                >
                  Demographics
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Foreclosure & Lien" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Foreclosure & Lien")}
                >
                  Foreclosure & Lien
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Owner Profile" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Owner Profile")}
                >
                  Owner Profile
                </div>
              </div>
            </div> */}
            {/* <div className="data-display mt-3">{renderContent()}</div> */}
          </div>
        </div>
      </div>
    </>
  );
}
