import React from 'react';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  return (
    <div>
      <Helmet>
        <title>404 - Page Not Found | Open Project Berkeley</title>
      </Helmet>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;