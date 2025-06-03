const PasswordValidator = ({ password = '', show = true }) => {
  const validations = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'A digit', valid: /[0-9]/.test(password) },
    { label: 'A symbol', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password || !show) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-1/2 p-4 bg-white border rounded shadow-lg z-20">
      {validations.map((validation, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          <span
            className={
              validation.valid
                ? 'text-[var(--color-success,#28a745)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]'
                : 'text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]'
            }
          >
            {validation.valid ? '✓' : '✗'}
          </span>
          <span
            className={
              validation.valid
                ? 'text-[var(--color-success,#28a745)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]'
                : 'text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]'
            }
          >
            {validation.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidator;
