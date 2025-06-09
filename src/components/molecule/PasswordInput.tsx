import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../atom/Button';
import { Input } from '../atom/Input';
import { useState } from 'react';

const PasswordInput = ({ className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Input {...props} type={showPassword ? 'text' : 'password'} className={`w-full pr-12 ${className}`} />
      <Button
        variant="text"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 w-8 h-8 p-0 min-w-0 flex items-center justify-center"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </Button>
    </div>
  );
};

export default PasswordInput;
