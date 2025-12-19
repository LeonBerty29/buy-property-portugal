/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image as PdfImage,
  Link,
} from "@react-pdf/renderer";
import PropertyWatermark from "./watermark";
import { IconText } from "./icons";
import { PropertyData } from "./types";

const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingHorizontal: 25,
    paddingBottom: 60,
    fontSize: 10,
    backgroundColor: "#ffffff",
  },
  // Header styles - positioned absolutely at top
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 25,
    right: 25,
    height: 40, // Define explicit height for header
    zIndex: 10, // Ensure header stays on top
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 55,
    height: 30,
    marginRight: 10,
    objectFit: "contain",
  },
  emailLink: {
    fontSize: 10,
    color: "#059669",
    textDecoration: "underline",
  },
  // Main content area - properly spaced from header
  contentContainer: {
    flex: 1,
    minHeight: 0, 
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  mainImage: {
    width: "100%",
    height: 350,
    marginBottom: 10,
    objectFit: "cover",
  },
  mainImagePlaceholder: {
    width: "100%",
    height: 350,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    border: "1px solid #e5e7eb",
  },
  propertyId: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 5,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 7,
  },
  location: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#1f2937",
  },
  priceContainer: {
    borderBottomWidth: 1,
    borderColor: "#1f2937",
    padding: 7,
    alignSelf: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "center",
  },
  shortDescription: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "center",
    marginBottom: 7,
    marginTop: 7,
  },
  sectionTitleLeft: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "left",
    marginBottom: 7,
    marginTop: 7,
  },
  // Updated features container to match driving distances style
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 7,
  },
  // Updated feature item to match driving item style
  featureItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginRight: 20,
    marginBottom: 12,
    
  },
  featureValue: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  featureLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  // Remove the old featureRow style as it's no longer needed
  gridImage: {
    width: "100%",
    height: 250, // Reduced height
    marginBottom: 10, // Reduced margin
    objectFit: "cover",
  },
  gridImagePlaceholder: {
    width: "100%",
    height: 250, // Reduced height
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Reduced margin
    border: "1px solid #e5e7eb",
  },

  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  // Grid images styles - 2x2 grid
  gridImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridImageWrapper: {
    width: "49%", // Slightly less than 50% to allow for spacing
    marginBottom: 8,
  },
  gridImageSmall: {
    width: "100%",
    height: 120, // Smaller height for grid images
    objectFit: "cover",
  },
  gridImageSmallPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #e5e7eb",
  },
  // Driving distances styles for horizontal flow
  drivingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 7,
  },
  drivingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 8,
    
  },
  fullDescription: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#374151",
    textAlign: "justify",
    marginBottom: 10,
  },
  contactSection: {
    backgroundColor: "#f9fafb",
    marginTop: 0,
    padding: 15,
    marginBottom: 7,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  contactOffice: {
    width: "30%",
  },
  officeTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  officeAddress: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 1.3,
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  contactItem: {
    fontSize: 10,
    color: "#6b7280",
  },
  notice: {
    marginTop: 4,
    marginBottom: 7,
  },
  noticeText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#6b7280",
    textAlign: "justify",
  },
  noticeTitle: {
    fontWeight: "bold",
    color: "#059669",
  },
  // Footer styles - positioned absolutely at bottom
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 20, // Define explicit height for footer
    zIndex: 10, // Ensure footer stays on top
  },
  websiteText: {
    fontSize: 10,
    color: "#9ca3af",
  },
  pageNumber: {
    fontSize: 10,
    color: "#9ca3af",
  },
});

type PropertyBrochureDocumentProps = {
  propertyData: PropertyData;
  title?: string;
  companyLogo?: string; // Optional company logo URL
};

export const PropertyBrochureDocument: React.FC<
  PropertyBrochureDocumentProps
> = ({ propertyData, title, companyLogo }) => {
  return (
    <Document
      author="Buy Property Portugal"
      title={title || `Property Brochure - ${propertyData.title}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header Row with Logo and Email - Fixed at top */}
        <View style={styles.headerRow} fixed>
          <View style={styles.logoContainer}>
            {companyLogo ? (
              <PdfImage src={companyLogo} style={styles.companyLogo} />
            ) : (
              <View
                style={[
                  styles.companyLogo,
                  {
                    backgroundColor: "#f3f4f6",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #e5e7eb",
                  },
                ]}
              >
                <Text style={{ fontSize: 8, color: "#9ca3af" }}>LOGO</Text>
              </View>
            )}
          </View>
          <Link
            src="mailto:info@exclusive-Portugal.com"
            style={styles.emailLink}
          >
            info@exclusive-Portugal.com
          </Link>
        </View>

        {/* Main Content Container - Properly spaced */}
        <View style={styles.contentContainer}>
          {/* Header */}
          {/* <Text style={styles.header}>Buy Property Portugal</Text> */}

          {propertyData.mainImage ? (
            <PdfImage src={propertyData.mainImage} style={styles.mainImage} />
          ) : (
            <View style={styles.mainImagePlaceholder}>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>
                [Main Property Image]
              </Text>
            </View>
          )}

          {/* Property Information */}
          <Text style={styles.propertyId}>{propertyData.id} - {propertyData.location}</Text>
          {/* <Text style={styles.propertyTitle}>{propertyData.title}</Text> */}

          {/* Description and Price */}
          <Text style={styles.description}>
            Modern Villa near Gale beach and Salgados Golf for sale Portugal
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{propertyData.price}</Text>
          </View>

          {/* Property Features - Updated to horizontal flow like driving distances */}
          <Text style={styles.sectionTitleLeft}>Property Features</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.bedrooms || "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Bedrooms</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.bathrooms || "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Bathrooms</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.constructionYear || "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Built Year</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.privateArea
                  ? `${propertyData.privateArea}m²`
                  : "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Private area</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.plotSize ? `${propertyData.plotSize}m²` : "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Plot size</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.constructionArea
                  ? `${propertyData.constructionArea}m²`
                  : "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Construction area</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.energyClass || "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Energy Class</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>
                {propertyData.propertyType || "N/A"}
              </Text>
              <Text style={styles.featureLabel}>Property Type</Text>
            </View>
          </View>

          {/* Driving Distances (Horizontal Layout) - with optional chaining */}
          {propertyData.drivingDistances &&
            propertyData.drivingDistances.length > 0 && (
              <>
                <Text style={styles.sectionTitleLeft}>Driving Distances</Text>
                <View style={styles.drivingContainer}>
                  {propertyData.drivingDistances.map((item, index) => (
                    <View key={index} style={styles.drivingItem}>
                      <IconText
                        icon={item?.icon as any}
                        text={`${item?.destination || "Unknown"} - ${
                          item?.minutes || "N/A"
                        } min`}
                        size={11}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}

          {/* Property Description */}
          <Text style={styles.fullDescription}>
            {propertyData.fullDescription}
          </Text>

          <View style={styles.gridImagesContainer}>
            {propertyData.additionalImages &&
            propertyData.additionalImages.length > 0
              ? propertyData.additionalImages
                  .slice(0, 4)
                  .map((imageUrl, index) => (
                    <View key={index} style={styles.gridImageWrapper}>
                      <PdfImage src={imageUrl} style={styles.gridImageSmall} />
                    </View>
                  ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <View key={index} style={styles.gridImageWrapper}>
                    <View style={styles.gridImageSmallPlaceholder}>
                      <Text style={{ fontSize: 8, color: "#9ca3af" }}>
                        [Image {index + 1}]
                      </Text>
                    </View>
                  </View>
                ))}
          </View>

          {/* Important Notice */}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              <Text style={styles.noticeTitle}>Important notice: </Text>
              These particulars are not an offer or contract, nor part of one.
              The photographs show only certain parts of the property as they
              appeared at the time they were taken. Areas, measurements, layout
              plans and distances are for guidance only and should not be relied
              upon as a statement of fact. All property details have been
              provided by the seller and should not be considered factually
              accurate about the property, its condition or value. Exclusive
              Living Mediacao Imobiliaria Lda. holds no responsibility to the
              accuracy of the information and will not be held liable for any
              errors on any representation on the property.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.contactSection}>
            <View style={styles.contactRow}>
              <View style={styles.contactOffice}>
                <Text style={styles.officeTitle}>LAGOA</Text>
                <Text style={styles.officeAddress}>
                  Rua Ernesto Cabrita, Edificio Vales L/A{"\n"}
                  8400-387 Lagoa - Portugal
                </Text>
              </View>
              <View style={styles.contactOffice}>
                <Text style={styles.officeTitle}>VILAMOURA</Text>
                <Text style={styles.officeAddress}>
                  Avenida Tivoli, B, Bloco 3, R/C Esq{"\n"}
                  8125-465 Vilamoura - Portugal
                </Text>
              </View>
              <View style={styles.contactOffice}>
                <Text style={styles.officeTitle}>LAGOS</Text>
                <Text style={styles.officeAddress}>
                  R. Dr. José Francisco Tello Queiroz, L 3, R{"\n"}
                  Loja R, 8600-707 Lagos
                </Text>
              </View>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>Tel.: +351 282 353 019</Text>
              <Text style={styles.contactItem}>Mobile: +351 918 024 082</Text>
              <Text style={styles.contactItem}>
                Email: info@exclusive-Portugal.com
              </Text>
            </View>
          </View>

          {/* Additional Property Images */}
          {propertyData.additionalImages &&
          propertyData.additionalImages.length > 0
            ? propertyData.additionalImages
                .slice(0, 4)
                .map((imageUrl, index) => (
                  <PdfImage
                    key={index}
                    src={imageUrl}
                    style={styles.gridImage}
                  />
                ))
            : Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={styles.gridImagePlaceholder}>
                  <Text style={{ fontSize: 8, color: "#9ca3af" }}>
                    [Image {index + 1}]
                  </Text>
                </View>
              ))}
        </View>

        <PropertyWatermark />

        {/* Footer with Website and Page Number - Fixed at bottom */}
        <View style={styles.footer} fixed>
          <Text style={styles.websiteText}>exclusivePortugalvillas.com</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
