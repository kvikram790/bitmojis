import axios from 'axios';

const BASE_URL = 'https://api.doctcares.in/v1';

export const makeJsonFormDataApiRequest = async (
  method,
  endpoint,
  jsonData = null,
  token = null
) => {
  try {
    let headers = {};
    {
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    }

    const config = {
      method,
      url: endpoint,
      data: jsonData,
      headers,
    };

    const response = await axios(config);

    return response;
  } catch (error) {
    return error.response;
  }
};

export const uploadImageToAPI = async (formData) => {
  try {
    const response = await makeJsonFormDataApiRequest(
      'post',
      `${BASE_URL}/upload-images`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading image to API:', error);
    throw error;
  }
};
