// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import { useSubscriptions } from '../hooks/useSubscriptions';


// const SubscriptionScreen: React.FC = () => {
//   const { data, error, isLoading } = useSubscriptions();

//   if (isLoading) return <Typography>Loading...</Typography>;
//   if (error) return <Typography>Error loading subscriptions</Typography>;

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Subscription Management
//       </Typography>
//       {/* Render subscriptions data here */}
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </Box>
//   );
// };

// export default SubscriptionScreen;



import { useEffect } from 'react';
import { useSubscriptions } from '../Context/SubscriptionsContext';

const SubscriptionsList = () => {
  const { subscriptions, isLoading, fetchSubscriptions } = useSubscriptions();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {subscriptions.map((sub) => (
        <li key={sub.id}>{sub.title}</li>
      ))}
    </ul>
  );
};

export default SubscriptionsList;