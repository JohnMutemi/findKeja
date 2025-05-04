'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Kitengela coordinates
const KITENGELA_CENTER = {
  lng: 36.87,
  lat: -1.47,
};

// Popular landmarks in Kitengela
const LANDMARKS = [
  {
    name: 'Kitengela Town Center',
    coordinates: [36.87, -1.47],
    description: 'Central business district with shopping centers',
  },
  {
    name: 'Ongata Rongai',
    coordinates: [36.78, -1.39],
    description: 'Residential area with good amenities',
  },
  {
    name: 'Isinya',
    coordinates: [36.85, -1.55],
    description: 'Growing residential area with new developments',
  },
  {
    name: 'Athiriver',
    coordinates: [36.98, -1.52],
    description: 'Industrial area with affordable housing',
  },
];

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [KITENGELA_CENTER.lng, KITENGELA_CENTER.lat],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for landmarks
    LANDMARKS.forEach((landmark) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(landmark.coordinates as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3 class="font-bold">${landmark.name}</h3>
            <p class="text-sm">${landmark.description}</p>
          `)
        )
        .addTo(map.current!);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        setSelectedArea(landmark.name);
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Handle area selection
  const handleAreaClick = (areaName: string) => {
    setSelectedArea(areaName);
    const landmark = LANDMARKS.find((l) => l.name === areaName);
    if (landmark && map.current) {
      map.current.flyTo({
        center: landmark.coordinates as [number, number],
        zoom: 14,
        duration: 2000,
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="h-[500px] rounded-lg overflow-hidden">
        <div ref={mapContainer} className="h-full w-full" />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Popular Areas in Kitengela</h3>
        <div className="grid gap-4">
          {LANDMARKS.map((area) => (
            <div
              key={area.name}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedArea === area.name
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleAreaClick(area.name)}>
              <h4 className="font-semibold">{area.name}</h4>
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
