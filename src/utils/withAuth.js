// import jwtDecode from 'jwt-decode';
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';

// export const withAuth = (WrappedComponent) => {
//   const AuthenticatedComponent = (props) => {
//     const router = useRouter();

//     useEffect(() => {
//       // Run client-side
//       const token = localStorage.getItem('token');
//       if (!token || !isValidToken(token)) {
//         router.replace('/login'); // Redirect to login if token is invalid
//       }
//     }, []);

//     // Helper function to validate token
//     const isValidToken = (token) => {
//       try {
//         const decoded = jwtDecode(token);
//         return decoded && decoded.exp > Date.now() / 1000; // Check expiration
//       } catch (error) {
//         return false;
//       }
//     };

//     // Render the wrapped component only if authenticated
//     return <WrappedComponent {...props} />;
//   };

//   return AuthenticatedComponent;
// };