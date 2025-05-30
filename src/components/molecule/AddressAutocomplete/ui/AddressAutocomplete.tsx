import Autocomplete from 'react-google-autocomplete';
import type { TAddressAutocompleteProps } from './AddressAutocomplete.types';
import './addressAutocomplete.css';

const AddressAutocomplete = ({
  changeAddress,
  label,
  error,
  className = '',
  options = {},
  disabled = false,
  value,
  handleChange,
  ...props
}: TAddressAutocompleteProps) => {
  const onSelect = (data: google.maps.places.PlaceResult) => {
    const streetNumber = data?.address_components?.find((addr: { types: string[] }) => {
      return addr.types?.includes('street_number');
    });

    const street = data?.address_components?.find((addr: { types: string[] }) => {
      return addr.types?.includes('route');
    });

    const city = data?.address_components?.find((addr: { types: string[] }) => {
      return addr.types?.includes('locality');
    });

    const state = data?.address_components?.find((addr: { types: string[] }) =>
      addr.types?.includes('administrative_area_level_1'),
    );

    const country = data?.address_components?.find((addr: { types: string[] }) => {
      return addr.types?.includes('country');
    });

    const zip = data?.address_components?.find((addr: { types: string[] }) => {
      return addr.types?.includes('postal_code');
    });

    const lat = data?.geometry?.location?.lat();
    const lng = data?.geometry?.location?.lng();

    changeAddress({
      street: `${streetNumber?.long_name || ''} ${street?.long_name || ''}`,
      city: city?.long_name || '',
      state: state?.short_name || '',
      country: country?.short_name || '',
      zipcode: zip?.long_name || '',
      lat,
      lng,
    });
  };

  return (
    <div>
      {label && <p>{label}</p>}
      <Autocomplete
        placeholder="Set Location"
        value={value}
        onChange={e => handleChange(e)}
        className={`google-autocomplete ${className}`}
        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
        options={{ types: ['address'], ...options }}
        onPlaceSelected={onSelect}
        disabled={disabled}
        {...props}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddressAutocomplete;
