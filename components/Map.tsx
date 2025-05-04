import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
  }>;
  onMarkerClick?: (marker: {
    latitude: number;
    longitude: number;
    title?: string;
  }) => void;
}

export default function Map({
  latitude,
  longitude,
  zoom = 12,
  markers = [],
  onMarkerClick,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers
    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url(/marker.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${marker.title || 'Property Location'}</h3>`
          )
        )
        .addTo(map.current!);

      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(marker);
        });
      }
    });
  }, [mapLoaded, markers, onMarkerClick]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
