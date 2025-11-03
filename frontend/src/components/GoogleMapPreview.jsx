import React, { useEffect, useRef } from 'react';
import MapPreview from './MapPreview';

// Read key from env; do not hardcode. Note: Frontend keys must be restricted by HTTP referrers in Google Cloud.
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function GoogleMapPreview({ lat, lon, name, height = 220, zoom = 15 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!lat || !lon || !mapRef.current) return;

    // If no API key is configured, gracefully fall back to the Leaflet/OpenStreetMap map
    if (!GOOGLE_MAPS_API_KEY) return;

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=maps,marker&v=beta`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const position = { lat, lng: lon };
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: zoom,
        mapId: 'DEMO_MAP_ID',
      });

      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title: name || 'Location',
      });

      mapInstanceRef.current = map;
    }
  }, [lat, lon, name, zoom]);

  if (!lat || !lon) return null;

  // Fallback: if no Google Maps key, render the Leaflet map
  if (!GOOGLE_MAPS_API_KEY) {
    return <MapPreview lat={lat} lon={lon} name={name} height={height} zoom={zoom} />;
  }

  return (
    <div 
      ref={mapRef} 
      className="google-map-preview" 
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    />
  );
}

export default GoogleMapPreview;
