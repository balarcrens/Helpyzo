import { useState, useEffect } from 'react';

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'razorpay-checkout-js';

    if (document.getElementById(scriptId)) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setIsLoaded(false);
      console.error('Failed to load Razorpay script');
    };

    document.body.appendChild(script);

    return () => {
      // Opted not to remove the script on unmount as it might be used across multiple checkout flows
    };
  }, []);

  return isLoaded;
};

export default useRazorpay;
