import { useNavigate } from 'react-router';
import { Button } from '@/components/atom/Button';

const LinkExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[45px]">
      <div className="text-primary text-4xl font-bold leading-[1.2]">Link Expired</div>
      <p className="text-primary text-sm font-medium leading-[1.4]">
        The link you followed has expired, or you might not have a permission.{' '}
      </p>
      <Button className="h-[56px]" variant="default" onClick={() => navigate('/login')}>
        Continue to Dealer Deck
      </Button>
    </div>
  );
};

export default LinkExpired;
