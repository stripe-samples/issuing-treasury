import { Box } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
};

interface GoogleMapProps {
  latitude: number;
  longitude: number;
}

export const GoogleMapComponent = ({ latitude, longitude }: GoogleMapProps) => {
  const center = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <Box sx={{ width: "100%", height: "200px", borderRadius: 1, overflow: "hidden" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </Box>
  );
}; 