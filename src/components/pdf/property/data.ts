/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyData } from "./types";

export const getSamplePropertyData = (): PropertyData => ({
  id: "EAV-3500",
  title: "Modern Villa",
  location: "Albufeira, Algarve",
  price: "€4,500,000",
  shortDescription:
    "This villa is composed of three levels. On the ground floor, from the main entrance, the hall leads you to the living room and dining area, towards the kitchen.",
  fullDescription:
    "In a sought after location, close to the Porto de mos beach and all amenities, this amazing contemporary villa is a great opportunity not to miss. With its elegant fluid arquitectural lines and well thought design, this property is being built to the highest standard to ensure maximum comfort and tranquility. Perfectly distributed over three floors, on the ground floor you will have a fully fitted kitchen, living and dining room, office (that can be used as a fourth bedroom) and one bedroom. On the first floor, there will be 2 bedrooms, one of them being the spacious master, with almost 35m2. All of the bedrooms, including the office, have their own private bathroom and the property has several surrounding terraces perfect for enjoying the wonderful Algarvian weather and distant sea views. In addition, it has a very large basement consisting of a garage with space for at least 2 cars, storage room, laundry room and technical area. Some of the features of this incredible villa include underfloor heating, solar panels and pre-installation for air conditioning.",
  bedrooms: 4,
  bathrooms: 2,
  constructionYear: 2020,
  privateArea: 150,
  plotSize: 200,
  constructionArea: 180,
  energyClass: "A",
  propertyType: "Modern Villa",
  mainImage: "/images/featured-property-1.png",
  additionalImages: [
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
    "/images/featured-property-1.png",
  ],
  drivingDistances: [
    { destination: "Town", minutes: 5, icon: "city" },
    { destination: "Beach", minutes: 5, icon: "beach" },
    { destination: "Restaurant", minutes: 5, icon: "restaurant" },
    { destination: "Shop", minutes: 5, icon: "city" },
    { destination: "Golf", minutes: 5, icon: "golf" },
    { destination: "Airport", minutes: 5, icon: "airplane" },
  ],
});

// Function to convert your existing HTML component data to PropertyData
export const convertHtmlPropertyToData = (htmlProperty: any): PropertyData => {
  return {
    id: "EAV-3500", // Extract from your HTML component
    title: "Modern Villa",
    location: "Albufeira, Algarve",
    price: "€4,500,000",
    shortDescription: htmlProperty.shortDescription || "",
    fullDescription: htmlProperty.fullDescription || "",
    bedrooms: htmlProperty.bedrooms || 4,
    bathrooms: htmlProperty.bathrooms || 2,
    constructionYear: htmlProperty.construction_year || 2020,
    privateArea: htmlProperty.private_area || 150,
    plotSize: htmlProperty.plot_size || 200,
    constructionArea: htmlProperty.construction_area || 180,
    energyClass: htmlProperty.energy_class || "A",
    propertyType: htmlProperty.propertyType || "Modern Villa",
    mainImage: "/images/featured-property-1.png",
    additionalImages: Array.from(
      { length: 4 },
      () => "/images/featured-property-1.png"
    ),
    drivingDistances: [
      { destination: "Town", minutes: 5, icon: "city" },
      { destination: "Beach", minutes: 5, icon: "beach" },
      { destination: "Restaurant", minutes: 5, icon: "restaurant" },
      { destination: "Shop", minutes: 5, icon: "city" },
      { destination: "Golf", minutes: 5, icon: "golf" },
      { destination: "Airport", minutes: 5, icon: "airplane" },
    ],
  };
};
