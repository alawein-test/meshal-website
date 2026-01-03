import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    previewComponent?: React.ReactNode;
  } | null;
  onUse?: () => void;
}

const TemplatePreview = ({ isOpen, onClose, template, onUse }: TemplatePreviewProps) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{template.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onUse}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 bg-secondary/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg overflow-hidden border border-border/50 bg-background shadow-2xl"
          >
            {template.previewComponent || (
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Maximize2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Preview not available</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;
