'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  latitude: number;
  longitude: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    price?: number;
  }>;
  interactive?: boolean;
  onSelectLocation?: (lat: number, lng: number) => void;
}

export default function Map({
  latitude,
  longitude,
  markers = [],
  interactive = false,
  onSelectLocation,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 13,
      interactive,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, interactive]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Add markers
    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = 'url(/marker.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3 class="font-semibold">${marker.title || 'Property'}</h3>
        ${marker.price ? `<p>KSh ${marker.price.toLocaleString()}</p>` : ''}
      `);

      new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Add click handler for location selection
    if (interactive && onSelectLocation) {
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onSelectLocation(lat, lng);
      });
    }
  }, [mapLoaded, markers, interactive, onSelectLocation]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}
