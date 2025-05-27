import { toast } from 'sonner';

export const fileDownload = async (file: File, options?: { filename?: string; type?: string }) => {
  try {
    const mimeType = options?.type || file.type || 'text/csv;charset=utf-8;';
    const blob = new Blob([file], { type: mimeType });

    const filename = options?.filename || generateDefaultFilename(file);

    triggerDownload(blob, filename);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to export. Please try again.');
  }
};

const triggerDownload = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generateDefaultFilename = (file: File): string => {
  const timestamp = new Date().getTime();
  const extension = file?.name?.split('.').pop() || 'csv';
  return `vehicles-${timestamp}.${extension}`;
};

