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
    paddingTop: 80, // Increased to make room for header
    paddingHorizontal: 40,
    paddingBottom: 60, // Increased to make room for footer
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
    left: 40,
    right: 40,
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
    minHeight: 0, // Allow content to shrink if needed
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 0, // Remove top margin since we have page padding
  },
  mainImage: {
    width: "100%",
    height: 350, // Reduced height to fit better
    marginBottom: 20,
    objectFit: "cover",
  },
  mainImagePlaceholder: {
    width: "100%",
    height: 350, // Reduced height to fit better
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#1f2937",
  },
  priceContainer: {
    borderBottomWidth: 1,
    borderColor: "#1f2937",
    padding: 7,
    alignSelf: "center",
    marginBottom: 15,
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
    marginBottom: 20, // Reduced margin
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 15, // Reduced margin
  },
  sectionTitleLeft: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "left",
    marginBottom: 15,
    marginTop: 15, // Reduced margin
  },
  featuresContainer: {
    marginBottom: 20, // Reduced margin
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  featureItem: {
    width: "23%",
    alignItems: "center",
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
  // Driving distances styles for horizontal flow
  drivingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 20, // Reduced margin
  },
  drivingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 8,
    minWidth: 100,
  },
  fullDescription: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#374151",
    textAlign: "justify",
    marginBottom: 20, // Reduced margin
  },
  contactSection: {
    backgroundColor: "#f9fafb",
    padding: 15,
    marginBottom: 15,
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
    marginTop: 15,
    marginBottom: 0, // Remove bottom margin since we have page padding
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

          {/* Main Property Image */}
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
          <Text style={styles.propertyId}>{propertyData.id}</Text>
          <Text style={styles.propertyTitle}>{propertyData.title}</Text>
          <Text style={styles.location}>{propertyData.location}</Text>

          {/* Description and Price */}
          <Text style={styles.description}>
            Modern Villa near Gale beach and Salgados Golf for sale Portugal
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{propertyData.price}</Text>
          </View>

          {/* Property Features - with optional chaining */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
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
            </View>
            <View style={styles.featureRow}>
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
          </View>

          {/* Additional Property Images */}
          {propertyData.additionalImages &&
          propertyData.additionalImages.length > 0
            ? propertyData.additionalImages.map((imageUrl, index) => (
                <PdfImage key={index} src={imageUrl} style={styles.gridImage} />
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <View key={index} style={styles.gridImagePlaceholder}>
                  <Text style={{ fontSize: 8, color: "#9ca3af" }}>
                    [Image {index + 1}]
                  </Text>
                </View>
              ))}

          {/* Driving Distances (Horizontal Layout) - with optional chaining */}
          {propertyData.drivingDistances &&
            propertyData.drivingDistances.length > 0 && (
              <>
                <Text style={styles.sectionTitleLeft}>DRIVING DISTANCE</Text>
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
