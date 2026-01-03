// Data Export Utilities - CSV, JSON, and Markdown export functionality

export const exportToJSON = <T>(data: T[], filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
};

export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void => {
  if (data.length === 0) return;

  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });
  const headers = Array.from(allKeys);

  // Create CSV content
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map(escapeCSVValue).join(','));

  // Add data rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header];
      return escapeCSVValue(formatValue(value));
    });
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const escapeCSVValue = (value: string): string => {
  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format data for export with timestamps
export const formatExportData = <T extends { created_at?: string; updated_at?: string }>(
  data: T[],
  type: string
): Array<T & { export_type: string; exported_at: string }> => {
  return data.map((item) => ({
    ...item,
    export_type: type,
    exported_at: new Date().toISOString(),
  }));
};

// Export markdown content to a .md file
export const exportToMarkdownFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  downloadBlob(blob, `${filename}.md`);
};
