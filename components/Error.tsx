import React from 'react';

interface Props {
  error: {
    message: string;
    networkError?: any;
  };
}

// Shout out to @wesbos for this Error component 🙌🏻
function Error({error}: Props) {
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map(
      (error: {message: string}, i: number) => (
        <div key={i} className="error-message-container">
          <p>Dang! {error.message.replace('GraphQL error: ', '')}</p>
        </div>
      )
    );
  }
  return (
    <div className="error-message-container">
      <p>Dang! {error.message.replace('GraphQL error: ', '')}</p>
    </div>
  );
}

export default Error;
