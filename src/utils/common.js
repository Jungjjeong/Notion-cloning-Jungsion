import { API } from '../storage/constants.js';

export const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API.END_POINT}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return res.json();
    }

    throw new Error(`${res.status} Error`);
  } catch (e) {
    alert(e.message);
  }
};
