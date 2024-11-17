import jwt from 'jsonwebtoken';

export const verifyToken = (request) => {
  if (!request.headers) {
    throw new Error('Request headers missing');
  }

  const authHeader = request.headers.get('Authorization') || request.headers['authorization'];
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // Assuming `id` is in the payload
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};