import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PropertyType } from '@prisma/client';
import Map from './Map';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.nativeEnum(PropertyType),
  price: z.number().min(0, 'Price must be positive'),
  deposit: z.number().min(0, 'Deposit must be positive'),
  bedrooms: z.number().min(0, 'Bedrooms must be positive'),
  bathrooms: z.number().min(0, 'Bathrooms must be positive'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  latitude: z.number(),
  longitude: z.number(),
  amenities: z.array(z.string()),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  videoUrl: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function PropertyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      amenities: [],
      images: [],
      country: 'Kenya',
      state: 'Kajiado',
      city: 'Kitengela',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      setValue('images', [...watch('images'), ...data.urls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setSelectedLocation(location);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      const property = await response.json();
      toast.success('Property listed successfully!');
      router.push(`/properties/${property.id}`);
    } catch (error) {
      toast.error('Failed to list property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('type')}>
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700">
              Monthly Rent (KSh)
            </label>
            <input
              type="number"
              id="price"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="deposit"
              className="block text-sm font-medium text-gray-700">
              Deposit (KSh)
            </label>
            <input
              type="number"
              id="deposit"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('deposit', { valueAsNumber: true })}
            />
            {errors.deposit && (
              <p className="mt-1 text-sm text-red-600">
                {errors.deposit.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('bedrooms', { valueAsNumber: true })}
            />
            {errors.bedrooms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bedrooms.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="bathrooms"
            className="block text-sm font-medium text-gray-700">
            Bathrooms
          </label>
          <input
            type="number"
            id="bathrooms"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register('bathrooms', { valueAsNumber: true })}
          />
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bathrooms.message}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Location</h2>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register('address')}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('city')}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('state')}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register('country')}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Location on Map
          </label>
          <div className="mt-2">
            <Map
              latitude={-1.2921}
              longitude={36.8219}
              onMarkerClick={handleLocationSelect}
            />
          </div>
          {errors.latitude && (
            <p className="mt-1 text-sm text-red-600">
              Please select a location on the map
            </p>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Amenities</h2>
        <div className="flex flex-wrap gap-2">
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
              onClick={() => {
                const currentAmenities = watch('amenities');
                const newAmenities = currentAmenities.includes(amenity)
                  ? currentAmenities.filter((a) => a !== amenity)
                  : [...currentAmenities, amenity];
                setValue('amenities', newAmenities);
              }}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                watch('amenities').includes(amenity)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Media</h2>

        <div>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            className="mt-1 block w-full"
            onChange={handleImageUpload}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}
          <div className="mt-2 grid grid-cols-4 gap-2">
            {watch('images').map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Property image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700">
            Video URL (optional)
          </label>
          <input
            type="url"
            id="videoUrl"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="https://youtube.com/..."
            {...register('videoUrl')}
          />
          {errors.videoUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.videoUrl.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400">
        {isSubmitting ? 'Creating...' : 'List Property'}
      </button>
    </form>
  );
}
