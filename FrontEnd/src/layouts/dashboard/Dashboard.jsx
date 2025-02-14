import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Modal, Spinner, Form } from "react-bootstrap";
import Tooltip from "@mui/material/Tooltip";
import { FaFilter } from "react-icons/fa";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
import offeer from "../../assets/dashboard/offer.png";
import sent_offer from "../../assets/dashboard/sent-offer.png";
import order from "../../assets/dashboard/order.png";
import heart from "../../assets/dashboard/heart2.png";
import email from "../../assets/dashboard/email.png";
import empty_mail from "../../assets/dashboard/empty_mail.png";
import fillheart from "../../assets/dashboard/fill-heart2.png";
import search from "../../assets/dashboard/search.png";
import filter from "../../assets/dashboard/filter.png";
import saveheart from "../../assets/dashboard/save-heart.png";
import leftarrow from "../../assets/dashboard/left-arrow.png";
import rightarrow from "../../assets/dashboard/right-arrow.png";
import backarrow from "../../assets/propertyDetail/backarrow.png";
import searchnav from "../../assets/dashboard/searchnav.png";
import savenav from "../../assets/dashboard/savenav.png";

import { Link, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";

import Slider from "react-slick";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropertyDetail from "./pages/PropertyDetail";

function Dashboard({ token, setToken }) {
  const navigate = useNavigate();
  const togglePropertyDropdown = () => {
    setPropertyDropdownOpen((prev) => !prev);
  };

  const handlePropertySelect = (propertyType) => {
    setSelectedPropertyType(propertyType);
  };
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [totalPropertiesCount, SettotalPropertiesCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [onclickProperty, setOnclickProperty] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [propertyDetailId, setpropertyDetailId] = useState(null);
  const [muiRate, setMuiRate] = useState(null);
  const [propertyDetail, setPropertyDetail] = useState(false);
  const [showImage, setShowImage] = useState(false); // Default state to not show the image
  const [interestRates, setInterestRates] = useState([]);
  const [interestRate, setInterestRate] = useState("");
  const [heading, setHeading] = useState("DASHBOARD");
  const [backArrow, setBackArrow] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [offer, setOffer] = useState(null);
  const [selectedLeadTypes, setSelectedLeadTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState([]);
  // const [selectedPropertytype, setSelectedPropertyType] =
  //   useState("Property Types");
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setloader] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [bridgeLoading, setbridgeLoading] = useState(false);
  const [fetchedProperties, setFetchedProperties] = useState([]);
  const [modalData, setModalData] = useState();
  const [showPriceRange, setShowPriceRange] = useState(true);
  const [address, setAddress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPriceList, setMinPriceList] = useState("");
  const [maxPriceList, setMaxPriceList] = useState("");
  const [showDataMessage, setShowDataMessage] = useState(false);
  const [minBed, setMinBed] = useState("");
  const [maxBed, setMaxBed] = useState("");
  const [minBath, setMinBath] = useState("");
  const [maxBath, setMaxBath] = useState("");
  const [showBeds, setShowBeds] = useState(true);
  const [showBaths, setShowBaths] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState("");
  const [selectedBaths, setSelectedBaths] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedOfferSent, setSavedOfferSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInputField, setShowInputField] = useState(false);
  const [activeButton, setActiveButton] = useState("beds");
  const [activeButtonP, setActiveButtonP] = useState("priceRange");
  const [favorites, setFavorites] = useState(false);
  const [offerSentD, setOfferSentD] = useState(false);
  //more filters states
  const [minStories, setMinStories] = useState("");
  const [maxStories, setMaxStories] = useState("");
  const [minBuildingSize, setMinBuildingSize] = useState("");
  const [maxBuildingSize, setMaxBuildingSize] = useState("");
  const [minLotSize, setMinLotSize] = useState("");
  const [maxLotSize, setMaxLotSize] = useState("");
  const [minYearBuilt, setMinYearBuilt] = useState("");
  const [maxYearBuilt, setMaxYearBuilt] = useState("");
  const [occupancyStatus, setOccupancyStatus] = useState([]);
  const [hasPhotos, setHasPhotos] = useState([]);
  const [mlsKeyword, setMlsKeyword] = useState([]);
  const [financialPrivateLend, setFinancialPrivateLend] = useState("");
  const [ownerOccupied, setOwnerOccupied] = useState([]);
  const [absenteeLocation, setAbsenteeLocationd] = useState([]);
  const [ownerType, setOwnerType] = useState([]);
  const [cashBuyer, setCashBuyer] = useState([]);

  //more filters states end
  //owner filter states
  const [minYearOwner, setMinYearOwner] = useState("");
  const [maxYearOwner, setMaxYearOwner] = useState("");
  const [minTaxDelinquent, setMinTaxDelinquent] = useState("");
  const [maxTaxDelinquent, setMaxTaxDelinquent] = useState("");

  const [minPropertyOwned, setMinPropertyOwned] = useState("");
  const [maxPropertyOwned, setMaxPropertyOwned] = useState("");
  const [minPortfolioValue, setMinPortfolioValue] = useState("");
  const [maxPortfolioValue, setMaxPortfolioValue] = useState("");
  //owner filter states end
  //financial filter states end
  const [minEstimatedValue, setMinEstimatedValue] = useState("");
  const [maxEstimatedValue, setMaxEstimatedValue] = useState("");
  const [minEstimatedEquity, setMinEstimatedEquity] = useState("");
  const [maxEstimatedEquity, setMaxEstimatedEquity] = useState("");
  const [showPropertiesInfo, setShowPropertiesInfo] = useState(false);

  const [minAssessedTotValue, setMinAssessedTotValue] = useState("");
  const [maxAssessedTotValue, setMaxAssessedTotValue] = useState("");
  const [minAssessedLandValue, setMinAssessedLandValue] = useState("");
  const [maxAssessedLandValue, setMaxAssessedLandValue] = useState("");
  const [minAssessedImpValue, setMinAssessedImpValue] = useState("");
  const [maxAssessedImpValue, setMaxAssessedImpValue] = useState("");
  const [minLastSalePrice, setMinLastSalePrice] = useState("");
  const [maxLastSalePrice, setMaxLastSalePrice] = useState("");
  const [minLastSaleDate, setMinLastSaleDate] = useState("");
  const [maxLastSaleDate, setMaxLastSaleDate] = useState("");
  //financial filter states end
  // forclousure filter start
  const [minRecDate, setMinRecDate] = useState("");
  // const [maxRecDate, setMaxRecDate] = useState("");
  const [minAuctionDate, setMinAuctionDate] = useState("");
  // const [maxAuctionDate, setMaxAuctionDate] = useState("");
  const [mlsforeclousureSelect, setMlsforeclousureSelect] = useState("Select");

  //financial filter states end
  // forclousure filter end

  // MLS filter start
  const [minDaysMarket, setMinDaysMarket] = useState("");
  const [maxDaysMarket, setMaxDaysMarket] = useState("");
  const [mlsStatus, setMlsStatus] = useState("Select");

  const [minWithDrawnDate, setMinWithDrawnDate] = useState("");
  const [maxWithDrawnDate, setMaxWithDrawnDate] = useState("");
  const [minListingPrice, setMinListingPrice] = useState("");
  const [maxListingPrice, setMaxListingPrice] = useState("");
  //MLS filter end

  const [showModal, setShowModal] = useState(false);
  const [showModalOffer, setShowModalOffer] = useState(false);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState([]);
  const [apiCalled, setApiCalled] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State for button visibility
  const [dropdownValue, setDropdownValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [id, setId] = useState(null);
  const [isButtonVisibleFilter, setIsButtonVisibleFilter] = useState(false);
  const [filterId, setFilterId] = useState("");
  const [toastCheck, setToastCheck] = useState(true);
  const [bridgeData, setBridgeData] = useState("false");
  const buttonLabels = ["1+", "2+", "3+", "4+", "5+"];

  const handleClick = (label) => {
    if (maxBed === label) {
      setMaxBed(null);
    } else {
      setMaxBed(label);
    }
  };
  const handleClickBath = (label) => {
    if (maxBath === label) {
      setMaxBath(null);
    } else {
      setMaxBath(label);
    }
  };
  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all properties
      setSelectedProperties([]);
    } else {
      const allPropertyIds = onclickProperty.map((property) => property.id);
      setSelectedProperties(allPropertyIds);
    }
    setAllSelected(!allSelected);
  };
  const handleBackToDashboard = () => {
    setPropertyDetail(false);
  };
  const removeAllFilter = (e) => {
    setMinDaysMarket("");
    setMaxDaysMarket("");
    setMinListingPrice("");
    setMaxListingPrice("");
    setMinAssessedTotValue("");
    setMaxAssessedTotValue("");
    setMinStories("");
    setMaxStories("");
    setMinBuildingSize("");
    setMaxBuildingSize("");
    setMinLotSize("");
    setMaxLotSize("");
    setMinYearBuilt("");
    setMaxYearBuilt("");
    setMinYearOwner("");
    setMaxYearOwner("");
    setMinTaxDelinquent("");
    setMaxTaxDelinquent("");
    setMinAuctionDate("");
    setMinRecDate("");
    setMaxBath("");
    setMinBath("");
    setMaxBed("");
    setMinBed("");
    setMinDaysMarket("");
    setSelectedPropertyTypes("");
  };
  const handleDropdownChange = (e) => {
    setDropdownValue(e.target.value);
    setMinPriceList(e.target.value);
  };
  const handleResetClickEstimatedValue = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const handleResetClickListPrice = () => {
    setMinPriceList("");
    setMaxPriceList("");
  };
  const leadTypes = [
    "Absentee Owner",
    "Adjustable Rate",
    "Auction",
    "Reo",
    "Cash Buyer",
    "Free Clear",
    "High Equity",
    "Negative Equity",
    "Mls Active",
    "Mls Pending",
    "Mls Cancelled",
    "Out Of State Owner",
    "Pre Foreclosure",
    "Vacant",
  ];
  const propertyTypes = [
    "Residential",
    "Residential Income",
    "Residential Lease",
    "Land",
    "Commercial Sale",
    "Business Opportunity",
    "Commercial Lease",
  ];
  const handleCheckboxChange = (leadType) => {
    setSelectedLeadTypes((prevSelected) => {
      if (prevSelected.includes(leadType)) {
        return prevSelected.filter((type) => type !== leadType); // Deselect
      } else {
        return [...prevSelected, leadType]; // Select
      }
    });
  };

  const itemsPerPage = 25;
  const totalProperties = totalPropertiesCount;
  const handleReset = () => {
    setSelectedLeadTypes([]);
  };
  // const handleCheckboxChangeP = (lead) => {
  //   setSelectedPropertyType((prevSelected) =>
  //     prevSelected.includes(lead)
  //       ? prevSelected.filter((type) => type !== lead)
  //       : [...prevSelected, lead]
  //   );
  // };
  const handleCheckboxChangeP = (type) => {
    setSelectedPropertyTypes((prevSelected) => {
      if (prevSelected.includes(type)) {
        return prevSelected.filter((item) => item !== type); // Deselect if already selected
      } else {
        return [...prevSelected, type]; // Select if not already selected
      }
    });
  };

  const handleResetProperty = () => {
    setSelectedPropertyTypes([]);
  };
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handlePropertySelet = (property) => {
    setSelectedPropertyType(property);
  };
  // const handlePropertySelect = (property) => {
  //   setSelectedleadtype(property);
  // };
  const handleFilterClick = (filter) => {
    setFilterId(filter.id);
    const leadTypes = Object.keys(filter).filter((key) => filter[key] === true);

    // Convert lead types to the format you need
    const formattedLeadTypes = leadTypes.map((leadType) =>
      leadType
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );
    // console.log("check", formattedLeadTypes);

    setValues({
      Address: filter.address || "",
      City: filter.city || "",
      County: filter.county || "",
      State: filter.state || "",
      Zip: filter.zip || "",

      // House: filter.house || "",
    });
    setFormData({ filterName: filter.filterName || "" });
    // setAddress(filter.address || "");
    // setValues(filter.address || "");
    setMinPrice(filter.min_est_value || "");
    setMaxPrice(filter.max_est_value || "");
    setMinPriceList(filter.min_list_price || "");
    setMaxPriceList(filter.max_list_price || "");
    setSelectedBaths(filter.baths || "");
    setSelectedBeds(filter.beds || "");

    setSelectedPropertyTypes(filter.property_types || "");
    setSelectedLeadTypes(formattedLeadTypes);

    // setSelectedLeadTypes(filter.lead_type || "");
    setMinBath(filter.min_baths || "");
    setMaxBath(filter.baths || "");
    setMinBed(filter.min_beds || "");
    setMaxBed(filter.beds || "");
    setMinStories(filter.min_stories || "");
    setMaxStories(filter.max_stories || "");
    setMinBuildingSize(filter.min_building_size || "");
    setMaxBuildingSize(filter.max_building_size || "");
    setMinLotSize(filter.min_lot_size || "");
    setMaxLotSize(filter.max_lot_size || "");
    setMinYearBuilt(filter.min_year_built || "");
    setMaxYearBuilt(filter.max_year_built || "");

    setMinYearOwner(filter.min_years_owned || "");
    setMaxYearOwner(filter.max_years_owned || "");
    setMinTaxDelinquent(filter.min_tax_delinquent_year || "");
    setMaxTaxDelinquent(filter.max_tax_delinquent_year || "");
    setMinPropertyOwned(filter.properties_owned_min || "");
    setMaxPropertyOwned(filter.properties_owned_max || "");
    setMinPortfolioValue(filter.portfolio_value_min || "");
    setMaxPortfolioValue(filter.portfolio_value_max || "");
    setFinancialPrivateLend(filter.private_lender || "");

    setMinEstimatedEquity(filter.estimated_equity_min || "");
    setMaxEstimatedEquity(filter.estimated_equity_max || "");
    setMinAssessedTotValue(filter.min_assessed_value || "");
    setMaxAssessedTotValue(filter.max_assessed_value || "");
    setMinAssessedLandValue(filter.assessed_land_value_min || "");
    setMaxAssessedLandValue(filter.assessed_land_value_max || "");
    setMinAssessedImpValue(filter.assessed_improvement_value_min || "");
    setMaxAssessedImpValue(filter.assessed_improvement_value_max || "");
    setMinLastSalePrice(filter.last_sale_price_min || "");
    setMaxLastSalePrice(filter.last_sale_price_max || "");
    setMinLastSaleDate(filter.last_sale_date_min || "");
    setMaxLastSaleDate(filter.last_sale_date_max || "");

    setMinRecDate(filter.pre_foreclosure_date || "");
    // setMaxRecDate(filter.pre_foreclosure_date_max || "");
    setMinAuctionDate(filter.auction_date || "");
    // setMaxAuctionDate(filter.auction_date_max || "");

    setMinDaysMarket(filter.min_mls_days_on_market || "");
    setMaxDaysMarket(filter.max_mls_days_on_market || "");
    setMinListingPrice(filter.min_mls_listing_price || "");
    setMaxListingPrice(filter.max_mls_listing_price || "");
    setIsButtonVisibleFilter(true);
    // setIsButtonVisible(false); // Hide the button when a filter is selected

    // setSelectedLeadTypes(filter.selected_lead_type)
    // if (filter.leadType) {
    //   handleCheckboxChange(filter.leadType);
    // }
    const leadTypesObject = selectedLeadTypes.reduce((obj, leadType) => {
      // Convert the leadType to lowercase and replace spaces with underscores
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});

    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    // function convertToNumbers(obj) {
    //   for (let key in obj) {
    //     if (key !== "address" && obj[key] !== null && !isNaN(obj[key])) {
    //       obj[key] = Number(obj[key]);
    //     }
    //   }
    //   return obj;
    // }

    // const address = filter.address;

    // const convertedFilter = convertToNumbers(filter);
    const leadTypes1 = Object.keys(filter).filter(
      (key) => filter[key] === true
    );

    // Create leadTypesObject with the desired format
    const leadTypesObject1 = leadTypes1.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});
    const reapi_payload = {
      address: filter.address,
      // house: filter.house,
      // street: filter.street,
      city: filter.city,
      county: filter.county,
      state: filter.state,

      zip: filter.zip,
      ...leadTypesObject1,
      // absentee_owner: leadTypesObject.absentee_owner,
      // adjustable_rate: leadTypesObject.adjustable_rate,
      // auction:leadTypesObject.auction,
      // reo:leadTypesObject.reo,
      // cash_buyer:leadTypesObject.cash_buyer,
      // free_clear:leadTypesObject.free_clear,
      // high_equity:leadTypesObject.high_equity,
      // negative_equity:leadTypesObject.negative_equity,
      // mls_active:leadTypesObject.mls_active,
      // mls_pending:leadTypesObject.mls_pending,
      // mls_cancelled:leadTypesObject.mls_cancelled,
      // out_of_state_owner:leadTypesObject.out_of_state_owner,
      // pre_foreclosure:leadTypesObject.pre_foreclosure,
      // vacant:leadTypesObject.vacant,
      est_value: filter.min_est_value,
      // max_est_value: filter.max_est_value,
      min_list_price: filter.min_list_price,
      max_list_price: filter.max_list_price,
      // max_mls_listing_price: filter.max_mls_listing_price,
      min_mls_listing_price: filter.mls_listing_price,
      max_mls_days_on_market: filter.max_mls_days_on_market,
      min_mls_days_on_market: filter.min_mls_days_on_market,

      // auction_date_min: minAuctionDate,
      // auction_date_max: maxAuctionDate,
      // pre_foreclosure_date_max: filter.pre_foreclosure_date_max,
      pre_foreclosure_date: filter.pre_foreclosure_date,

      last_sale_date_min: filter.last_sale_date_min,
      last_sale_date_max: filter.last_sale_date_max,
      last_sale_price_min: filter.last_sale_price_min,
      last_sale_price_max: filter.last_sale_price_max,
      assessed_improvement_value_min: filter.assessed_improvement_value_min,
      assessed_improvement_value_max: filter.assessed_improvement_value_max,
      assessed_land_value_min: filter.assessed_land_value_min,
      assessed_land_value_max: filter.assessed_land_value_max,
      min_assessed_value: filter.min_assessed_value,
      max_assessed_value: filter.max_assessed_value,
      estimated_equity_min: filter.estimated_equity_min,
      estimated_equity_max: filter.estimated_equity_max,

      // portfolio_value_min: parseInt(minPortfolioValue),
      // portfolio_value_max: parseInt(maxPortfolioValue),
      properties_owned_min: filter.properties_owned_min,
      properties_owned_max: filter.properties_owned_max,
      min_tax_delinquent_year: parseInt(minTaxDelinquent),
      max_tax_delinquent_year: parseInt(maxTaxDelinquent),
      min_years_owned: filter.min_years_owned,
      max_years_owned: filter.max_years_owned,

      min_year_built: filter.min_year_built,
      max_year_built: filter.max_year_built,
      min_lot_size: filter.min_lot_size,
      max_lot_size: filter.max_lot_size,
      min_building_size: filter.min_building_size,
      max_building_size: filter.max_building_size,
      min_stories: filter.min_stories,
      max_stories: filter.max_stories,
      property_type: filter.property_type,
      private_lender: filter.private_lender,

      min_baths: filter.min_baths,
      baths: filter.max_baths,
      min_beds: filter.min_beds,
      beds: filter.max_beds,
    };
    setIsButtonVisibleFilter(true);
    // setLoadingSearch(true);
    // const token = localStorage.getItem("accessToken");
    // axios
    //   .post(
    //     "/api/properties/filter",
    //     { ...reapi_payload },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     // console.log("check 1", response);
    //     if (response.data.properties.length === 0) {
    //       toast.info("No properties found for selected filters");
    //       setProperties([]);
    //       setBackArrow(true);
    //       // setTotalPages([]);
    //     } else {
    //       setOfferSentD(false);
    //       setFavorites(false);
    //       if (!toastCheck) {
    //         toast.success("Properties found successfully");
    //       }
    //       setProperties(response.data.properties);
    //       setTotalPages(response.data.total_pages);
    //       setFiltersApplied(true);
    //       // setApiCalled(true);
    //       setFilterValue(reapi_payload);
    //       setBackArrow(true);
    //       setHeading("Filters");
    //     }
    //     setFormData({ filterName: "" });
    //     setLoadingSearch(false);
    //     setShowModal(false);
    //     setShowModalOffer(false);
    //   })
    //   .catch((error) => {
    //     const errorMessage =
    //       error.response?.data?.error?.message ||
    //       error.response?.data?.error ||
    //       error.response?.data?.message ||
    //       error?.error?.message ||
    //       error?.error;
    //     //  ||
    //     // "An error occurred"
    //     toast.error(errorMessage);

    //     // toast.error(
    //     //   error.response.data.error ||
    //     //     error.response?.data?.error?.message ||
    //     //     error.response?.data?.error ||
    //     //     error?.error?.message ||
    //     //     error?.error ||
    //     //     "An unexpected error occur"
    //     // );
    //     // toast.error("not");
    //     console.error("Error  filters:", error);
    //     setLoadingSearch(false);
    //   });
  };

  const handleClose = () => {
    setShowModal(false);
    setShowModalOffer(false);
  };

  const handleUpdateFilter = async () => {
    const leadTypesList = [
      "Absentee Owner",
      "Adjustable Rate",
      "Auction",
      "Reo",
      "Cash Buyer",
      "Free Clear",
      "High Equity",
      "Negative Equity",
      "Mls Active",
      "Mls Pending",
      "Mls Cancelled",
      "Out Of State Owner",
      "Pre Foreclosure",
      "Vacant",
    ];
    const fieldPairs = [
      { min: minPriceList, max: maxPriceList, name: "Price" },
      // { min: minBed, max: maxBed, name: "Bed" },
      // { min: minBath, max: maxBath, name: "Bath" },
      { min: minStories, max: maxStories, name: "No of Stories" },

      { min: minBuildingSize, max: maxBuildingSize, name: "Building Size" },
      { min: minLotSize, max: maxLotSize, name: "Lot Size" },
      { min: minYearBuilt, max: maxYearBuilt, name: "Year Built" },

      { min: minYearOwner, max: maxYearOwner, name: "Years of Ownership" },
      {
        min: minTaxDelinquent,
        max: maxTaxDelinquent,
        name: "Tax Delinquent Year",
      },
      {
        min: minAssessedTotValue,
        max: maxAssessedTotValue,
        name: "Assesed Total Value",
      },
      { min: minDaysMarket, max: maxDaysMarket, name: "MLS Days on Market" },
      { min: minListingPrice, max: maxListingPrice, name: "MLS Listing Price" },
    ];

    for (const pair of fieldPairs) {
      if (
        (pair.min !== "" && pair.max === "") ||
        (pair.min === "" && pair.max !== "")
      ) {
        toast.error(`Please fill both Min and Max ${pair.name}.`);
        return;
      }
    }
    const leadTypesObject = leadTypesList.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = selectedLeadTypes.includes(leadType)
        ? true
        : null;
      return obj;
    }, {});
    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };
    const filters = {
      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      filterName: formData.filterName,
      address: values.Address,
      city: values.City,
      county: values.County,
      state: values.State,

      zip: values.Zip,
      // house: values.House,
      street: values.street,

      ...leadTypesObject,
      max_mls_listing_price: parseInt(maxListingPrice),
      min_mls_listing_price: parseInt(minListingPrice),
      max_mls_days_on_market: parseInt(maxDaysMarket),
      min_mls_days_on_market: parseInt(minDaysMarket),

      auction_date: minAuctionDate,
      // auction_date_max: maxAuctionDate,
      // pre_foreclosure_date_max: maxRecDate,
      pre_foreclosure_date: minRecDate,

      last_sale_date_min: minLastSaleDate,
      last_sale_date_max: maxLastSaleDate,
      last_sale_price_min: parseInt(minLastSalePrice),
      last_sale_price_max: parseInt(maxLastSalePrice),
      assessed_improvement_value_min: parseInt(minAssessedImpValue),
      assessed_improvement_value_max: parseInt(maxAssessedImpValue),
      assessed_land_value_min: parseInt(minAssessedLandValue),
      assessed_land_value_max: parseInt(maxAssessedLandValue),
      min_assessed_value: parseInt(minAssessedTotValue),
      max_assessed_value: parseInt(maxAssessedTotValue),
      estimated_equity_min: parseInt(minEstimatedEquity),
      estimated_equity_max: parseInt(maxEstimatedEquity),

      // portfolio_value_min: parseInt(minPortfolioValue),
      // portfolio_value_max: parseInt(maxPortfolioValue),
      properties_owned_min: parseInt(minPropertyOwned),
      properties_owned_max: parseInt(maxPropertyOwned),
      min_tax_delinquent_year: parseInt(minTaxDelinquent),
      max_tax_delinquent_year: parseInt(maxTaxDelinquent),
      min_years_owned: parseInt(minYearOwner),
      max_years_owned: parseInt(maxYearOwner),

      min_year_built: parseInt(minYearBuilt),
      max_year_built: parseInt(maxYearBuilt),
      min_lot_size: parseInt(minLotSize),
      max_lot_size: parseInt(maxLotSize),
      min_building_size: parseInt(minBuildingSize),
      max_building_size: parseInt(maxBuildingSize),
      min_stories: parseInt(minStories),
      max_stories: parseInt(maxStories),
      property_types: selectedPropertyTypes,
      private_lender: financialPrivateLend,

      min_baths: parseInt(minBath),
      baths: parseInt(maxBath),
      min_beds: parseInt(minBed),
      beds: parseInt(maxBed),
      ...formData,
    };
    console.log("hurarah test", filters);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `/api/saved-filters/${filterId}`,
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!toastCheck) {
        toast.success("Offer setting is updated successfully!");
      }
      setIsButtonVisibleFilter(false);
      fetchFilters();
      setFormData({ filterName: "" });
      setAddress("");
      setMaxBath("");
      setMaxBed("");
      setMinBath("");
      setMinBed("");
      // setSelectedBeds("");
      // setSelectedBaths("");
      setMaxPriceList("");
      setMinPriceList("");
      setMaxPrice("");
      setMinPrice("");
      setSelectedLeadTypes([]);
      setSelectedPropertyType(null);
      setMinStories("");
      setMaxStories("");
      setMinBuildingSize("");
      setMaxBuildingSize("");
      setMinLotSize("");
      setMaxLotSize("");
      setMinYearBuilt("");
      setMaxYearBuilt("");
      setOccupancyStatus("");
      setHasPhotos("");
      setMlsKeyword("");
      setFinancialPrivateLend("");
      setOwnerOccupied("");
      setAbsenteeLocationd("");
      setOwnerType("");
      setCashBuyer("");
      setMinYearOwner("");
      setMaxYearOwner("");
      setMinTaxDelinquent("");
      setMaxTaxDelinquent("");
      setMinPropertyOwned("");
      setMaxPropertyOwned("");
      setMinPortfolioValue("");
      setMaxPortfolioValue("");
      setMinEstimatedValue("");
      setMaxEstimatedValue("");
      setMinEstimatedEquity("");
      setMaxEstimatedEquity("");
      setMinAssessedTotValue("");
      setMaxAssessedTotValue("");
      setMinAssessedLandValue("");
      setMaxAssessedLandValue("");
      setMinAssessedImpValue("");
      setMaxAssessedImpValue("");
      setMinLastSalePrice("");
      setMaxLastSalePrice("");
      setMinLastSaleDate("");
      setMaxLastSaleDate("");
      setMinRecDate("");
      // setMaxRecDate("");
      setMinAuctionDate("");
      // setMaxAuctionDate("");
      setMlsforeclousureSelect("");
      setMinDaysMarket("");
      setMaxDaysMarket("");
      setMlsStatus("");
      setMinWithDrawnDate("");
      setMaxWithDrawnDate("");
      setMinListingPrice("");
      setMaxListingPrice("");
      setSelectedPropertyTypes("");
      setValues({
        Address: "",
        City: "",
        County: "",
        State: "",
        Zip: "",

        // House: "",
      });
      setShowModal(false);
      // setShowModalOffer(false);
    } catch (error) {
      toast.error("Failed to update. Please try again.");
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const fetchFilters = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("/api/saved-filters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters", error);
    }
  };
  useEffect(() => {
    fetchFilters();
  }, []);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState("County");
  const [values, setValues] = useState({
    Address: "",
    City: "",
    County: "",
    State: "",
    Zip: "",

    // House: "",
  });

  const toggleDropdown1 = () => setDropdownOpen1((prevState) => !prevState);
  const handleSelect1 = (option) => {
    setSelectedOption1(option);

    setValues({
      Address: "",
      City: "",
      County: "",
      State: "",
      Zip: "",

      [option]: values[option], // Preserve the value of the selected option
    });
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [selectedOption1]: value,
    }));
  };
  const placeholders = {
    Address: "Enter Street Address",
    City: "Enter city",
    County: "Enter county",
    State: "Enter state",
    Zip: "Enter zip code",
  };
  const fetchProperties = () => {
    setbridgeLoading(true);
    axios
      .get(`/api/properties`)
      .then((response) => {
        // if (!toastCheck) {
        //   toast.success("Properties found successfully");
        // }
        setProperties(response.data.properties);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.total_pages);
        // setInterestRate(response.data.interest_rate);
        setbridgeLoading(false);
      })
      .catch((error) => {
        // alert(error.message);
        toast.error(error.message);
      })
      .finally(() => {
        setbridgeLoading(false);
      });
  };
  const validatePair = (field1, field2, errorMessage) => {
    if ((field1 !== "" && field2 === "") || (field1 === "" && field2 !== "")) {
      toast.error(errorMessage);
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const fieldPairs = [
      { min: minPriceList, max: maxPriceList, name: "Price" },
      // { min: minBed, max: maxBed, name: "Bed" },
      // { min: minBath, max: maxBath, name: "Bath" },
      { min: minStories, max: maxStories, name: "No of Stories" },

      { min: minBuildingSize, max: maxBuildingSize, name: "Building Size" },
      { min: minLotSize, max: maxLotSize, name: "Lot Size" },
      { min: minYearBuilt, max: maxYearBuilt, name: "Year Built" },

      { min: minYearOwner, max: maxYearOwner, name: "Years of Ownership" },
      {
        min: minTaxDelinquent,
        max: maxTaxDelinquent,
        name: "Tax Delinquent Year",
      },
      {
        min: minAssessedTotValue,
        max: maxAssessedTotValue,
        name: "Assesed Total Value",
      },
      { min: minDaysMarket, max: maxDaysMarket, name: "MLS Days on Market" },
      { min: minListingPrice, max: maxListingPrice, name: "MLS Listing Price" },
    ];

    for (const pair of fieldPairs) {
      if (
        (pair.min !== "" && pair.max === "") ||
        (pair.min === "" && pair.max !== "")
      ) {
        toast.error(`Please fill both Min and Max ${pair.name}.`);
        return;
      }
    }

    const leadTypesObject = selectedLeadTypes.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});

    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    const reapi_payload = {
      bridge_default_size: 25,
      bridgeData: bridgeData,
      address: values.Address,
      city: values.City,
      county: values.County,
      state: values.State,

      zip: values.Zip,
      // house: values.House,
      street: values.street,

      ...leadTypesObject,

      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      max_mls_listing_price: parseNumber(maxListingPrice),
      min_mls_listing_price: parseNumber(minListingPrice),
      max_mls_days_on_market: parseNumber(maxDaysMarket),
      min_mls_days_on_market: parseNumber(minDaysMarket),

      // pre_foreclosure_date_max: maxRecDate,
      pre_foreclosure_date: minRecDate,

      last_sale_date_min: minLastSaleDate,
      last_sale_date_max: maxLastSaleDate,
      last_sale_price_min: parseInt(minLastSalePrice),
      last_sale_price_max: parseInt(maxLastSalePrice),
      assessed_improvement_value_min: parseInt(minAssessedImpValue),
      assessed_improvement_value_max: parseInt(maxAssessedImpValue),
      assessed_land_value_min: parseInt(minAssessedLandValue),
      assessed_land_value_max: parseInt(maxAssessedLandValue),
      min_assessed_value: parseInt(minAssessedTotValue),
      max_assessed_value: parseInt(maxAssessedTotValue),
      estimated_equity_min: parseInt(minEstimatedEquity),
      estimated_equity_max: parseInt(maxEstimatedEquity),

      properties_owned_min: parseInt(minPropertyOwned),
      properties_owned_max: parseInt(maxPropertyOwned),

      min_years_owned: parseInt(minYearOwner),
      max_years_owned: parseInt(maxYearOwner),
      min_tax_delinquent_year: parseInt(minTaxDelinquent),
      max_tax_delinquent_year: parseInt(maxTaxDelinquent),

      min_year_built: parseInt(minYearBuilt),
      max_year_built: parseInt(maxYearBuilt),
      min_lot_size: parseInt(minLotSize),
      max_lot_size: parseInt(maxLotSize),
      min_building_size: parseInt(minBuildingSize),
      max_building_size: parseInt(maxBuildingSize),
      min_stories: parseInt(minStories),
      max_stories: parseInt(maxStories),
      property_types:
        selectedPropertyTypes.length > 0 ? selectedPropertyTypes : undefined,
      private_lender: financialPrivateLend,
      auction_date: minAuctionDate,
      min_baths: parseInt(minBath),
      baths: parseInt(maxBath),
      min_beds: parseInt(minBed),
      beds: parseInt(maxBed),
    };

    const requiredFields = [
      reapi_payload.est_value,
      // reapi_payload.max_est_value,
      reapi_payload.property_types,
      reapi_payload.min_list_price,
      reapi_payload.max_list_price,
      reapi_payload.beds,
      reapi_payload.min_beds,
      reapi_payload.max_baths,
      reapi_payload.min_baths,
      reapi_payload.min_stories,
      reapi_payload.max_stories,
      reapi_payload.min_building_size,
      reapi_payload.max_building_size,
      reapi_payload.min_lot_size,
      reapi_payload.max_lot_size,
      reapi_payload.max_year_built,
      reapi_payload.min_year_built,
      reapi_payload.max_years_owned,
      reapi_payload.min_years_owned,
      reapi_payload.auction_date,
      // reapi_payload.max_year_owner,
      reapi_payload.max_tax_delinquent_year,
      reapi_payload.min_tax_delinquent_year,
      reapi_payload.min_property_owned,
      reapi_payload.max_property_owned,
      reapi_payload.min_portfolio_value,
      reapi_payload.max_portfolio_value,
      reapi_payload.finance_min_estimated_value,
      reapi_payload.finance_max_estimated_value,
      reapi_payload.finance_min_estimated_equity,
      reapi_payload.finance_max_estimated_equity,
      reapi_payload.min_assessed_value,
      reapi_payload.max_assessed_value,
      reapi_payload.finance_min_assessed_imp_value,
      reapi_payload.finance_max_assessed_imp_value,
      reapi_payload.finance_min_assessed_land_value,
      reapi_payload.finance_max_assessed_land_value,
      // reapi_payload.finance_min_last_sale_date,
      // reapi_payload.finance_max_last_sale_date,
      reapi_payload.finance_min_last_sale_price,
      reapi_payload.finance_max_last_sale_price,
      // reapi_payload.mls_max_days_on_market,
      // reapi_payload.mls_min_days_on_market,

      reapi_payload.max_mls_days_on_market,
      reapi_payload.min_mls_days_on_market,
      reapi_payload.max_mls_listing_price,
      reapi_payload.min_mls_listing_price,
      reapi_payload.pre_foreclosure_date,
      reapi_payload.assessed_value,
      reapi_payload.tax_delinquent_year,
      // reapi_payload.mls_min_listing_price,
      // reapi_payload.mls_max_listing_price,
      // reapi_payload.mls_min_withdrawn_date,
      // reapi_payload.mls_max_withdrawn_date,
      // reapi_payload.fore_min_rec_date,
      // reapi_payload.fore_max_rec_date,
      // reapi_payload.fore_min_auction_date,
      // reapi_payload.fore_max_auction_date,
    ];

    const hasValidFilters =
      requiredFields.some((value) => value !== "" && !isNaN(value)) ||
      reapi_payload.address !== "" ||
      reapi_payload.city !== "" ||
      reapi_payload.county !== "" ||
      reapi_payload.state !== "" ||
      reapi_payload.zip !== "" ||
      // reapi_payload.house !== "" ||
      // selectedLeadTypes.length > 0 ||
      // selectedPropertyType.length > 0;
      (selectedLeadTypes !== "" &&
        selectedLeadTypes !== "Lead Types" &&
        selectedLeadTypes.length > 0) ||
      (Array.isArray(selectedPropertyTypes) &&
        selectedPropertyTypes.length > 0 &&
        selectedPropertyTypes[0] !== "Property Types");
    // selectedleadtype !== ""  ||
    // selectedPropertytype !== "";

    if (!hasValidFilters) {
      toast.error("At least one filter field is required");
      return;
    }

    setLoadingSearch(true);
    const token = localStorage.getItem("accessToken");
    await axios
      .post("/api/properties/filter", reapi_payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        if (response.data.bridgeProperties) {
          setOfferSentD(false);
          setFavorites(false);

          const fetchedProperties = response.data.bridgeProperties || [];
          setFetchedProperties(fetchedProperties);
          const filteredProperties = fetchedProperties.filter(
            (property) =>
              !savedOfferSent.some(
                (svPropertyOffer) => svPropertyOffer.property_id === property.id
              )
          );
          setSelectedProperties([]);
          setAllSelected(false);
          const formattedProperties = response.data.bridgeProperties?.map(
            (property) => ({
              ...property,
              formattedDate: formatDate(property.recordingDate),
            })
          );
          setProperties(formattedProperties);
          setInterestRates(
            response.data.interest_rate?.map((rate) => ({
              ...rate,
              formattedYear: formatDate(rate.year),
            }))
          );
          setPropertiesCount(filteredProperties.length);

          // setProperties(response.data.bridgeProperties);
          setTotalPages(response.data.total_pages);
          SettotalPropertiesCount(response.data.total_bridgeProperties_count);
          setFiltersApplied(true);
          setApiCalled(true);
          setFilterValue(reapi_payload);
          setBridgeData("true");
          setBackArrow(true);
          setShowImage(true);
          setloader(false);
          setLoading(false);
          setHeading("Filters");

          setShowButton(false);
          setShowPropertiesInfo(true);
          const apiData = response.data.bridgeProperties;
          const apiDataPayload = apiData.map((property) => ({
            id: property.id,
            location_for_transaction: property.location_for_transaction,
            location_for_zestimate: property.location_for_zestimate,
          }));
          axios
            .post(`/api/bridge-secondary-call`, apiDataPayload)
            .then((tzResponse) => {
              const secondaryData = tzResponse.data;
              const updatedProperties = formattedProperties.map((property) => {
                const match = secondaryData.find(
                  (secData) => secData.id === property.id
                );
                if (match) {
                  return {
                    ...property,
                    ...match,
                    formattedDate: formatDate(match.recordingDate),
                  };
                }

                return property;
              });

              setProperties(updatedProperties);
              setInterestRates(
                response.data.interest_rate?.map((rate) => ({
                  ...rate,
                  formattedYear: formatDate(rate.year),
                }))
              );
            })
            .catch((error) => {
              console.error("Error fetching secondary API data:", error);
            });
        }
        if (response.data.properties.length === 0) {
          //  toast.error(response.error.message);
          toast.info("No properties found for selected filters");
          setProperties([]);
          setBackArrow(true);
          setShowImage(true);
          // setTotalPages([]);
        } else {
          setOfferSentD(false);
          setFavorites(false);
          if (!toastCheck) {
            toast.success("Properties Updated");
          }
          setProperties(response.data.properties);
          setTotalPages(response.data.total_pages);
          setFiltersApplied(true);
          setApiCalled(true);
          setFilterValue(reapi_payload);
          setBackArrow(true);
          setShowImage(true);
          setloader(false);
          setLoading(false);
          setHeading("Filters");
          setShowButton(false);
          // window.location.reload()
        }

        setLoadingSearch(false);
        setloader(false);
        setLoading(false);
      })

      .catch((error) => {
        setloader(false);
        setLoading(false);
        // toast.error("Failed to search filter. Please try again");
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.error ||
          error?.error?.message ||
          error.response?.data?.message ||
          error?.error;
        // ||
        // "An error occurred";
        //  ||
        // "Failed to search filter. Please try again"
        toast.error(errorMessage);
        setLoadingSearch(false);
        setLoading(false);
      });
  };
  const [formDataOffer, setFormDataOffer] = useState({
    expirationDate: "",
    closingDate: "",
    offerAmount: "",
    listPricePercentage: "",
    escrowDeposit: "",
    inspectionPeriod: "",
    otherItems: "",
    terms: "",
  });
  const handleChangeOffer = (e) => {
    const { name, value } = e.target;
    setFormDataOffer({ ...formDataOffer, [name]: value });
  };
  const validateForm = () => {
    const requiredFields = [
      "expirationDate",
      "closingDate",
      "escrowDeposit",
      "inspectionPeriod",
    ];
    for (let field of requiredFields) {
      if (!formDataOffer[field]) {
        return false;
      }
    }
    return true;
  };
  const handleSaveFilterOffer = async (property) => {
    // if (!validateForm()) {
    //   toast.error("Please fill in all required(*) fields.");
    //   return;
    // }
    if (!selectedValue) {
      toast.error("Please select at least one offer template.");
      return;
    }
    setLoading(true);
    const selectedOffer = data.find((data) => data.id === selectedValue);
    const mutiPropData = {
      offer_template: selectedOffer,
      property_ids: selectedProperties,
    };

    const token = localStorage.getItem("accessToken");
    try {
      // const webhookData = {
      //   sendOfferFormData: formDataOffer,
      //   property,
      // };

      const response = await axios.post(
        "/api/send-multiple-offers",
        mutiPropData,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedProperties([]);
      setAllSelected(false);
      if (!toastCheck) {
        toast.success("Multiple offer sending in progress");
      }
      handleClose();
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast.error("Failed to send offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFilter = () => {
    if (!formData.filterName) {
      toast.error("Filter name is required");
      return;
    }
    const fieldPairs = [
      { min: minPriceList, max: maxPriceList, name: "Price" },
      // { min: minBed, max: maxBed, name: "Bed" },
      // { min: minBath, max: maxBath, name: "Bath" },
      { min: minStories, max: maxStories, name: "No of Stories" },

      { min: minBuildingSize, max: maxBuildingSize, name: "Building Size" },
      { min: minLotSize, max: maxLotSize, name: "Lot Size" },
      { min: minYearBuilt, max: maxYearBuilt, name: "Year Built" },

      { min: minYearOwner, max: maxYearOwner, name: "Years of Ownership" },
      {
        min: minTaxDelinquent,
        max: maxTaxDelinquent,
        name: "Tax Delinquent Year",
      },
      {
        min: minAssessedTotValue,
        max: maxAssessedTotValue,
        name: "Assesed Total Value",
      },
      { min: minDaysMarket, max: maxDaysMarket, name: "MLS Days on Market" },
      { min: minListingPrice, max: maxListingPrice, name: "MLS Listing Price" },
    ];

    for (const pair of fieldPairs) {
      if (
        (pair.min !== "" && pair.max === "") ||
        (pair.min === "" && pair.max !== "")
      ) {
        toast.error(`Please fill both Min and Max ${pair.name}.`);
        return;
      }
    }
    const leadTypesObject = selectedLeadTypes.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});
    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    // const filters = {
    //   min_est_value: parseInt(minPrice),
    //   max_est_value: parseInt(maxPrice),
    //   min_list_price: parseInt(minPriceList),
    //   max_list_price: parseInt(maxPriceList),
    //   min_baths: parseInt(minBath),
    //   max_baths: parseInt(maxBath),
    //   min_beds: parseInt(minBed),
    //   max_beds: parseInt(maxBed),
    //   address: address,
    //   min_stories: parseInt(minStories),
    //   max_stories: parseInt(maxStories),
    //   min_building_size: parseInt(minBuildingSize),
    //   max_building_size: parseInt(maxBuildingSize),
    //   min_lot_size: parseInt(minLotSize),
    //   max_lot_size: parseInt(maxLotSize),
    //   min_year_built: parseInt(minYearBuilt),
    //   max_year_built: parseInt(maxYearBuilt),
    //   min_year_owner: parseInt(minYearOwner),
    //   max_year_owner: parseInt(maxYearOwner),
    //   min_tax_delinquent: parseInt(minTaxDelinquent),
    //   max_tax_delinquent: parseInt(maxTaxDelinquent),
    //   min_property_owned: parseInt(minPropertyOwned),
    //   max_property_owned: parseInt(maxPropertyOwned),
    //   min_portfolio_value: parseInt(minPortfolioValue),
    //   max_portfolio_value: parseInt(maxPortfolioValue),
    //   finance_min_estimated_value: parseInt(minEstimatedValue),
    //   finance_max_estimated_value: parseInt(maxEstimatedValue),
    //   finance_min_estimated_equity: parseInt(minEstimatedEquity),
    //   finance_max_estimated_equity: parseInt(maxEstimatedEquity),
    //   finance_min_assessed_value: parseInt(minAssessedTotValue),
    //   finance_max_assessed_value: parseInt(maxAssessedTotValue),
    //   finance_min_assessed_land_value: parseInt(minAssessedLandValue),
    //   finance_max_assessed_land_value: parseInt(maxAssessedLandValue),
    //   finance_min_assessed_imp_value: parseInt(minAssessedImpValue),
    //   finance_max_assessed_imp_value: parseInt(maxAssessedImpValue),
    //   // finance_min_last_sale_price: parseInt(minLastSalePrice),
    //   // finance_max_last_sale_price: parseInt(maxLastSalePrice),
    //   // finance_min_last_sale_date: minLastSaleDate,
    //   // finance_max_last_sale_date: maxLastSaleDate,
    //   // mls_status: mlsStatus,
    //   forclousre_reo_date: mlsforeclousureSelect,

    //   // mls_min_days_on_market: parseInt(minDaysMarket),
    //   // mls_max_days_on_market: parseInt(maxDaysMarket),
    //   // mls_min_withdrawn_date: minWithDrawnDate,
    //   // mls_max_withdrawn_date: maxWithDrawnDate,

    //   // mls_min_listing_price: parseInt(minListingPrice),
    //   // mls_max_listing_price: parseInt(maxListingPrice),
    //   // fore_status: parseInt(mlsforeclousureSelect),
    //   // fore_min_rec_date: minRecDate,
    //   // fore_max_rec_date: maxRecDate,

    //   // fore_min_auction_date: minAuctionDate,
    //   // fore_max_auction_date: maxAuctionDate,
    //   // selected_lead_type: selectedLeadTypes,

    //   lead_type: selectedLeadTypes,
    //   property_type: selectedPropertyType,
    //   // occupancy_status: occupancyStatus,
    //   mls_has_photos: hasPhotos,
    //   mls_keyword: mlsKeyword,
    //   financial_private_lender: financialPrivateLend,
    //   Owner_occupied: ownerOccupied,
    //   Absentee_Location: absenteeLocation,
    //   Owner_Type: ownerType,
    //   Cash_Buyer: cashBuyer,
    //   ...formData,
    // };
    const filters = {
      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      filterName: formData.filterName,
      address: values.Address,
      city: values.City,
      county: values.County,
      state: values.State,

      zip: values.Zip,
      // house: values.House,
      street: values.street,

      ...leadTypesObject,
      property_types: selectedPropertyTypes,
      max_mls_listing_price: parseNumber(maxListingPrice),
      min_mls_listing_price: parseNumber(minListingPrice),
      max_mls_days_on_market: parseNumber(maxDaysMarket),
      min_mls_days_on_market: parseNumber(minDaysMarket),

      auction_date: minAuctionDate,
      // auction_date_max: maxAuctionDate,
      // pre_foreclosure_date_max: maxRecDate,
      pre_foreclosure_date: minRecDate,

      last_sale_date_min: minLastSaleDate,
      last_sale_date_max: maxLastSaleDate,
      last_sale_price_min: parseInt(minLastSalePrice),
      last_sale_price_max: parseInt(maxLastSalePrice),
      assessed_improvement_value_min: parseInt(minAssessedImpValue),
      assessed_improvement_value_max: parseInt(maxAssessedImpValue),
      assessed_land_value_min: parseInt(minAssessedLandValue),
      assessed_land_value_max: parseInt(maxAssessedLandValue),
      min_assessed_value: parseInt(minAssessedTotValue),
      max_assessed_value: parseInt(maxAssessedTotValue),
      estimated_equity_min: parseInt(minEstimatedEquity),
      estimated_equity_max: parseInt(maxEstimatedEquity),

      // portfolio_value_min: parseInt(minPortfolioValue),
      // portfolio_value_max: parseInt(maxPortfolioValue),
      properties_owned_min: parseInt(minPropertyOwned),
      properties_owned_max: parseInt(maxPropertyOwned),
      min_tax_delinquent_year: parseInt(minTaxDelinquent),
      max_tax_delinquent_year: parseInt(maxTaxDelinquent),
      min_years_owned: parseInt(minYearOwner),
      max_years_owned: parseInt(maxYearOwner),

      min_year_built: parseInt(minYearBuilt),
      max_year_built: parseInt(maxYearBuilt),
      min_lot_size: parseInt(minLotSize),
      max_lot_size: parseInt(maxLotSize),
      min_building_size: parseInt(minBuildingSize),
      max_building_size: parseInt(maxBuildingSize),
      min_stories: parseInt(minStories),
      max_stories: parseInt(maxStories),
      property_type: selectedPropertyType,
      private_lender: financialPrivateLend,

      min_baths: parseInt(minBath),
      baths: parseInt(maxBath),
      min_beds: parseInt(minBed),
      beds: parseInt(maxBed),
      ...formData,
    };
    const requiredFields = [
      filters.address,
      filters.city,
      filters.county,
      filters.state,

      filters.zip,
      // filters.house,
      filters.street,

      filters.est_value,
      // filters.max_est_value,
      filters.min_list_price,
      filters.max_list_price,
      filters.property_types,
      filters.beds,
      filters.min_beds,
      filters.baths,
      filters.min_baths,
      filters.min_stories,
      filters.max_stories,
      filters.max_building_size,
      filters.min_building_size,
      filters.max_lot_size,
      filters.min_lot_size,
      filters.max_year_built,
      filters.min_year_built,
      filters.max_years_owned,
      filters.min_years_owned,
      filters.max_tax_delinquent_year,
      filters.min_tax_delinquent_year,
      filters.min_property_owned,
      filters.max_property_owned,
      filters.min_portfolio_value,
      filters.max_portfolio_value,
      filters.finance_min_estimated_value,
      filters.finance_max_estimated_value,
      filters.finance_min_estimated_equity,
      filters.finance_max_estimated_equity,
      filters.min_assessed_value,
      filters.max_assessed_value,
      filters.finance_min_assessed_imp_value,
      filters.finance_max_assessed_imp_value,
      filters.finance_min_assessed_land_value,
      filters.finance_max_assessed_land_value,
      // filters.finance_min_last_sale_date,
      // filters.finance_max_last_sale_date,
      filters.finance_min_last_sale_price,
      filters.finance_max_last_sale_price,
      filters.max_mls_days_on_market,
      filters.min_mls_days_on_market,
      filters.max_mls_listing_price,
      filters.min_mls_listing_price,
      filters.assessed_value,
      filters.pre_foreclosure_date,
      filters.auction_date,
      filters.tax_delinquent_year,
      // filters.mls_max_days_on_market,
      // filters.mls_min_days_on_market,

      // filters.mls_min_listing_price,
      // filters.mls_max_listing_price,
      // filters.mls_min_withdrawn_date,
      // filters.mls_max_withdrawn_date,
      // filters.fore_min_rec_date,
      // filters.fore_max_rec_date,
      // filters.fore_min_auction_date,
      // filters.fore_max_auction_date,
    ];
    // const requiredFields = [
    //   filters.min_est_value,
    //   filters.max_est_value,
    //   filters.min_list_price,
    //   filters.max_list_price,
    //   filters.max_beds,
    //   filters.min_beds,
    //   filters.max_baths,
    //   filters.min_baths,
    //   filters.min_stories,
    //   filters.max_stories,
    //   filters.min_building_size,
    //   filters.max_building_size,
    //   filters.min_lot_size,
    //   filters.max_lot_size,
    //   filters.min_year_built,
    //   filters.max_year_built,
    //   filters.min_year_owner,
    //   filters.max_year_owner,
    //   filters.min_tax_delinquent,
    //   filters.max_tax_delinquent,
    //   filters.min_property_owned,
    //   filters.max_property_owned,
    //   filters.min_portfolio_value,
    //   filters.max_portfolio_value,
    //   filters.finance_min_estimated_value,
    //   filters.finance_max_estimated_value,
    //   filters.finance_min_estimated_equity,
    //   filters.finance_max_estimated_equity,
    //   filters.finance_min_assessed_value,
    //   filters.finance_max_assessed_value,
    //   filters.finance_min_assessed_imp_value,
    //   filters.finance_max_assessed_imp_value,
    //   filters.finance_min_assessed_land_value,
    //   filters.finance_max_assessed_land_value,
    //   // filters.finance_min_last_sale_date,
    //   // filters.finance_max_last_sale_date,
    //   filters.finance_min_last_sale_price,
    //   filters.finance_max_last_sale_price,
    //   filters.mls_max_days_on_market,
    //   filters.mls_min_days_on_market,
    //   // filters.mls_min_listing_price,
    //   // filters.mls_max_listing_price,
    //   // filters.mls_min_withdrawn_date,
    //   // filters.mls_max_withdrawn_date,
    //   // filters.fore_min_rec_date,
    //   // filters.fore_min_rec_date,
    //   // filters.fore_min_auction_date,
    //   // filters.fore_max_auction_date,
    //   filters.lead_type,
    //   filters.property_type,
    // ];
    const hasValidFilters =
      requiredFields.some((value) => value !== "" && !isNaN(value)) ||
      (filters.address && filters.address !== "") ||
      (filters.city && filters.city !== "") ||
      (filters.county && filters.county !== "") ||
      (filters.state && filters.state !== "") ||
      (filters.zip && filters.zip !== "") ||
      // (filters.house && filters.house !== "") ||
      (filters.street && filters.street !== "") ||
      // address !== "" ||
      // selectedLeadTypes.length > 0 ||
      (selectedLeadTypes !== "" &&
        selectedLeadTypes !== "Lead Types" &&
        selectedLeadTypes.length > 0) ||
      // selectedPropertyType.length > 0;
      (selectedPropertyTypes !== "" &&
        selectedPropertyTypes !== "Property Types" &&
        selectedPropertyTypes.length > 0);
    // selectedleadtype !== "" ||
    // selectedPropertytype !== "";
    if (!hasValidFilters) {
      toast.error("At least one filter field is required");
      return;
    }
    setLoading(true);
    setLoadingSave(true);
    const token = localStorage.getItem("accessToken");
    axios
      .post("/api/properties/save-filter", filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!toastCheck) {
          toast.success("Filter saved successfully");
        }
        setFilterValue(filters);

        fetchFilters();
        setFormData({ filterName: "" });
        setAddress("");
        setMaxBath("");
        setMaxBed("");
        setMinBath("");
        setMinBed("");
        setSelectedBeds("");
        setSelectedBaths("");

        setMaxPriceList("");
        setMinPriceList("");
        setMaxPrice("");
        setMinPrice("");
        setSelectedLeadTypes([]);
        setSelectedPropertyTypes([]);
        setMinStories("");
        setMaxStories("");
        setMinBuildingSize("");
        setMaxBuildingSize("");
        setMinLotSize("");
        setMaxLotSize("");
        setMinYearBuilt("");
        setMaxYearBuilt("");
        setOccupancyStatus("");
        setHasPhotos("");
        setMlsKeyword("");
        setFinancialPrivateLend("");
        setOwnerOccupied("");
        setAbsenteeLocationd("");
        setOwnerType("");
        setCashBuyer("");
        setMinYearOwner("");
        setMaxYearOwner("");
        setMinTaxDelinquent("");
        setMaxTaxDelinquent("");
        setMinPropertyOwned("");
        setMaxPropertyOwned("");
        setMinPortfolioValue("");
        setMaxPortfolioValue("");
        setMinEstimatedValue("");
        setMaxEstimatedValue("");
        setMinEstimatedEquity("");
        setMaxEstimatedEquity("");
        setMinAssessedTotValue("");
        setMaxAssessedTotValue("");
        setMinAssessedLandValue("");
        setMaxAssessedLandValue("");
        setMinAssessedImpValue("");
        setMaxAssessedImpValue("");
        setMinLastSalePrice("");
        setMaxLastSalePrice("");
        setMinLastSaleDate("");
        setMaxLastSaleDate("");
        setMinRecDate("");
        // setMaxRecDate("");
        setMinAuctionDate("");
        // setMaxAuctionDate("");
        setMlsforeclousureSelect("");
        setMinDaysMarket("");
        setMaxDaysMarket("");
        setMlsStatus("");
        setMinWithDrawnDate("");
        setMaxWithDrawnDate("");
        setMinListingPrice("");
        setMaxListingPrice("");
        setValues({
          Address: "",
          City: "",
          County: "",

          State: "",
          Zip: "",

          // House: "",
        });
        setLoadingSave(false);
        setShowModal(false);
        setShowModalOffer(false);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.error("Error saving filters:", error);
        setLoadingSave(false);
      });
  };
  const handleLinkClick = async (e, property, propertyId) => {
    e.preventDefault(); // Prevent the default link behavior
    const payload = {
      comps: "True",
      address: `${property.location}`,
    };
    try {
      await axios.post(`/api/properties-detail/${propertyId}`, payload);
      navigate(`/dashboard/property-detail/${propertyId}`); // Navigate to the new route
    } catch (error) {
      const statusCode = error?.response?.status || "Unknown status";
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      if (statusCode === 404) {
        navigate(`/dashboard/property-detail/${propertyId}`);
        toast.error(errorMessage);
      } else if (statusCode === 500) {
        navigate(`/dashboard/property-detail/${propertyId}`);
        toast.error(errorMessage);
      }
      console.error(`Error (${statusCode}): ${errorMessage}`);
      // toast.error(`Error (${statusCode}): ${errorMessage}`);
    }
  };
  const handleMlsHasPhotos = (value) => {
    if (hasPhotos.includes(value)) {
      setHasPhotos(hasPhotos.filter((item) => item !== value));
    } else {
      setHasPhotos([...hasPhotos, value]);
    }
  };
  const handleMlsKeyword = (value) => {
    if (mlsKeyword.includes(value)) {
      setMlsKeyword(mlsKeyword.filter((item) => item !== value));
    } else {
      setMlsKeyword([...mlsKeyword, value]);
    }
  };
  const handlePrivateLender = (value) => {
    if (financialPrivateLend === value) {
      setFinancialPrivateLend(null); // Deselect if the same value is clicked again
    } else {
      setFinancialPrivateLend(value); // Set the new value
    }
  };
  // const handlePrivateLender = (value) => {
  //   if (financialPrivateLend.includes(value)) {
  //     setFinancialPrivateLend(
  //       financialPrivateLend.filter((item) => item !== value)
  //     );
  //   } else {
  //     setFinancialPrivateLend([...financialPrivateLend, value]);
  //   }
  // };
  const handleOwnerOccupied = (value) => {
    if (ownerOccupied.includes(value)) {
      setOwnerOccupied(ownerOccupied.filter((item) => item !== value));
    } else {
      setOwnerOccupied([...ownerOccupied, value]);
    }
  };
  const handleAbsenteeLocation = (value) => {
    if (absenteeLocation.includes(value)) {
      setAbsenteeLocationd(absenteeLocation.filter((item) => item !== value));
    } else {
      setAbsenteeLocationd([...absenteeLocation, value]);
    }
  };
  const handleOwnerType = (value) => {
    if (ownerType.includes(value)) {
      setOwnerType(ownerType.filter((item) => item !== value));
    } else {
      setOwnerType([...ownerType, value]);
    }
  };
  const handleCashBuyer = (value) => {
    if (cashBuyer.includes(value)) {
      setCashBuyer(cashBuyer.filter((item) => item !== value));
    } else {
      setCashBuyer([...cashBuyer, value]);
    }
  };
  const handleOccupancyChange = (value) => {
    if (occupancyStatus.includes(value)) {
      setOccupancyStatus(occupancyStatus.filter((item) => item !== value));
    } else {
      setOccupancyStatus([...occupancyStatus, value]);
    }
  };
  // const handleOccupancyChange = (status) => {
  //   setOccupancyStatus([status]);
  // };
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };
  const handleBedsClick = (event) => {
    event.stopPropagation();
    setActiveButton("beds");
    setShowBeds(!showBeds);
    setShowBaths(false);
  };
  const handleBathsClick = (event) => {
    event.stopPropagation();
    setActiveButton("baths");
    setShowBaths(!showBaths);
    setShowBeds(false);
  };

  //start show flask icon
  const isAnyInputFilledBed = () => {
    return minBed.length > 0 || maxBed.length > 0;
  };
  // const isBedSelected = minBed !== "";
  const isAnyInputFilledBath = () => {
    return minBath.length > 0 || maxBath.length > 0;
  };
  // const isBathSelected = minBath !== "";
  const isAnyInputFilled = () => {
    return (
      minStories.length > 0 ||
      maxStories.length > 0 ||
      minBuildingSize.length > 0 ||
      maxBuildingSize.length > 0 ||
      minLotSize.length > 0 ||
      maxLotSize.length > 0 ||
      minYearBuilt.length > 0 ||
      maxYearBuilt.length > 0 ||
      selectedPropertyTypes.length > 0 ||
      (minBath && minBath.length > 0) ||
      (maxBath && maxBath.length > 0) ||
      (minBed && minBed.length > 0) ||
      (maxBed && maxBed.length > 0)
    );
  };
  const isAnyInputFilledOwner = () => {
    return (
      minTaxDelinquent.length > 0 ||
      minYearOwner.length > 0 ||
      maxYearOwner.length > 0 ||
      maxTaxDelinquent.length > 0
    );
  };
  const isAnyInputFilledForeclousure = () => {
    return minAuctionDate.length > 0 || minRecDate.length > 0;
  };
  const isAnyInputFilledMls = () => {
    return (
      minDaysMarket.length > 0 ||
      maxDaysMarket.length > 0 ||
      minListingPrice.length > 0 ||
      maxListingPrice.length > 0
    );
  };
  const isAnyInputFilledFinancial = () => {
    return minAssessedTotValue.length > 0 || maxAssessedTotValue.length > 0;
  };
  const isPropertyTypes = () => {
    return selectedPropertyTypes.length > 0;
  };
  const isBath = () => {
    return (minBath && minBath.length > 0) || (maxBath && maxBath.length > 0);
  };

  const isBed = () => {
    return (minBed && minBed.length > 0) || (maxBed && maxBed.length > 0);
  };

  const isAnyFilterFilled = () => {
    return (
      isAnyInputFilled() ||
      isAnyInputFilledOwner() ||
      isAnyInputFilledForeclousure() ||
      isAnyInputFilledMls() ||
      isAnyInputFilledFinancial() ||
      isPropertyTypes() ||
      isBed() ||
      isBath()
    );
  };
  //end show flask icon
  // const handleBedsClick = (event) => {
  //   event.stopPropagation();
  //   const bed = event.target.innerText;

  //   if (bed !== "No. of Bedrooms") {
  //     setSelectedBeds(bed);
  //   }
  //   setShowBeds(true);
  //   setShowBaths(false);

  //   setActiveButton("beds");
  // };

  // const handleBathsClick = (event) => {
  //   event.stopPropagation();
  //   const bath = event.target.innerText;

  //   if (bath !== "No. of Bathrooms") {
  //     setSelectedBaths(bath);
  //   }
  //   setShowBaths(true);
  //   setShowBeds(false);

  //   setActiveButton("baths");
  // };

  const handleShowPriceRange = (event) => {
    event.stopPropagation();
    setShowDataMessage(false);
    setShowInputField(false);
    setShowPriceRange(true);
    setActiveButtonP("priceRange");
  };

  const handleShowDataClick = (event) => {
    event.stopPropagation();
    setShowDataMessage(true);

    setShowPriceRange(false);
    setActiveButtonP("showData");
  };
  // const handleResetProperty = () => {
  //   setSelectedPropertyType("Property Types");
  // };
  const handleResetClickListprice = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinPriceList("");
    setMaxPriceList("");
  };
  const handleResetClick = () => {
    setMinBed("");
    setMaxBed("");
    setMinBath("");
    setMaxBath("");
  };
  const displayText = () => {
    if (maxBed && maxBath) return `${maxBed} bd / ${maxBath} ba`;
    if (maxBed) return `${maxBed} Bed(s)`;
    if (maxBath) return `${maxBath} Bath(s)`;
    return "Beds/Baths"; // Default text
  };
  const handleResetClickBath = () => {
    setMinBath("");
    setMaxBath("");
  };
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <img className="brands_arrow" src={rightarrow} />,
    prevArrow: <img className="brands_arrow" src={leftarrow} />,
  };
  useEffect(() => {
    if (fetchedProperties.length >= 0 && savedOfferSent.length >= 0) {
      const filteredProperties = fetchedProperties.filter(
        (property) =>
          !savedOfferSent.some(
            (svPropertyOffer) => svPropertyOffer.property_id === property.id
          )
      );
      setOnclickProperty(filteredProperties);
      // setProperties(
      //   filteredProperties.map((property) => ({
      //     ...property,
      //     formattedDate: formatDate(property.recordingDate),
      //   }))
      // );

      setPropertiesCount(filteredProperties.length);
    }
  }, [fetchedProperties, savedOfferSent]);
  const showMoreProperties = async () => {
    setPaginationLoading(true);
    axios
      .get(
        `/api/properties-sequential?last_evaluated_key={"id":"${lastEvaluatedKey}"}`
      )
      .then((response) => {
        const fetchedProperties = response.data.properties || [];
        // Merge new properties with existing ones
        const updatedProperties = [
          ...properties,
          ...fetchedProperties.map((property) => ({
            ...property,
            formattedDate: formatDate(property.recordingDate),
          })),
        ];

        // Filter properties as needed
        const filteredProperties = updatedProperties.filter(
          (property) =>
            !savedOfferSent.some(
              (svPropertyOffer) => svPropertyOffer.property_id === property.id
            )
        );

        setProperties(updatedProperties);

        setOnclickProperty(filteredProperties); // Update this state as needed
        setPropertiesCount(filteredProperties.length);

        setInterestRates(
          response.data.interest_rate?.map((rate) => ({
            ...rate,
            formattedYear: formatDate(rate.year),
          }))
        );
        setLastEvaluatedKey(response.data.last_evaluated_key.id);
        setShowButton(true);

        setSelectedProperties([]);
        setAllSelected(false);
        setLoading(false);
        setloader(false);
        setPaginationLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
        setloader(false);
        setPaginationLoading(false);
      });
  };

  useEffect(() => {
    if (!offerSentD) {
      if (!favorites) {
        if (!filtersApplied) {
          setPaginationLoading(true);
          axios
            .get(`/api/properties-sequential`)

            .then((response) => {
              const fetchedProperties = response.data.properties || [];
              setFetchedProperties(fetchedProperties);
              const filteredProperties = fetchedProperties.filter(
                (property) =>
                  !savedOfferSent.some(
                    (svPropertyOffer) =>
                      svPropertyOffer.property_id === property.id
                  )
              );

              setSelectedProperties([]);
              setAllSelected(false);
              setProperties(
                response.data.properties?.map((property) => ({
                  ...property,
                  formattedDate: formatDate(property.recordingDate),
                }))
              );
              setLastEvaluatedKey(response.data.last_evaluated_key.id);
              setShowButton(true);
              setInterestRates(
                response.data.interest_rate?.map((rate) => ({
                  ...rate,
                  formattedYear: formatDate(rate.year),
                }))
              );
              setPropertiesCount(filteredProperties.length);

              // setCurrentPage(response.data.current_page);
              // setTotalPages(response.data.total_pages);
              setLoading(false);
              setloader(false);
              setPaginationLoading(false);
            })
            .catch((error) => {
              // alert(error.message);
              toast.error(error.message);
              setLoading(false);
              setloader(false);
              setPaginationLoading(false);
            });
        } else {
          const token = localStorage.getItem("accessToken");
          setPaginationLoading(true);
          axios
            .post(`/api/properties/filter?page=${currentPage}`, filterValue, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              if (response.data.bridgeProperties) {
                setOfferSentD(false);
                setFavorites(false);

                const fetchedProperties = response.data.bridgeProperties || [];
                setFetchedProperties(fetchedProperties);
                const filteredProperties = fetchedProperties.filter(
                  (property) =>
                    !savedOfferSent.some(
                      (svPropertyOffer) =>
                        svPropertyOffer.property_id === property.id
                    )
                );
                setSelectedProperties([]);
                setAllSelected(false);
                const formattedProperties = response.data.bridgeProperties?.map(
                  (property) => ({
                    ...property,
                    formattedDate: formatDate(property.recordingDate),
                  })
                );
                setProperties(formattedProperties);
                setInterestRates(
                  response.data.interest_rate?.map((rate) => ({
                    ...rate,
                    formattedYear: formatDate(rate.year),
                  }))
                );
                setPropertiesCount(filteredProperties.length);

                // setProperties(response.data.bridgeProperties);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.total_pages);
                setBridgeData("true");
                setBackArrow(true);
                setShowImage(true);
                setHeading("Filters");
                setShowPropertiesInfo(true);
                setShowButton(false);
                setPaginationLoading(false);
                const apiData = response.data.bridgeProperties;
                const apiDataPayload = apiData.map((property) => ({
                  id: property.id,
                  location_for_transaction: property.location_for_transaction,
                  location_for_zestimate: property.location_for_zestimate,
                }));
                axios
                  .post(`/api/bridge-secondary-call`, apiDataPayload)
                  .then((tzResponse) => {
                    const secondaryData = tzResponse.data;
                    const updatedProperties = formattedProperties.map(
                      (property) => {
                        const match = secondaryData.find(
                          (secData) => secData.id === property.id
                        );
                        if (match) {
                          return {
                            ...property,
                            ...match,
                            formattedDate: formatDate(match.recordingDate),
                          };
                        }

                        return property;
                      }
                    );

                    setProperties(updatedProperties);
                    setInterestRates(
                      response.data.interest_rate?.map((rate) => ({
                        ...rate,
                        formattedYear: formatDate(rate.year),
                      }))
                    );
                  })
                  .catch((error) => {
                    console.error("Error fetching secondary API data:", error);
                  });
              } else {
                const fetchedProperties = response.data.properties || [];
                setFetchedProperties(fetchedProperties);
                const filteredProperties = fetchedProperties.filter(
                  (property) =>
                    !savedOfferSent.some(
                      (svPropertyOffer) =>
                        svPropertyOffer.property_id === property.id
                    )
                );
                setSelectedProperties([]);
                setAllSelected(false);
                setOfferSentD(false);
                setFavorites(false);
                setPropertiesCount(filteredProperties.length);
                setShowButton(false);
                setProperties(response.data.properties);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.total_pages);
                setBackArrow(true);
                setShowImage(true);
                setBridgeData("false");
                setHeading("Filters");
                setPaginationLoading(false);
              }
              setloader(false);
            })
            .catch((error) => {
              // alert(error.message);
              toast.error(error.message);
              setLoading(false);
            });
        }
      } else {
        const token = localStorage.getItem("accessToken");
        setPaginationLoading(true);
        axios
          .get(`/api/saved-lists-properties?page=${currentPage}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const fetchedProperties = response.data.properties || [];
            setFetchedProperties(fetchedProperties);
            const filteredProperties = fetchedProperties.filter(
              (property) =>
                !savedOfferSent.some(
                  (svPropertyOffer) =>
                    svPropertyOffer.property_id === property.id
                )
            );
            setSelectedProperties([]);
            setAllSelected(false);
            setHeading("FAVORITES");
            setloader(false);
            setPropertiesCount(filteredProperties.length);
            setShowButton(false);
            setProperties(response.data.properties);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.total_pages);
            setLoading(false);
            setBackArrow(true);
            setShowImage(true);
            setShowButton(false);
            setPaginationLoading(false);
            // console.log("object");
          })
          .catch((error) => {
            // alert(error.message);
            toast.error(error.message);
            setLoading(false);
          });
      }
    } else {
      const token = localStorage.getItem("accessToken");
      setPaginationLoading(true);
      axios
        .get(`/api/send-offer-properties?page=${currentPage}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const fetchedProperties = response.data.properties || [];
          setFetchedProperties(fetchedProperties);
          const filteredProperties = fetchedProperties.filter(
            (property) =>
              !savedOfferSent.some(
                (svPropertyOffer) => svPropertyOffer.property_id === property.id
              )
          );
          setSelectedProperties([]);
          setAllSelected(false);
          setHeading("OFFER SENT");
          setloader(false);
          setPropertiesCount(filteredProperties.length);

          setProperties(response.data.properties);
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
          setLoading(false);
          // console.log("object");
          setBackArrow(true);
          setShowButton(false);
          setShowImage(true);
          setPaginationLoading(false);
        })
        .catch((error) => {
          // alert(error.message);
          toast.error(error.message);
          setLoading(false);
        });
    }
  }, [currentPage]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = { year: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const getInterestRate = (formattedDate) => {
    const rate = interestRates?.find(
      (item) => item.formattedYear === formattedDate
    );
    return rate ? rate.interest_rate : "N/A";
  };
  const handleSaveFiltersOffer = () => {
    // console.log("handleSaveFiltersOffer triggered");

    setShowModalOffer(true);
    setModalData();
    // console.log("hndle save filter", property);
  };
  const handleSaveFilters = () => {
    setShowModal(true);
  };
  useEffect(() => {
    const offerSent = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/send-offer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSavedOfferSent(response.data);
        // setSavedProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    offerSent();
  }, []);
  useEffect(() => {
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

    fetchSavedProperties();
  }, []);
  const propertyDetailDash = (id, rate) => {
    setPropertyDetail(true);
    setpropertyDetailId(id);
    setMuiRate(rate);
  };
  const handleHeartClick = async (propertyId, address) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/saved-lists",
        {
          property_id: propertyId,
          property_address: address,
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
  const handleFillHeartClick = async (propertyId) => {
    try {
      await axios.delete(`/api/saved-lists/${propertyId}`);
      if (!toastCheck) {
        toast.success("Property Unsaved successfully");
      }
      const updatedSavedProperties = savedProperties.filter(
        (property) => property.id !== propertyId
      );
      setSavedProperties(updatedSavedProperties);
    } catch (error) {
      console.error("Failed to delete property ID", error);
      toast.error("Failed to delete property ID");
    }
  };
  const handleFavoritesClick = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`/api/saved-lists-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.properties.length === 0) {
        toast.info("No Favorite Property found.");

        setProperties([]);
        setHeading("FAVORITES");
        setBackArrow(true);
        setShowImage(true);
        // setTotalPages([]);
      } else {
        const fetchedProperties = response.data.properties || [];
        setFetchedProperties(fetchedProperties);
        const filteredProperties = fetchedProperties.filter(
          (property) =>
            !savedOfferSent.some(
              (svPropertyOffer) => svPropertyOffer.property_id === property.id
            )
        );
        setSelectedProperties([]);
        setAllSelected(false);
        setHeading("FAVORITES");
        setShowButton(false);
        setFavorites(true);
        setOfferSentD(false);
        if (!toastCheck) {
          toast.success("Favorities Property found successfully");
        }
        setPropertiesCount(filteredProperties.length);

        setProperties(response.data.properties);
        setTotalPages(response.data.total_pages);
        // setFiltersApplied(false);
        // setApiCalled(true);
        setFilterValue(filters);
        setBackArrow(true);
        setShowImage(true);
      }

      setLoadingSearch(false);
    } catch (error) {
      toast.error("Failed to search filter. Please try again");
      setLoadingSearch(false);
    }
  };

  const handleOfferSent = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("/api/send-offer-properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.properties.length === 0) {
        toast.info("No Offers Sent Property found");
        setHeading("OFFER SENT");
        setProperties([]);
        setBackArrow(true);
        setShowImage(true);
        // setTotalPages([]);
      } else {
        setHeading("OFFER SENT");
        setOfferSentD(true);
        setFavorites(false);
        if (!toastCheck) {
          toast.success("Offers Sent Property found successfully");
        }
        setShowButton(false);
        setProperties(response.data.properties);
        setTotalPages(response.data.total_pages);
        // setFiltersApplied(true);
        // setApiCalled(true);
        setFilterValue(filters);
        setShowButton(false);
        setBackArrow(true);
        setShowImage(true);
      }

      setLoadingSearch(false);
    } catch (error) {
      toast.error("Failed to search filter. Please try again");
      setLoadingSearch(false);
    }
  };
  const fetchTemplates = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/auto-offer-send-setting", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log("check", response.data);
      setData(response.data.offers);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);
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
        setId(data.id);
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
  const handleSelect = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleAddProperty = (id) => {
    // console.log("add", id);
    setSelectedProperties((prevSelectedProperties) => [
      ...prevSelectedProperties,
      id,
    ]);
  };
  const handleRemoveProperty = (id) => {
    // console.log("remove", id);
    setSelectedProperties((prevSelectedProperties) =>
      prevSelectedProperties.filter((propertyId) => propertyId !== id)
    );
  };
  const isPropertySelected = (id) => {
    return selectedProperties.includes(id);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProperties);

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, []);

  // console.log("TOKEN-----", token);
  // if (!token) {
  //   return <Navigate to="/" />;
  // }
  return (
    <>
      {propertyDetail ? (
        <PropertyDetail
          dataId={propertyDetailId}
          muiId={muiRate}
          onBack={handleBackToDashboard}
        />
      ) : (
        <div className="app-main-container">
          <div className="app-main-left-container">
            <Sidenav />
          </div>
          <div className="app-main-right-container">
            <Navbar />
            <div className="dashboard-main-container">
              <p className="dashboard-text">
                {showImage && (
                  <span onClick={() => navigate("/")}>
                    <img
                      src={backarrow}
                      alt="backarrow"
                      className="backarrow_img"
                    />
                  </span>
                )}

                {/* <span> Dashboard</span>        */}
                <span>
                  {heading === "DASHBOARD" ? (
                    "DASHBOARD"
                  ) : (
                    <>
                      <span onClick={() => navigate("/")}>
                        {" "}
                        <span className="dashboard_filters">
                          DASHBOARD
                        </span>{" "}
                      </span>
                      <span className="arrow_dashboard">&#62;</span>
                      <span className="heading_filter">{heading}</span>
                    </>
                  )}
                </span>
              </p>
              <div className="filter-main-container">
                <div
                  className="search-main-container"
                  style={{
                    border:
                      values[selectedOption1]?.length > 0
                        ? "1px solid #002dff"
                        : "",
                    borderRadius: "5px",
                  }}
                >
                  <form className="w-100" onSubmit={handleSubmit}>
                    <InputGroup>
                      <Dropdown isOpen={dropdownOpen1} toggle={toggleDropdown1}>
                        <DropdownToggle caret className="county_address ">
                          {selectedOption1}
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu11">
                          <DropdownItem
                            onClick={() => handleSelect1("Address")}
                          >
                            Address
                          </DropdownItem>
                          <DropdownItem onClick={() => handleSelect1("City")}>
                            City
                          </DropdownItem>
                          <DropdownItem onClick={() => handleSelect1("County")}>
                            County
                          </DropdownItem>

                          <DropdownItem onClick={() => handleSelect1("State")}>
                            State
                          </DropdownItem>
                          <DropdownItem onClick={() => handleSelect1("Zip")}>
                            Zip
                          </DropdownItem>
                          {/* <DropdownItem onClick={() => handleSelect1("House")}>
                          House
                        </DropdownItem> */}
                        </DropdownMenu>
                      </Dropdown>
                      <img
                        className="search-icon search-icon-dash"
                        src={search}
                        alt="search"
                      />
                      <Input
                        placeholder={placeholders[selectedOption1]}
                        value={values[selectedOption1]}
                        onChange={handleInputChange}

                        // onChange={(e) => setAddress(e.target.value)}
                      />
                    </InputGroup>
                  </form>
                </div>
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggleDropdown}
                  style={{
                    border:
                      selectedLeadTypes.length > 0 ? "1px solid #002dff" : "",
                    borderRadius: "5px",
                  }}
                >
                  <DropdownToggle className="filter-types-main-container" caret>
                    {selectedLeadTypes.length === 0
                      ? "Lead Types"
                      : `Lead Types (${selectedLeadTypes.length})`}
                  </DropdownToggle>
                  <DropdownMenu>
                    {leadTypes.map((leadType) => {
                      const isSelected = selectedLeadTypes.includes(leadType); // Check if the lead type is selected
                      return (
                        <DropdownItem
                          key={leadType}
                          toggle={false}
                          style={{
                            backgroundColor: isSelected ? "#f2f3f8" : "white",
                            color: isSelected ? "black" : "black",
                          }} // Change background color
                        >
                          <label style={{ cursor: "pointer" }}>
                            {/* Show tick mark if selected */}
                            {isSelected && (
                              <span
                                style={{ marginRight: "5px", color: "green" }}
                              >
                                ✓
                              </span>
                            )}
                            {leadType}
                            {/* Show count if selected */}

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(leadType)} // Call function on change
                              style={{ display: "none" }} // Hide the checkbox
                            />
                          </label>
                        </DropdownItem>
                      );
                    })}
                    <DropdownItem divider />
                    <DropdownItem className="btn-reset" onClick={handleReset}>
                      Reset
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown
                  isOpen={propertyDropdownOpen}
                  toggle={togglePropertyDropdown}
                  style={{
                    border:
                      selectedPropertyTypes.length > 0
                        ? "1px solid #002dff"
                        : "",
                    borderRadius: "5px",
                  }}
                >
                  <DropdownToggle className="filter-types-main-container" caret>
                    {selectedPropertyTypes.length === 0
                      ? "Property Types"
                      : `Property Types (${selectedPropertyTypes.length})`}
                  </DropdownToggle>
                  <DropdownMenu>
                    {propertyTypes.map((type) => {
                      const isSelected = selectedPropertyTypes.includes(type); // Check if the type is selected
                      return (
                        <DropdownItem
                          key={type}
                          toggle={false}
                          style={{
                            backgroundColor: isSelected ? "#f2f3f8" : "white",
                            color: isSelected ? "black" : "black",
                          }} // Change background color
                          onClick={() => handleCheckboxChangeP(type)} // Call the selection handler on click
                        >
                          <label style={{ cursor: "pointer" }}>
                            {/* Show tick mark if selected */}
                            {isSelected && (
                              <span
                                style={{ marginRight: "5px", color: "green" }}
                              >
                                ✓
                              </span>
                            )}
                            {type}
                          </label>
                        </DropdownItem>
                      );
                    })}
                    <DropdownItem divider />
                    <DropdownItem
                      className="btn-reset"
                      onClick={handleResetProperty}
                    >
                      Reset
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <div className="dropdown">
                  <div
                    className="dropdown-toggle filter-types-main-container"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      border:
                        minPriceList.length > 0 ||
                        maxPriceList.length > 0 ||
                        minPrice.length > 0 ||
                        maxPrice.length > 0
                          ? "1px solid #002dff"
                          : "",
                      borderRadius: "5px",
                    }}
                  >
                    <span>
                      {" "}
                      Price{" "}
                      {(minPriceList.length > 0 ||
                        maxPriceList.length > 0 ||
                        minPrice.length > 0 ||
                        maxPrice.length > 0) && (
                        <FaFilter style={{ marginLeft: "0px" }} />
                      )}
                    </span>
                  </div>
                  <ul className="dropdown-menu price-hei">
                    <li>
                      <div className="d-flex justify-content-between btn-price-range-both">
                        <button
                          className={`dropdown-item btn-price-range ${
                            activeButtonP === "priceRange" ? "active" : ""
                          }`}
                          type="button"
                          onClick={handleShowPriceRange}
                        >
                          <span className="">
                            Estimated Value{" "}
                            {(maxPrice.length > 0 || minPrice.length > 0) && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}{" "}
                          </span>
                        </button>
                        <button
                          className={`dropdown-item btn-show-data ${
                            activeButtonP === "showData" ? "active" : ""
                          }`}
                          type="button"
                          onClick={handleShowDataClick}
                        >
                          <span>
                            List Price
                            {(minPriceList.length > 0 ||
                              maxPriceList.length > 0) && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}
                          </span>
                        </button>
                      </div>
                    </li>
                    {showPriceRange && (
                      <li className="price-range-section1">
                        {/* <p className="pt-3"></p> */}
                        <span>Estimated Value</span>
                        <div className="d-flex justify-content-between">
                          <span className="dollar_input">$</span>{" "}
                          <select
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Min Est Price
                            </option>

                            <option value="100000" className="SelectOption">
                              100k
                            </option>
                            <option value="200000" className="SelectOption">
                              200k
                            </option>
                            <option value="300000" className="SelectOption">
                              300k
                            </option>
                            <option value="400000" className="SelectOption">
                              400k
                            </option>
                            <option value="500000" className="SelectOption">
                              500k
                            </option>
                            <option value="600000" className="SelectOption">
                              600k
                            </option>
                            <option value="700000" className="SelectOption">
                              700k
                            </option>
                            <option value="800000" className="SelectOption">
                              800k
                            </option>
                            <option value="900000" className="SelectOption">
                              900k
                            </option>
                          </select>
                          {/* <input
                            type="text"
                            placeholder="Est. Value"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="input_css input_css1"
                          /> */}
                          <hr className="vertical-divider" />
                          {/* <input
                            type="text"
                            placeholder="Max Est. Value"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="input_css"
                          /> */}
                          <span className="dollar_input">$</span>{" "}
                          <select
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Max Est Price
                            </option>

                            <option value="100000" className="SelectOption">
                              100k
                            </option>
                            <option value="200000" className="SelectOption">
                              200k
                            </option>
                            <option value="300000" className="SelectOption">
                              300k
                            </option>
                            <option value="400000" className="SelectOption">
                              400k
                            </option>
                            <option value="500000" className="SelectOption">
                              500k
                            </option>
                            <option value="600000" className="SelectOption">
                              600k
                            </option>
                            <option value="700000" className="SelectOption">
                              700k
                            </option>
                            <option value="800000" className="SelectOption">
                              800k
                            </option>
                            <option value="900000" className="SelectOption">
                              900k
                            </option>
                            <option value="1000000" className="SelectOption">
                              1M
                            </option>
                            <option value="1250000" className="SelectOption">
                              1.25M
                            </option>
                            <option value="1500000" className="SelectOption">
                              1.50M
                            </option>
                            <option value="1750000" className="SelectOption">
                              1.75M
                            </option>
                          </select>
                        </div>
                        <button
                          className="dropdown-item btn-reset"
                          type="button"
                          onClick={handleResetClickEstimatedValue}
                        >
                          Reset
                        </button>
                      </li>
                    )}

                    {showDataMessage && (
                      <li className="price-range-section1">
                        {/* <p className="pt-3"></p> */}
                        <span>List Price</span>
                        <div className="d-flex justify-content-between">
                          <span className="dollar_input">$</span>{" "}
                          {/* <input
                            type="text"
                            placeholder="Min List price"
                            value={minPriceList}
                            onChange={(e) => setMinPriceList(e.target.value)}
                            className="input_css"
                            required={maxPriceList === ""}
                          /> */}
                          <select
                            value={minPriceList}
                            onChange={(e) => setMinPriceList(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Min List Price
                            </option>

                            <option value="100000" className="SelectOption">
                              100k
                            </option>
                            <option value="200000" className="SelectOption">
                              200k
                            </option>
                            <option value="300000" className="SelectOption">
                              300k
                            </option>
                            <option value="400000" className="SelectOption">
                              400k
                            </option>
                            <option value="500000" className="SelectOption">
                              500k
                            </option>
                            <option value="600000" className="SelectOption">
                              600k
                            </option>
                            <option value="700000" className="SelectOption">
                              700k
                            </option>
                            <option value="800000" className="SelectOption">
                              800k
                            </option>
                            <option value="900000" className="SelectOption">
                              900k
                            </option>
                          </select>
                          <hr className="vertical-divider" />
                          <span className="dollar_input">$</span>{" "}
                          {/* <input
                            type="text"
                            placeholder="Max List price"
                            value={maxPriceList}
                            onChange={(e) => setMaxPriceList(e.target.value)}
                            className="input_css"
                            required={minPriceList === ""}
                          /> */}
                          <select
                            value={maxPriceList}
                            onChange={(e) => setMaxPriceList(e.target.value)}
                            className="input_css custom-select"
                          >
                            <option value="" disabled>
                              Select Max List Price
                            </option>

                            <option value="100000" className="SelectOption">
                              100k
                            </option>
                            <option value="200000" className="SelectOption">
                              200k
                            </option>
                            <option value="300000" className="SelectOption">
                              300k
                            </option>
                            <option value="400000" className="SelectOption">
                              400k
                            </option>
                            <option value="500000" className="SelectOption">
                              500k
                            </option>
                            <option value="600000" className="SelectOption">
                              600k
                            </option>
                            <option value="700000" className="SelectOption">
                              700k
                            </option>
                            <option value="800000" className="SelectOption">
                              800k
                            </option>
                            <option value="900000" className="SelectOption">
                              900k
                            </option>
                            <option value="1000000" className="SelectOption">
                              1M
                            </option>
                            <option value="1250000" className="SelectOption">
                              1.25M
                            </option>
                            <option value="1500000" className="SelectOption">
                              1.50M
                            </option>
                            <option value="1750000" className="SelectOption">
                              1.75M
                            </option>
                          </select>
                        </div>
                        <button
                          className="dropdown-item btn-reset"
                          type="button"
                          id="resetPriceButton"
                          onClick={handleResetClickListPrice}
                        >
                          Reset
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="dropdown">
                  <div
                    className="dropdown-toggle filter-types-main-container"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      border:
                        maxBath.length > 0 || maxBed.length > 0
                          ? "1px solid #002dff"
                          : "",
                      borderRadius: "5px",
                    }}
                  >
                    {displayText()}
                    {/* {(isAnyInputFilledBed() || isAnyInputFilledBath()) && (
                      <FaFilter style={{ marginLeft: "0px" }} />
                    )} */}
                  </div>
                  <ul className="dropdown-menu bed-bath-hei">
                    <li className="price-range-section1">
                      <div className="d-flex justify-content-between">
                        {/* <input
                            type="text"
                            placeholder="Min Bed"
                            value={minBed}
                            onChange={(e) => setMinBed(e.target.value)}
                            className="input_css"
                            required={maxBed === ""}
                          /> */}
                        <div className="grid w-full grid-cols-6 mb-2">
                          <p className="p-0 m-0 heading_bed-bath">
                            Number of Bedrooms
                          </p>
                          {buttonLabels.map((label, index) => {
                            const isFirst = index === 0;
                            const isLast = index === buttonLabels.length - 1;
                            const isActive =
                              parseInt(label) === parseInt(maxBed);

                            return (
                              <button
                                key={label}
                                type="button"
                                className={`shrink-0 border border-gray-300 px-4 py-1 ${
                                  isFirst ? "rounded-l-md" : ""
                                } ${isLast ? "rounded-r-md" : ""} ${
                                  isActive
                                    ? "bg-primary-900 text-primary-100"
                                    : "bg-white text-gray-500 transition-all duration-300 hover:bg-primary-900 hover:text-primary-100"
                                }`}
                                onClick={() => handleClick(label)}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>

                        {/* <select
                            value={minBed}
                            onChange={(e) => setMinBed(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Min Bed
                            </option>

                            <option value="1" className="SelectOption">
                              1+
                            </option>
                            <option value="2" className="SelectOption">
                              2+
                            </option>
                            <option value="3" className="SelectOption">
                              3+
                            </option>
                            <option value="4" className="SelectOption">
                              4+
                            </option>
                            <option value="5" className="SelectOption">
                              5+
                            </option>
                          </select> */}
                        {/* <hr className="vertical-divider" /> */}
                        {/* <input
                            type="text"
                            placeholder="Max Bed"
                            value={maxBed}
                            onChange={(e) => setMaxBed(e.target.value)}
                            className="input_css"
                            required={minBed === ""}
                          /> */}
                        {/* <hr className="vertical-divider" />*/}
                        {/* <select
                            value={maxBed}
                            onChange={(e) => setMaxBed(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Max Bed
                            </option>
                            <option value="1" className="SelectOption">
                              1+
                            </option>
                            <option value="2" className="SelectOption">
                              2+
                            </option>
                            <option value="3" className="SelectOption">
                              3+
                            </option>
                            <option value="4" className="SelectOption">
                              4+
                            </option>
                            <option value="5" className="SelectOption">
                              5+
                            </option>
                          </select> */}
                      </div>

                      <div className="grid w-full grid-cols-6">
                        <p className="p-0 m-0 heading_bed-bath">
                          Number of Bathrooms
                        </p>
                        {buttonLabels.map((label, index) => {
                          const isFirst = index === 0;
                          const isLast = index === buttonLabels.length - 1;
                          // const isActive = label === "Any";
                          // const isActive = label === maxBath;
                          const isActive =
                            parseInt(label) === parseInt(maxBath);
                          return (
                            <button
                              key={label}
                              type="button"
                              className={`shrink-0 border border-gray-300 px-4 py-1 ${
                                isFirst ? "rounded-l-md" : ""
                              } ${isLast ? "rounded-r-md" : ""} ${
                                isActive
                                  ? "bg-primary-900 text-primary-100"
                                  : "bg-white text-gray-500 transition-all duration-300 hover:bg-primary-900 hover:text-primary-100"
                              }`}
                              onClick={() => handleClickBath(label)}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        className="dropdown-item btn-reset"
                        type="button"
                        onClick={handleResetClick}
                      >
                        Reset
                      </button>
                    </li>

                    {showBaths && (
                      <li className="price-range-section1">
                        <p className="pt-3"></p>
                        <div className="d-flex justify-content-between">
                          {/* <input
                            type="text"
                            placeholder="Min Bath"
                            value={minBath}
                            onChange={(e) => setMinBath(e.target.value)}
                            className="input_css"
                            required={maxBath === ""}
                          /> */}
                          <select
                            value={minBath}
                            onChange={(e) => setMinBath(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Min Bath
                            </option>

                            <option value="1" className="SelectOption">
                              1+
                            </option>
                            <option value="2" className="SelectOption">
                              2+
                            </option>
                            <option value="3" className="SelectOption">
                              3+
                            </option>
                            <option value="4" className="SelectOption">
                              4+
                            </option>
                            <option value="5" className="SelectOption">
                              5+
                            </option>
                          </select>
                          <hr className="vertical-divider" />
                          {/* <input
                            type="text"
                            placeholder="Min Bath"
                            value={maxBath}
                            onChange={(e) => setMaxBath(e.target.value)}
                            className="input_css"
                            required={minBath === ""}
                          /> */}
                          {/* <hr className="vertical-divider" />*/}
                          <select
                            value={maxBath}
                            onChange={(e) => setMaxBath(e.target.value)}
                            className="input_css"
                          >
                            <option value="" disabled>
                              Select Max Bath
                            </option>
                            <option value="1" className="SelectOption">
                              1+
                            </option>
                            <option value="2" className="SelectOption">
                              2+
                            </option>
                            <option value="3" className="SelectOption">
                              3+
                            </option>
                            <option value="4" className="SelectOption">
                              4+
                            </option>
                            <option value="5" className="SelectOption">
                              5+
                            </option>
                          </select>
                        </div>
                        <button
                          className="dropdown-item btn-reset"
                          type="button"
                          onClick={handleResetClickBath}
                        >
                          Reset
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="dropdown">
                  <div
                    className="dropdown-toggle filter-types-main-container"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      border: isAnyFilterFilled() ? "1px solid #002dff" : "",
                      borderRadius: "5px",
                    }}
                  >
                    <img className="filter-icon" src={filter} alt="filter" />
                    More Filters{" "}
                    {isAnyFilterFilled() && (
                      <FaFilter style={{ marginLeft: "0px" }} />
                    )}
                  </div>
                  <ul
                    className="dropdown-menu more-filter-width p-3"
                    onClick={handleDropdownClick}
                  >
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item accordian_border1">
                        <h2 className="accordion-header" id="heading1">
                          <button
                            className="accordion-button accordian_border collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse1"
                            aria-expanded="false"
                            aria-controls="collapse1"
                          >
                            Property Filter{" "}
                            {isAnyInputFilled() && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}{" "}
                            {/* Flask icon displayed if any input is filled */}
                          </button>
                        </h2>
                        <div
                          id="collapse1"
                          className="accordion-collapse collapse"
                          aria-labelledby="heading1"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <form>
                              <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                  <label className="form-label property_filter_head">
                                    Property Types
                                  </label>
                                  {/* Move the Dropdown JSX here */}
                                  <div className="d-flex gap-2 mb-2">
                                    {propertyTypes.map((type) => {
                                      const isSelected =
                                        selectedPropertyTypes.includes(type);
                                      return (
                                        <div
                                          key={type}
                                          className={
                                            isSelected
                                              ? "selected-property"
                                              : "non-selected-property"
                                          }
                                          onClick={() =>
                                            handleCheckboxChangeP(type)
                                          }
                                        >
                                          <label style={{ cursor: "pointer" }}>
                                            {/* {isSelected && (
                        <span
                          style={{ marginRight: "5px", color: "green" }}
                        >
                          ✓
                        </span>
                      )} */}
                                            {type}
                                          </label>
                                        </div>
                                      );
                                    })}
                                    {/* <div>
                <button
                  type="button"
                  className="btn-reset"
                  onClick={handleResetProperty}
                >
                  Reset
                </button>
              </div> */}
                                  </div>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="grid w-full grid-cols-6">
                                  <p className="p-0 m-0 heading_bed-bath">
                                    Number of Bedrooms
                                  </p>
                                  {buttonLabels.map((label, index) => {
                                    const isFirst = index === 0;
                                    const isLast =
                                      index === buttonLabels.length - 1;
                                    // const isActive = label === maxBed;
                                    const isActive =
                                      parseInt(label) === parseInt(maxBed);
                                    return (
                                      <button
                                        key={label}
                                        type="button"
                                        className={`shrink-0 border border-gray-300 px-3 py-1 btn_bath_bed ${
                                          isFirst ? "rounded-l-md" : ""
                                        } ${isLast ? "rounded-r-md" : ""} ${
                                          isActive
                                            ? "unSlectedBtn"
                                            : "SlectedBtn"
                                        }`}
                                        onClick={() => handleClick(label)}
                                      >
                                        {label}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="grid w-full grid-cols-6">
                                  <p className="p-0 m-0 heading_bed-bath">
                                    Number of Bathrooms
                                  </p>
                                  {buttonLabels.map((label, index) => {
                                    const isFirst = index === 0;
                                    const isLast =
                                      index === buttonLabels.length - 1;
                                    // const isActive = label === "Any";
                                    // const isActive = label === maxBath;
                                    const isActive =
                                      parseInt(label) === parseInt(maxBath);
                                    return (
                                      <button
                                        key={label}
                                        type="button"
                                        className={`shrink-0 border border-gray-300 px-3 py-1 btn_bath_bed ${
                                          isFirst ? "rounded-l-md" : ""
                                        } ${isLast ? "rounded-r-md" : ""} ${
                                          isActive
                                            ? "unSlectedBtn"
                                            : "SlectedBtn"
                                        }`}
                                        onClick={() => handleClickBath(label)}
                                      >
                                        {label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Number of stories{" "}
                                    {minStories.length > 0 ||
                                      (maxStories.length > 0 && (
                                        <FaFilter
                                          style={{ marginLeft: "0px" }}
                                        />
                                      ))}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Min stories"
                                      value={minStories}
                                      onChange={(e) =>
                                        setMinStories(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Max stories"
                                      value={maxStories}
                                      onChange={(e) =>
                                        setMaxStories(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Building size(Sq.ft.)
                                    {minBuildingSize.length > 0 && (
                                      <FaFilter style={{ marginLeft: "0px" }} />
                                    )}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Min Building size"
                                      value={minBuildingSize}
                                      onChange={(e) =>
                                        setMinBuildingSize(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Max Building size"
                                      value={maxBuildingSize}
                                      onChange={(e) =>
                                        setMaxBuildingSize(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Lot Size
                                    {minLotSize.length > 0 && (
                                      <FaFilter style={{ marginLeft: "0px" }} />
                                    )}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Min lot size"
                                      value={minLotSize}
                                      onChange={(e) =>
                                        setMinLotSize(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Max lot size"
                                      value={maxLotSize}
                                      onChange={(e) =>
                                        setMaxLotSize(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Year Built (YYYY)
                                    {minYearBuilt.length > 0 && (
                                      <FaFilter style={{ marginLeft: "0px" }} />
                                    )}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Min year built"
                                      value={minYearBuilt}
                                      onChange={(e) =>
                                        setMinYearBuilt(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Max year built"
                                      value={maxYearBuilt}
                                      onChange={(e) =>
                                        setMaxYearBuilt(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                {/* <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Occupancy Status
                                </label>
                                <div className="d-flex align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="occupiedCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Occupied")
                                    }
                                    checked={occupancyStatus.includes(
                                      "Occupied"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Occupied
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="vacantCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Vacant")
                                    }
                                    checked={occupancyStatus.includes("Vacant")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    vacant
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Any")
                                    }
                                    checked={occupancyStatus.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div> */}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item accordian_border">
                        <h2 className="accordion-header" id="heading2">
                          <button
                            className="accordion-button accordian_border collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse2"
                            aria-expanded="false"
                            aria-controls="collapse2"
                          >
                            Owner Filter{" "}
                            {isAnyInputFilledOwner() && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}
                          </button>
                        </h2>
                        <div
                          id="collapse2"
                          className="accordion-collapse collapse"
                          aria-labelledby="heading2"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <form>
                              {/* <div className="row">
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Owner Occupied?
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesYwnerOccupiedCheckbox"
                                    onChange={() => handleOwnerOccupied("Yes")}
                                    checked={ownerOccupied.includes("Yes")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noOwnerCheckbox"
                                      onChange={() => handleOwnerOccupied("No")}
                                      checked={ownerOccupied.includes("No")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyOwnerCheckbox"
                                    onChange={() => handleOwnerOccupied("Any")}
                                    checked={ownerOccupied.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Absentee Location
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="inState"
                                    onChange={() =>
                                      handleAbsenteeLocation("in-State")
                                    }
                                    checked={absenteeLocation.includes(
                                      "in-State"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    In-State
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="outstateCheckbox"
                                      onChange={() =>
                                        handleAbsenteeLocation("out-of-state")
                                      }
                                      checked={absenteeLocation.includes(
                                        "out-of-state"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Out-of-State
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyabsenteeCheckbox"
                                    onChange={() =>
                                      handleAbsenteeLocation("Any")
                                    }
                                    checked={absenteeLocation.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Owner Type
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="individualCheckbox"
                                    onChange={() =>
                                      handleOwnerType("Individual")
                                    }
                                    checked={ownerType.includes("Individual")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Individual
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="businessCheckbox"
                                      onChange={() =>
                                        handleOwnerType("Business")
                                      }
                                      checked={ownerType.includes("Business")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Business
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="bankTrustCheckbox"
                                    onChange={() =>
                                      handleOwnerType("BankTrust")
                                    }
                                    checked={ownerType.includes("BankTrust")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Bank or Trust
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Cash Buyer?
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesCashBuyerCheckbox"
                                    onChange={() => handleCashBuyer("Yes")}
                                    checked={cashBuyer.includes("Yes")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noCashBuyerCheckbox"
                                      onChange={() => handleCashBuyer("No")}
                                      checked={cashBuyer.includes("No")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyCashBuyerCheckbox"
                                    onChange={() => handleCashBuyer("Any")}
                                    checked={cashBuyer.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                            </div> */}
                              <div className="row mt-3">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Years of Ownership
                                    {minYearOwner.length > 0 ||
                                      (maxYearOwner.length > 0 && (
                                        <FaFilter
                                          style={{ marginLeft: "0px" }}
                                        />
                                      ))}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Min Years of Ownership"
                                      value={minYearOwner}
                                      onChange={(e) =>
                                        setMinYearOwner(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Max Years of Ownership"
                                      value={maxYearOwner}
                                      onChange={(e) =>
                                        setMaxYearOwner(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Tax Delinquent Year (YYYY)
                                    {minTaxDelinquent.length > 0 && (
                                      <FaFilter style={{ marginLeft: "0px" }} />
                                    )}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Min Tax Delinquent Year"
                                      value={minTaxDelinquent}
                                      onChange={(e) =>
                                        setMinTaxDelinquent(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Max Tax Delinquent Year"
                                      value={maxTaxDelinquent}
                                      onChange={(e) =>
                                        setMaxTaxDelinquent(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Properties Owned
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minPropertyOwned}
                                    onChange={(e) =>
                                      setMinPropertyOwned(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxPropertyOwned}
                                    onChange={(e) =>
                                      setMaxPropertyOwned(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Portfolio Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="$ Min"
                                    value={minPortfolioValue}
                                    onChange={(e) =>
                                      setMinPortfolioValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="$ Max"
                                    value={maxPortfolioValue}
                                    onChange={(e) =>
                                      setMaxPortfolioValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div> */}
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown item 3 */}
                      <div className="accordion-item accordian_border">
                        <h2 className="accordion-header" id="heading3">
                          <button
                            className="accordion-button accordian_border collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse3"
                            aria-expanded="false"
                            aria-controls="collapse3"
                          >
                            Financial Filter
                            {(minAssessedTotValue.length > 0 ||
                              maxAssessedTotValue.length > 0) && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}
                          </button>
                        </h2>
                        <div
                          id="collapse3"
                          className="accordion-collapse collapse"
                          aria-labelledby="heading3"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <form>
                              <div className="row">
                                {/* <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Private Lender?
                                </label>
                                <div className="d-flex  justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesPrivatelenderCheckbox"
                                    onChange={() => handlePrivateLender("True")}
                                    checked={financialPrivateLend.includes(
                                      "True"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    True
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="noPrivatelenderCheckbox"
                                    onChange={() =>
                                      handlePrivateLender("False")
                                    }
                                    checked={financialPrivateLend.includes(
                                      "False"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    False
                                  </label>
                                </div>
                              </div> */}
                                {/* <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Estimated Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minEstimatedValue}
                                    onChange={(e) =>
                                      setMinEstimatedValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxEstimatedValue}
                                    onChange={(e) =>
                                      setMaxEstimatedValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div> */}
                                {/* <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Estimated Equity
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minEstimatedEquity}
                                    onChange={(e) =>
                                      setMinEstimatedEquity(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxEstimatedEquity}
                                    onChange={(e) =>
                                      setMaxEstimatedEquity(e.target.value)
                                    }
                                  />
                                </div>
                              </div> */}
                              </div>
                              <div className="row mt-3">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Assessed Total Value
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Min Assessed Total Value"
                                      value={minAssessedTotValue}
                                      onChange={(e) =>
                                        setMinAssessedTotValue(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Max Assessed Total Value"
                                      value={maxAssessedTotValue}
                                      onChange={(e) =>
                                        setMaxAssessedTotValue(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                {/* <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Land Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedLandValue}
                                    onChange={(e) =>
                                      setMinAssessedLandValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedLandValue}
                                    onChange={(e) =>
                                      setMaxAssessedLandValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Improvement Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedImpValue}
                                    onChange={(e) =>
                                      setMinAssessedImpValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedImpValue}
                                    onChange={(e) =>
                                      setMaxAssessedImpValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div> */}
                              </div>
                              {/* <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Last Sale Price
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minLastSalePrice}
                                    onChange={(e) =>
                                      setMinLastSalePrice(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxLastSalePrice}
                                    onChange={(e) =>
                                      setMaxLastSalePrice(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Last Sale Date
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="$ Min"
                                    value={minLastSaleDate}
                                    onChange={(e) =>
                                      setMinLastSaleDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="$ Max"
                                    value={maxLastSaleDate}
                                    onChange={(e) =>
                                      setMaxLastSaleDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div> */}
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown item 4 */}
                      <div className="accordion-item accordian_border">
                        <h2 className="accordion-header" id="heading4">
                          <button
                            className="accordion-button accordian_border collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse4"
                            aria-expanded="false"
                            aria-controls="collapse4"
                          >
                            Foreclosure Filter{" "}
                            {isAnyInputFilledForeclousure() && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}{" "}
                            {/* Flask icon displayed if any input is filled */}
                          </button>
                        </h2>
                        <div
                          id="collapse4"
                          className="accordion-collapse collapse"
                          aria-labelledby="heading4"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <form>
                              <div className="row">
                                <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Preforeclosure Date
                                    {minRecDate.length > 0 && (
                                      <FaFilter style={{ marginLeft: "0px" }} />
                                    )}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="date"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Min"
                                      value={minRecDate}
                                      onChange={(e) =>
                                        setMinRecDate(e.target.value)
                                      }
                                    />
                                    {/* <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxRecDate}
                                    onChange={(e) =>
                                      setMaxRecDate(e.target.value)
                                    }
                                  /> */}
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-">
                                  <label className="form-label property_filter_head">
                                    Auction Date
                                    {minAuctionDate.length > 0 && (
                                      <FaFilter style={{ marginLeft: "0px" }} />
                                    )}
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="date"
                                      className="form-control"
                                      placeholder="Auction Date"
                                      value={minAuctionDate}
                                      onChange={(e) =>
                                        setMinAuctionDate(e.target.value)
                                      }
                                    />
                                    {/* <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAuctionDate}
                                    onChange={(e) =>
                                      setMaxAuctionDate(e.target.value)
                                    }
                                  /> */}
                                  </div>
                                </div>
                              </div>
                              {/* <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  REO Date
                                </label>
                                <div className="d-flex">
                                  <select
                                    className="w-100  form-control"
                                    value={mlsforeclousureSelect}
                                    onChange={(e) =>
                                      setMlsforeclousureSelect(e.target.value)
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="path_month">
                                      Within past month
                                    </option>
                                    <option value="path_2month">
                                      Within past 2 months
                                    </option>
                                    <option value="path_3month">
                                      Within past 3 months
                                    </option>
                                    <option value="path_6month">
                                      Within past 6 months
                                    </option>
                                    <option value="past_year">
                                      Within past years
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div> */}
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown item 5 */}
                      <div className="accordion-item accordian_border">
                        <h2 className="accordion-header" id="heading5">
                          <button
                            className="accordion-button accordian_border collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse5"
                            aria-expanded="false"
                            aria-controls="collapse5"
                          >
                            MLS Filter{" "}
                            {isAnyInputFilledMls() && (
                              <FaFilter style={{ marginLeft: "0px" }} />
                            )}{" "}
                            {/* Flask icon displayed if any input is filled */}
                          </button>
                        </h2>
                        <div
                          id="collapse5"
                          className="accordion-collapse collapse"
                          aria-labelledby="heading5"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <form>
                              <div className="row">
                                <div className="col-xl-8 col-lg-6 col-md-12 col-12 ">
                                  <div>
                                    <label className="form-label property_filter_head">
                                      Days on Market
                                    </label>
                                    <div className="d-flex">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Min Mls days on market"
                                        value={minDaysMarket}
                                        onChange={(e) =>
                                          setMinDaysMarket(e.target.value)
                                        }
                                      />
                                      <span
                                        className="p-2"
                                        STYLE="font-size:17.0pt"
                                      >
                                        {" "}
                                        -{" "}
                                      </span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Max  Mls days on market"
                                        value={maxDaysMarket}
                                        onChange={(e) =>
                                          setMaxDaysMarket(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="form-label property_filter_head">
                                      Listing Price
                                      {minListingPrice.length > 0 && (
                                        <FaFilter
                                          style={{ marginLeft: "0px" }}
                                        />
                                      )}
                                    </label>
                                    <div className="d-flex">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="$ Min Listing Price"
                                        value={minListingPrice}
                                        onChange={(e) =>
                                          setMinListingPrice(e.target.value)
                                        }
                                      />
                                      <span
                                        className="p-2"
                                        STYLE="font-size:17.0pt"
                                      >
                                        {" "}
                                        -{" "}
                                      </span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="$ Max Listing Price"
                                        value={maxListingPrice}
                                        onChange={(e) =>
                                          setMaxListingPrice(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="col-xl-3 col-lg-6 col-md-12 col-12 mt-3 mls_back">
                                <label className="form-label property_filter_head">
                                  MLS keyword
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="mlsInvestorOwnedCheckbox"
                                    onChange={() =>
                                      handleMlsKeyword("investor-owned")
                                    }
                                    checked={mlsKeyword.includes(
                                      "investor-owned"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Investor-Owned
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="mlsCreativeFinancingCheckbox"
                                      onChange={() =>
                                        handleMlsKeyword("creative financing")
                                      }
                                      checked={mlsKeyword.includes(
                                        "creative financing"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Creative Financing
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="mlsMotivatedSellerCheckbox"
                                    onChange={() =>
                                      handleMlsKeyword("motivated seller")
                                    }
                                    checked={mlsKeyword.includes(
                                      "motivated seller"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Motivated Seller
                                  </label>
                                </div>
                              </div> */}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex w-100 mt-3">
                      <button
                        className="btn btn-reset_morefilter me-2 w-50"
                        onClick={removeAllFilter}
                      >
                        Reset
                      </button>
                      {/* <button className="btn btn-saveexit_morefilter  w-100">
                      Save/Exit
                    </button> */}
                    </div>
                  </ul>
                </div>
                <Tooltip title="Search" placement="top" interactive>
                  <div className="save-filter" onClick={handleSubmit}>
                    {" "}
                    {loadingSearch ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      <span>
                        <img src={searchnav} alt="Search Icon" />
                      </span>
                    )}
                  </div>
                </Tooltip>
                {isButtonVisible && (
                  <Tooltip title="Save" placement="top" interactive>
                    <div className="save-filter" onClick={handleSaveFilters}>
                      {" "}
                      {loadingSave ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        <span>
                          <img src={savenav} alt="Search Icon" />
                        </span>
                      )}
                    </div>
                  </Tooltip>
                )}
                <Modal
                  show={showModal}
                  onHide={handleClose}
                  centered
                  size="md"
                  dialogClassName="right-side-modal"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <p className="send-heading">Save Filter</p>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="row mt-3">
                      <div className="col-12">
                        <p className="input-head">Write Filter name</p>
                        <input
                          className="send-input"
                          name="filterName"
                          required
                          value={formData.filterName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {isButtonVisibleFilter ? (
                      <div
                        className="send-offer-btn"
                        onClick={handleUpdateFilter}
                      >
                        {loadingSave ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Update Filter"
                        )}
                      </div>
                    ) : (
                      <div
                        className="send-offer-btn"
                        onClick={handleSaveFilter}
                      >
                        {loadingSave ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save Filter"
                        )}
                      </div>
                    )}
                    {/* <div className="send-offer-btn" onClick={handleSaveFilter}>
                    {loadingSave ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Save Filter"
                    )}
                  </div> */}
                  </Modal.Body>
                </Modal>
                <Modal
                  show={showModalOffer}
                  onHide={handleClose}
                  centered
                  size="md"
                  dialogClassName="right-side-modal"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <p className="send-heading">Send Multiple offers</p>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <Form>
                        <Form.Group controlId="dropdown">
                          <Form.Label>Select any Offer Template</Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedValue}
                            onChange={handleSelect}
                          >
                            <option value="">Select...</option>
                            {data.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.template_name}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    )}

                    <div
                      className="send-offer-btn"
                      onClick={() => handleSaveFilterOffer(selectedValue)}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Send Offer"
                      )}
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
              <div className="d-flex">
                <div className="dropdown">
                  <div
                    className="dropdown-toggle saved-main-container"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      className="save-heart-icon"
                      src={saveheart}
                      alt="saveheart"
                    />
                    Saved
                  </div>

                  <ul className="dropdown-menu saved-dropmenu">
                    <p className="saved-btns" onClick={handleFavoritesClick}>
                      Favorites
                    </p>
                    <p className="saved-btns" onClick={handleOfferSent}>
                      Offer Sent
                    </p>
                    <p className="saved-btns">Cash Buyer</p>
                  </ul>
                </div>
                <div
                  className={`saved-main-container-offer ${
                    selectedProperties.length > 0 ? "" : "disabled"
                  }`}
                  type="button"
                  aria-expanded="false"
                  onClick={() => {
                    if (selectedProperties.length > 0) handleSaveFiltersOffer();
                  }}
                  style={{
                    pointerEvents:
                      selectedProperties.length > 0 ? "auto" : "none",
                    opacity: selectedProperties.length > 0 ? 1 : 0.5,
                    position: "relative", // For positioning the badge
                  }}
                >
                  <img className="save-heart-icon" src={email} alt="email" />
                  Send Offer
                  <span className="offer-count-badge">
                    {selectedProperties.length}
                  </span>
                </div>
                {selectedProperties.length === 0 ? null : (
                  <span onClick={handleSelectAll} className="select-button">
                    {allSelected
                      ? "Clear Selection"
                      : `Select all ${propertiesCount} Properties`}
                  </span>
                )}
                <div className="dropdown flask_css">
                  <Tooltip title="Filter" placement="top" interactive>
                    <div
                      className="filter-flask"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaFilter />
                    </div>
                  </Tooltip>
                  <ul className="dropdown-menu">
                    {filters.length > 0 ? (
                      filters.map((filter) => (
                        <li key={filter.id}>
                          <a
                            className="dropdown-item filter_flask"
                            // href="#"
                            onClick={() => handleFilterClick(filter)}
                          >
                            {filter.filterName}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>
                        <p className="">No saved filter found</p>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="d-flex justify-content-end start_item_prop">
                {showPropertiesInfo && (
                  <p className="showing_properties">
                    Showing {startItem} - {endItem} of {totalProperties}{" "}
                    properties
                    {" | "} Page {Math.ceil(startItem / itemsPerPage)} of{" "}
                    {Math.ceil(totalProperties / itemsPerPage)}
                  </p>
                )}
              </div>

              <div className="d-flex justify-content-center mt-4">
                {loader && (
                  <div className="placeholder-grid">
                    {[...Array(25)].map((_, index) => (
                      <div className="placeholder-box" key={index}>
                        <div className="placeholder-img shimmer"></div>
                        <div className="placeholder-content">
                          <div className="placeholder-line shimmer"></div>
                          <div className="placeholder-line shimmer"></div>
                          <div className="placeholder-line shimmer"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* {backArrow && (
              <img src={backarrow} alt="backarrow"  className="backarrow_img" />
              <div className="col-12">
                <button
                  className="back-arrow-btn1 mb-3"
                  onClick={() => navigate("/")}
                >
                  ← Back
                </button>
              </div>
            )} */}
              {bridgeLoading ? (
                <div className="d-flex justify-content-center mt-4">
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <div className="card-parent-container">
                  {properties &&
                    properties.map((property) => {
                      // console.log("object propertyyy", property);
                      const hasMultiplePhotos =
                        property.alt_photos && property.alt_photos.length >= 1;

                      const address = property.location;
                      const isSaved = savedProperties.some(
                        (svProperty) => svProperty.property_id === property.id
                      );
                      const savedProperty = savedProperties.find(
                        (svProperty) => svProperty.property_id === property.id
                      );

                      const isSavedOffer = savedOfferSent.some(
                        (svPropertyOffer) =>
                          svPropertyOffer.property_id === property.id
                      );
                      const savedPropertyOffer = savedOfferSent.find(
                        (svPropertyOffer) =>
                          svPropertyOffer.property_id === property.id
                      );
                      return (
                        <div key={property.id}>
                          <div className="main-card-container">
                            {property.alt_photos.length === 1 ? (
                              <img
                                className="prop-img-single"
                                src={property.alt_photos[0] || "N/A"}
                                alt={`property-0`}
                              />
                            ) : property.alt_photos.length === 0 ? (
                              <div className="prop-img-single-background"></div>
                            ) : (
                              <Slider {...settings} className="">
                                {property.alt_photos.map((photo, index) => (
                                  <div key={index}>
                                    <img
                                      className="prop-img"
                                      src={photo || "N/A"}
                                      alt={`property-${index}`}
                                    />
                                  </div>
                                ))}
                              </Slider>
                            )}

                            <div className="d-flex flex-row justify-content-end p-2 order-container">
                              {/* <img
                              className="order"
                              src={order || "N/A"}
                              alt="order"
                            /> */}

                              <div className="d-flex flex-row">
                                {isSavedOffer ? (
                                  <Tooltip
                                    title="Already Sent"
                                    placement="top"
                                    interactive
                                  >
                                    <img
                                      className="order"
                                      src={sent_offer || "N/A"}
                                      alt="offer"
                                    />
                                  </Tooltip>
                                ) : isPropertySelected(property.id) ? (
                                  <Tooltip
                                    title="Selected"
                                    placement="top"
                                    interactive
                                  >
                                    <img
                                      className="order"
                                      src={offeer || "N/A"}
                                      alt="offer"
                                      onClick={() => {
                                        handleRemoveProperty(property.id);
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip
                                    title="Send Offer"
                                    placement="top"
                                    interactive
                                  >
                                    <img
                                      className="order"
                                      src={empty_mail || "N/A"}
                                      alt="offer"
                                      onClick={() => {
                                        handleAddProperty(property.id);
                                      }}
                                    />
                                  </Tooltip>
                                )}
                                {isSaved ? (
                                  <img
                                    className="order"
                                    src={fillheart || "N/A"}
                                    alt="fillheart"
                                    onClick={() =>
                                      handleFillHeartClick(
                                        savedProperty ? savedProperty.id : null
                                      )
                                    }
                                  />
                                ) : (
                                  <Tooltip
                                    title="Favorites"
                                    placement="top"
                                    interactive
                                  >
                                    <img
                                      className="order"
                                      src={heart || "N/A"}
                                      alt="heart"
                                      onClick={() =>
                                        handleHeartClick(property.id, address)
                                      }
                                    />
                                  </Tooltip>
                                )}
                                {/* {property.is_saved === "0" ? (
                              <img
                                className="order"
                                src={heart || "N/A"}
                                alt="heart"
                                onClick={() =>
                                  handleHeartClick(property.id, address)
                                }
                              />
                            ) : (
                              <img
                                className="order"
                                src={fillheart || "N/A"}
                                alt="fillheart"
                              />
                            )} */}
                              </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between p-2 rate-container">
                              <div className="rate" key={property.id}>
                                <span className="rate-text">
                                  MI Rate:
                                  {property.list_price ? (
                                    <span
                                      title={
                                        (getInterestRate(
                                          property.formattedDate
                                        ) /
                                          100) *
                                          property.list_price || "N/A"
                                      }
                                    >
                                      {getInterestRate(property.formattedDate)}
                                    </span>
                                  ) : null}
                                </span>
                              </div>
                              <div className="rate">
                                <span className="rate-text">
                                  Spread:{" "}
                                  <span>{property.spread || "N/A"}</span>
                                </span>
                              </div>
                            </div>

                            <Link
                              // to={`/dashboard/property-detail/${property.id}`}
                              onClick={() =>
                                propertyDetailDash(
                                  property.id,
                                  getInterestRate(property.formattedDate)
                                )
                              }
                              // onClick={propertyDetailDash}
                              className="text-underline"
                            >
                              <div className="card-content-container">
                                <div className="row">
                                  <div className="col-7">
                                    <p
                                      className="address-text location_property p-0 m-0"
                                      title={property.location || "N/A"}
                                    >
                                      {property.location || "N/A"}
                                    </p>
                                  </div>
                                  <div className="col-5">
                                    <div className="row">
                                      <div className="col-5">
                                        <p className="prop-address-text">
                                          PI:{" "}
                                          <span>{property.pi || "N/A"}</span>
                                        </p>
                                      </div>
                                      <div className="col-7">
                                        <p className="prop-address-text">
                                          Taxes:{" "}
                                          <span>{property.taxes || "N/A"}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-7">
                                    <p className="list-price-text">
                                      List Price:{" "}
                                      <span>
                                        ${property.list_price || "N/A"}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="col-5">
                                    <p className="prop-address-text">
                                      HOA:{" "}
                                      <span>
                                        {property.response.AssociationFee ||
                                          "N/A"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="row align-items-center">
                                  <div className="col border-right">
                                    <p className="row-value">
                                      {property.beds || "N/A"}
                                    </p>
                                    <p className="row-text">Beds</p>
                                  </div>
                                  <div className="col border-right">
                                    <p className="row-value">
                                      {property.full_baths || "N/A"}
                                    </p>
                                    <p className="row-text">Baths</p>
                                  </div>
                                  <div className="col border-right">
                                    <p className="row-value">
                                      {property.sqft || "N/A"}
                                    </p>
                                    <p className="row-text">Sq Ft</p>
                                  </div>
                                  <div className="col border-right">
                                    <p className="row-value">
                                      ${property.estimated_value || "N/A"}
                                    </p>
                                    <p className="row-text">Est. Value</p>
                                  </div>
                                  <div className="col">
                                    <p className="row-value">
                                      {property.rentAmount || "N/A"}
                                    </p>
                                    <p className="row-text">Rent Rate</p>
                                  </div>
                                </div>
                                <div className="d-flex flex-row justify-content-end">
                                  {isSavedOffer && (
                                    <p className="list-price-text">
                                      Offer Sent:{" "}
                                      <span>
                                        {savedPropertyOffer.offer_sent_date
                                          ? new Date(
                                              savedPropertyOffer.offer_sent_date
                                            ).toLocaleDateString("en-US", {
                                              month: "long",
                                              day: "numeric",
                                            })
                                          : "N/A"}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              {showButton ? (
                paginationLoading ? (
                  <div className="d-flex justify-content-center mt-5">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="show_more_div">
                    <button
                      className="show_more_btn"
                      onClick={showMoreProperties}
                    >
                      Show More
                    </button>
                  </div>
                )
              ) : paginationLoading ? (
                <div className="d-flex justify-content-center mt-5">
                  <CircularProgress /> {/* Loader */}
                </div>
              ) : (
                properties &&
                properties.length > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </>
  );
}

export default Dashboard;
