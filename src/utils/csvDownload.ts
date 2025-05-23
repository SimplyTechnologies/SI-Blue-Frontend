export const csvDownload = async (file: File) => {
  try {
    const csvBlob = new Blob([file], { type: 'text/csv;charset=utf-8;' });
    // Trigger download
    triggerDownload(csvBlob);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  } finally {
    // setLoading(false);
  }
};

const triggerDownload = (blob: Blob) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  const timestamp = new Date().getTime();
  link.setAttribute('download', `vehicles-${timestamp}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

