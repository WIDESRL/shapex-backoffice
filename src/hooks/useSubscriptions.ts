import { useQuery } from '@tanstack/react-query';

const fetchSubscriptions = async () => {
  const res = await fetch('http://localhost:3000/subscriptions');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'], // Pass queryKey as part of an object
    queryFn: fetchSubscriptions, // Specify the query function
  });
};