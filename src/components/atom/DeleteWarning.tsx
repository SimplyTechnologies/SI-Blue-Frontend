const DeleteWarning = () => {
  return (
    <div className="absolute top-full right-[-100%] mt-2 z-50 animate-in fade-in-0 zoom-in-95">
      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="w-[32px] h-[32px] flex justify-center items-center rounded-full bg-[#ffc107]/10">
          <svg className="w-[18px] h-[18px] text-[#ffc107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#192252]">Unassign All Vehicles</span>
        </div>
      </div>
    </div>
  );
};

export default DeleteWarning;
