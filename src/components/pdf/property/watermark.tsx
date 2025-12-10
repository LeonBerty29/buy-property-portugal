/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Canvas } from "@react-pdf/renderer";

const PropertyWatermark = () => {
  const paint = (doc: any) =>
    doc
      .circle(100, 100, 80)
      .opacity(0.03)
      .strokeColor("#1f2937")
      .fillColor("#f3f4f6")
      .fillAndStroke();

  return (
    <View
      style={{ position: "absolute", top: 150, right: 80, zIndex: -10 }}
      fixed
    >
      <Canvas paint={paint} style={{ width: 200, height: 200 }} />
    </View>
  );
};

export default PropertyWatermark;
