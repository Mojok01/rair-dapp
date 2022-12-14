import { CircularProgress } from '@mui/material';

const LoadingComponent = () => {
  return (
    <div className="list-wrapper-empty">
      <CircularProgress sx={{ color: '#E882D5' }} size={100} thickness={4.6} />
    </div>
  );
};

export default LoadingComponent;