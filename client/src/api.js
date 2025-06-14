import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

export default API;

export const fetchCurrentUser = async (token) => {
  try {
    const { data } = await API.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    return null;
  }
};
