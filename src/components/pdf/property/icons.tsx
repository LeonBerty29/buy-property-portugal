import {
  View,
  Text,
  StyleSheet,
  Svg,
  Circle,
  Path,
  Rect,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  text: {
    marginLeft: 6,
    fontSize: 11,
    color: "#374151",
  },
});

type IconMap = {
  [key: string]: React.FC<{ color: string }>;
};

const icons: IconMap = {
  bed: ({ color }) => (
    <>
      <Path stroke={color} d="M2 4v16" />
      <Path stroke={color} d="M2 8h18a2 2 0 0 1 2 2v10" />
      <Path stroke={color} d="M2 17h20" />
      <Path stroke={color} d="M6 8v9" />
    </>
  ),
  bath: ({ color }) => (
    <>
      <Path
        stroke={color}
        d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1 0l-1 1a1.5 1.5 0 0 0 0 1L6.5 7.5"
      />
      <Path
        stroke={color}
        d="M21 15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1z"
      />
    </>
  ),
  calendar: ({ color }) => (
    <>
      <Rect stroke={color} x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Path stroke={color} d="M16 2v4" />
      <Path stroke={color} d="M8 2v4" />
      <Path stroke={color} d="M3 10h18" />
    </>
  ),
  area: ({ color }) => (
    <>
      <Path stroke={color} d="M13 2 3 14h9l4-4V2z" />
      <Path stroke={color} d="M13 6h8v8" />
      <Path stroke={color} d="M17 10v4l-2 2" />
    </>
  ),
  energy: ({ color }) => (
    <>
      <Path stroke={color} d="M13 2 3 14h9l4-4V2z" />
      <Path stroke={color} d="M13 6 8.5 14h4l2-4V6z" />
    </>
  ),
  home: ({ color }) => (
    <>
      <Path stroke={color} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path stroke={color} d="M9 22V12h6v10" />
    </>
  ),
  mapPin: ({ color }) => (
    <>
      <Path stroke={color} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle stroke={color} cx="12" cy="10" r="3" />
    </>
  ),
  city: ({ color }) => (
    <>
      <Path stroke={color} d="M3 21h18" />
      <Path stroke={color} d="M5 21V7l8-4v18" />
      <Path stroke={color} d="M19 21V9l-6-2" />
      <Path stroke={color} d="M9 9v.01" />
      <Path stroke={color} d="M9 12v.01" />
      <Path stroke={color} d="M9 15v.01" />
      <Path stroke={color} d="M9 18v.01" />
    </>
  ),
  beach: ({ color }) => (
    <>
      <Path stroke={color} d="M2 18h20" />
      <Path
        stroke={color}
        d="M12 2l3 7 7-3-3 7 3 7-7-3-3 7-3-7-7 3 3-7-3-7 7 3z"
      />
    </>
  ),
  restaurant: ({ color }) => (
    <>
      <Path stroke={color} d="M3 2v7c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V2" />
      <Path stroke={color} d="M7 2v20" />
      <Path
        stroke={color}
        d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      />
    </>
  ),
  golf: ({ color }) => (
    <>
      <Circle stroke={color} cx="12" cy="13" r="2" />
      <Path stroke={color} d="M12 1v6l8 2-8 2" />
    </>
  ),
  airplane: ({ color }) => (
    <>
      <Path
        stroke={color}
        d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
      />
    </>
  ),
};

type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

const defaultSize = 16;

export const Icon: React.FC<IconProps> = ({
  name,
  size = defaultSize,
  color = "#6b7280",
}) => {
  const Component = icons[name];
  if (!Component) return null;

  return (
    <Svg height={size} width={size} viewBox="0 0 24 24" fill="none">
      <Component color={color} />
    </Svg>
  );
};

type IconTextProps = {
  icon: IconName;
  text: string;
  size?: number;
  color?: string;
};

export const IconText: React.FC<IconTextProps> = ({
  icon,
  text,
  size = defaultSize,
  color = "#6b7280",
}) => {
  return (
    <View style={styles.container}>
      <Icon size={size} name={icon} color={color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
