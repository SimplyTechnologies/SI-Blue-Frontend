import { PasswordValidationFailIcon } from '@/assets/svgIconComponents/PasswordValidationFailIcon';
import { PasswordValidationMark } from '@/assets/svgIconComponents/PasswordValidationMark';

const PasswordValidator = ({ password = '', show = true, isPasswordFocused = false }) => {
  const validations = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'A digit', valid: /[0-9]/.test(password) },
    { label: 'A symbol', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password || !show) return null;

  return (
    <div className="absolute bottom-full mb-1 left-full -translate-x-full lg:bottom-0 lg:mb-0 lg:-translate-x-0 lg:h-[120px] lg:top-0 lg:ml-1 w-1/2 p-3 bg-[#363150] rounded shadow-lg z-20">
      {validations.map((validation, index) => (
        <div key={index} className="grid grid-cols-[26px_1fr] items-center space-x-2 text-sm">
          <div
            className={`w-[6px] h-[6px] flex justify-center items-center text-[8px] font-medium leading-[140%] ${validation.valid ? 'text-[#256A23]' : 'text-support-2'}`}
          >
            {validation.valid ? <PasswordValidationMark /> : <PasswordValidationFailIcon color={!isPasswordFocused && !validation.valid ? '#C9372C'  : 'white'}/>}
          </div>
          <div
            className={`${!isPasswordFocused && !validation.valid ? 'text-[#C9372C]' : 'text-[#FFFFFF]'} text-sm font-medium leading-[140%]`}
          >
            {validation.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidator;

