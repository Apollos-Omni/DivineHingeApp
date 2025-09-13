import axios from "axios";

const BASE_URL = "http://192.168.0.100:5000"; // Your Raspberry Pi or IoT controller IP

export const openHinge = async (hingeId: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/hinges/${hingeId}/open`);
    return res.data;
  } catch (err) {
    console.error("Error opening hinge:", err);
    throw err;
  }
};

export const closeHinge = async (hingeId: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/hinges/${hingeId}/close`);
    return res.data;
  } catch (err) {
    console.error("Error closing hinge:", err);
    throw err;
  }
};

export const getHingeStatus = async (hingeId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/hinges/${hingeId}/status`);
    return res.data.status; // e.g. 'open' or 'closed'
  } catch (err) {
    console.error("Error fetching hinge status:", err);
    throw err;
  }
};
