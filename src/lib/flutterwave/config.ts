export const authHeaders = {
  Authorization: `Bearer ${import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY}`,
};

export const flutterWaveBaseUrl = import.meta.env
  .VITE_FLUTTERWAVE_BASE_URL; 
