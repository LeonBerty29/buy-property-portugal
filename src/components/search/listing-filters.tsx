import { BathroomsDropdown } from "./bathroom-select";
import { getMetadata, getRanges } from "@/data/properties-metada";
import RegionSelect from "./region-select";
import { BedroomsDropdown } from "./bedroom-select";
import { PriceSelect } from "./price-select";
import { PropertyTypes } from "./property-types";

export async function ListPropertyTypes() {
  // const language = "";
  const metadata = await getMetadata();
  const typologies = metadata.typologies;
  return <PropertyTypes typologies={typologies} />;
}

export async function ListPrices() {
  const ranges = await getRanges();
  const priceRange = ranges.price;
  return <PriceSelect priceRange={priceRange} />;
}

// async function ListAreaSlider() {
//   const ranges = await getRanges();
//   const areaRange = ranges.private_area;
//   return <AreaSlider areaRange={areaRange} />;
// }

export async function ListBedroomsRangeSelect() {
  // const ranges = await getRanges();
  // const bedroomRange = ranges.bedrooms; // Fixed: was using ranges.price
  // return <BedroomsRangeSelect bedroomRange={bedroomRange} />;
  return <BedroomsDropdown 
  // bedroomRange={bedroomRange} 
  />;
}

export async function ListRegionSelect() {
  const metadata = await getMetadata();
  return <RegionSelect metadata={metadata} />;
}

export async function ListBathroomsRangeSelect() {
  // const ranges = await getRanges();
  // const bathroomRange = ranges.bathrooms;
  // return <BathroomsRangeSelect bathroomRange={bathroomRange} />;
  return (
    <BathroomsDropdown
    // bathroomRange={bathroomRange}
    />
  );
}
