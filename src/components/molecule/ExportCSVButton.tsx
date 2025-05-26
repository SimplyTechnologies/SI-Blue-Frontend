import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/atom/Button';
import CustomTooltip from '@/components/molecule/CustomTooltip';
import type { FilterRequest } from '@/types/Vehicle';
import { fetchCSV } from '@/requests/fetchCSV';
import { fileDownload } from '@/utils/fileDownload';
import { ExportIcon } from '@/assets/svgIconComponents/ExportIcon';
import { useSearchStore } from '@/stores/useSearchStore';

type ExportCSVButtonTypes = {
  filters: FilterRequest;
  disabled?: boolean;
};

const ExportCSVButton: React.FC<ExportCSVButtonTypes> = ({ filters, disabled }: ExportCSVButtonTypes) => {
  const { isSearchActive } = useSearchStore();

  const [shouldExport, setShouldExport] = useState(false);

  const { isLoading, data, refetch, isError } = useQuery({
    queryKey: ['exportFile', filters],
    queryFn: () => fetchCSV(filters),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (data && shouldExport) {
      fileDownload(data);
      setShouldExport(false);
    }
    if (isError) {
      toast.error('Failed to export. Please try again.');
    }
  }, [data, isError, shouldExport]);

  const handleExportClick = () => {
    refetch();
    setShouldExport(true);
  };

  return (
    <CustomTooltip
      trigger={
        <Button
          variant="text"
          onClick={handleExportClick}
          className={`${isSearchActive ? 'hidden' : 'flex'} w-6 h-6 items-center justify-center text-support-3 hover:text-primary-3 cursor-pointer`}
          disabled={isLoading || disabled}
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <ExportIcon />}
        </Button>
      }
      content="Export to CSV"
      side="right"
    />
  );
};

export default ExportCSVButton;

