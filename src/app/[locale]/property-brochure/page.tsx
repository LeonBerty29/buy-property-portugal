"use client";
import {
  PDFViewer,
  PropertyBrochureDocument,
  getSamplePropertyData,
} from "@/components/pdf";

const PropertyBrochurePage = () => {
  const propertyData = getSamplePropertyData();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <h1 className="text-2xl font-bold text-center mb-4">Property Brochure PDF</h1> */}
      <PDFViewer className="w-full min-h-screen border rounded-lg shadow-lg">
        <PropertyBrochureDocument
          propertyData={propertyData}
          title="Property Brochure"
          companyLogo="/images/buyproperytyportugal-logo-dark.png"
        />
      </PDFViewer>
    </div>
  );
};

export default PropertyBrochurePage;
