import { getMetadata, getRanges } from "@/data/properties-metada";
import { PropertyTypes } from "./property-types";
import { BedroomsDropdown } from "./bedroom-select";
import { PriceSelect } from "./price-select";
import RegionSelect from "./region-select";
import { BathroomsDropdown } from "./bathroom-select";

export async function ListPropertyTypesDesktop() {
  // const language = "";
  const metadata = await getMetadata();
  const typologies = metadata.typologies;
  return <PropertyTypes modal={false} typologies={typologies} />;
}

export async function ListBedroomsRangeSelectDesktop() {
  // const ranges = await getRanges();
  // const bedroomRange = ranges.bedrooms; // Fixed: was using ranges.price
  // return <BedroomsRangeSelect bedroomRange={bedroomRange} />;
  return <BedroomsDropdown 
  // modal={false} 
  // bedroomRange={bedroomRange} 
  />;
}

export async function ListPricesDesktop() {
  const ranges = await getRanges();
  const priceRange = ranges.price;
  return <PriceSelect modal={false} priceRange={priceRange} />;
}

export async function ListRegionSelectDesktop() {
  const metadata = await getMetadata();
  return <RegionSelect modal={false} metadata={metadata} />;
}

export async function ListBathroomsRangeSelectDesktop() {
  // const ranges = await getRanges();
  // const bathroomRange = ranges.bathrooms;
  // return <BathroomsRangeSelect bathroomRange={bathroomRange} />;
  return (
    <BathroomsDropdown
    // modal={false}
    // bathroomRange={bathroomRange}
    />
  );
}
