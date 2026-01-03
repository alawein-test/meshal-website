import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, exportToJSON, formatExportData } from '@/utils/dataExport';
import { toast } from '@/hooks/use-toast';

interface ExportMenuProps {
  data: Record<string, unknown>[];
  filename: string;
  type: string;
}

export function ExportMenu({ data, filename, type }: ExportMenuProps) {
  const handleExportJSON = () => {
    if (data.length === 0) {
      toast({ title: 'No data to export', variant: 'destructive' });
      return;
    }
    const formattedData = formatExportData(data, type);
    exportToJSON(formattedData, filename);
    toast({ title: 'Exported to JSON', description: `${data.length} records exported` });
  };

  const handleExportCSV = () => {
    if (data.length === 0) {
      toast({ title: 'No data to export', variant: 'destructive' });
      return;
    }
    const formattedData = formatExportData(data, type);
    exportToCSV(formattedData, filename);
    toast({ title: 'Exported to CSV', description: `${data.length} records exported` });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
