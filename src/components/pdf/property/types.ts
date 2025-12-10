export type PropertyData = {
  id: string;
  title: string;
  location: string;
  price: string;
  shortDescription: string;
  fullDescription: string;
  bedrooms: number;
  bathrooms: number;
  constructionYear: number;
  privateArea: number;
  plotSize: number;
  constructionArea: number;
  energyClass: string;
  propertyType: string;
  mainImage: string;
  additionalImages: string[];
  drivingDistances: Array<{
    destination: string;
    minutes: number;
    icon: string;
  }>;
  
};
