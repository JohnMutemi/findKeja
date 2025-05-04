import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyType } from '@prisma/client';

interface PropertySearchProps {
  cities: string[];
}

export default function PropertySearch({ cities }: PropertySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get('type') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [amenities, setAmenities] = useState<string[]>(
    searchParams.get('amenities')?.split(',') || []
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (city) params.set('city', city);
    if (amenities.length > 0) params.set('amenities', amenities.join(','));

    router.push(`/properties/search?${params.toString()}`);
  };

  const handleReset = () => {
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setCity('');
    setAmenities([]);
    router.push('/properties/search');
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity]
    );
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
            <option value="">Any type</option>
            {Object.values(PropertyType).map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700">
            Min Price (KSh)
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="0"
          />
        </div>

        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-gray-700">
            Max Price (KSh)
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="No limit"
          />
        </div>

        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-700">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}+
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
            <option value="">Any city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Amenities
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            'WiFi',
            'Parking',
            'Water',
            'Security',
            'Furnished',
            'Garden',
            'Pool',
          ].map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                amenities.includes(amenity)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSearch}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          Search
        </button>
        <button
          onClick={handleReset}
          className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200">
          Reset
        </button>
      </div>
    </div>
  );
}
