// fetcher.ts
import axios from 'axios';

const fetcher = async (url: string) => {
  // Retrieve the API key from the environment variables
  //const apiKey = process.env.API_KEY; // Replace with your environment variable name

  // Check if the url is an API route that requires the API key
  const requiresApiKey = url.startsWith('/api');

  // Define the headers
  const headers = requiresApiKey
    ? {
        'Content-Type': 'application/json',
        'x-api-key': 'jdktplshdjkqpalcnzmdgtopsbcgHATncmdlKlpasituqixbcmagdlpqoeutidnWgfhEUndjfPLCYAJDLAPQbcghfltpoaudhtkdlpaofhdlshKSkdlfpKbchfdKATQREPALCVmdhfjased',
      }
    : {
        'Content-Type': 'application/json',
      };

  try {
    // Make the request with the specified headers
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    // Handle errors here
    console.error('Fetch error:', error);
    throw error;
  }
};

export default fetcher;
