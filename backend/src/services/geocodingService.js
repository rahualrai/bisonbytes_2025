// File: backend/src/services/geocodingService.js
import axios from 'axios';

const getAddress = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${latitude}, ${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const address = response.data.results[0].formatted_address;
      return address;
    } else {
      console.error('Google Maps API response:', response.data);
      throw new Error('Failed to get address from Google Maps API');
    }
  } catch (error) {
    console.error('Error getting address from Google Maps API:', error);
    throw error;
  }
};

export default getAddress;