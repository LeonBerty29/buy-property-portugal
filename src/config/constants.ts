export const PROPERTIES_PER_PAGE = 24;
export const PRICE_SLIDER_STEP = 500000;
export const AREA_SLIDER_STEP = 100;
export const HOME_SEARCH_RESULT_ID = "home-search-result";
export const WEBSITE_NAME =
  "Buy Property Portugal - Luxury real estate agency for Western Portugal & Golden triangle";
export const EAV_TWITTER_CREATOR_HANDLE = "@Portugalproperty";
export const BASE_URL = "https://exclusive-Portugal.vercel.app";
export const GEO_POSITION = { lat: 37.245425, lng: -8.150925 };
export const EAV__INSTAGRAM_URL =
  "https://www.instagram.com/exclusive_Portugal_villas/";
export const EAV__LINKEDIN_URL =
  "https://www.linkedin.com/company/exclusive-Portugal-villas";
export const EAV__YOUTUBE_URL =
  "https://www.youtube.com/@ExclusivePortugalVillas";
export const EAV__TWITTER_URL = "https://x.com/Portugalproperty";
export const EAV_FACEBOOK_TWITTER_URL =
  "https://www.facebook.com/ExclusivePortugalVillasPortugal";

export const DISTRICTS = [
  { id: 1, name: "Aveiro" },
  { id: 2, name: "Beja" },
  { id: 3, name: "Braga" },
  { id: 4, name: "Bragança" },
  { id: 5, name: "Castelo Branco" },
  { id: 6, name: "Coimbra" },
  { id: 7, name: "Évora" },
  { id: 8, name: "Faro" },
  { id: 9, name: "Guarda" },
  { id: 10, name: "Leiria" },
  { id: 11, name: "Lisboa" },
  { id: 12, name: "Portalegre" },
  { id: 13, name: "Porto" },
  { id: 14, name: "Santarém" },
  { id: 15, name: "Setúbal" },
  { id: 16, name: "Viana do Castelo" },
  { id: 17, name: "Vila Real" },
  { id: 18, name: "Viseu" },
];

export const PROPERTY_TYPES = [
  "House Types",
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Studio",
  "Penthouse",
  "Land",
];

export const BEDROOMS = ["Any", "1", "2", "3", "4", "5+"];
export const BATHROOMS = ["Any", "1", "2", "3", "4+"];

export const PRICE_RANGES = [
  { label: "€0 - €500K", value: "0,500000" },
  { label: "€500K - €1M", value: "500000,1000000" },
  { label: "€1M - €2M", value: "1000000,2000000" },
  { label: "€2M - €3M", value: "2000000,3000000" },
  { label: "€3M - €4M", value: "3000000,4000000" },
  { label: "€4M - €5M", value: "4000000,5000000" },
  { label: "€5M - €10M", value: "5000000,10000000" },
  { label: "€10M+", value: "10000000,999999999" },
];

// config/constants.ts

export const REGIONS = [
  {
    id: 1,
    name: "Algarve",
    districtIds: [8, 2], // Faro, Beja
    properties_count: 1250,
    imageUrl:
      "/images/lifestyle-img3.png", // Algarve coastline
  },
  {
    id: 2,
    name: "Lisbon & Lisbon Coast",
    districtIds: [11, 15, 14], // Lisboa, Setúbal, Santarém
    properties_count: 2340,
    imageUrl:
      "/images/lifestyle-img3.png", // Lisbon city
  },
  {
    id: 3,
    name: "Silver Coast",
    districtIds: [10, 6, 1], // Leiria, Coimbra, Aveiro
    properties_count: 890,
    imageUrl:
      "/images/lifestyle-img3.png", // Portuguese coast
  },
  {
    id: 4,
    name: "Azores",
    districtIds: [20], // You'll need to add Azores to your DISTRICTS array
    properties_count: 156,
    imageUrl:
      "/images/lifestyle-img3.png", // Azores landscape
  },
  {
    id: 5,
    name: "Madeira",
    districtIds: [19], // You'll need to add Madeira to your DISTRICTS array
    properties_count: 234,
    imageUrl:
      "/images/lifestyle-img3.png", // Madeira island
  },
  {
    id: 6,
    name: "Porto",
    districtIds: [13], // Porto
    properties_count: 1580,
    imageUrl:
      "/images/lifestyle-img3.png", // Porto city
  },
];
