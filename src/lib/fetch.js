export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  
    return res.json();
};
  