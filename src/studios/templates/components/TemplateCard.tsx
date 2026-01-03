import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'available' | 'coming-soon' | 'beta';
  previewImage?: string;
  onPreview?: () => void;
  onUse?: () => void;
}

const statusColors = {
  available: 'bg-jules-green/20 text-jules-green border-jules-green/30',
  'coming-soon': 'bg-jules-yellow/20 text-jules-yellow border-jules-yellow/30',
  beta: 'bg-jules-cyan/20 text-jules-cyan border-jules-cyan/30',
};

const TemplateCard = ({
  name,
  description,
  category,
  icon: Icon,
  status,
  previewImage,
  onPreview,
  onUse,
}: TemplateCardProps) => {
  return (
    <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="group h-full">
      <Card className="h-full flex flex-col overflow-hidden border-jules-border/50 bg-jules-surface/30 backdrop-blur-sm hover:border-jules-cyan/50 transition-all duration-300">
        {/* Preview Image Area - Fixed height for consistency */}
        <div className="relative h-40 bg-gradient-to-br from-jules-surface to-jules-dark overflow-hidden flex-shrink-0">
          {previewImage ? (
            <img src={previewImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-12 h-12 text-jules-cyan/30" />
            </div>
          )}

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--jules-cyan)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--jules-cyan)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-jules-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="border-jules-cyan/50 text-jules-cyan hover:bg-jules-cyan/20"
              onClick={onPreview}
              disabled={status === 'coming-soon'}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-jules-magenta hover:bg-jules-magenta/80 text-white"
              onClick={onUse}
              disabled={status === 'coming-soon'}
            >
              <Download className="w-4 h-4 mr-2" />
              Use
            </Button>
          </div>

          {/* Status Badge */}
          <Badge className={`absolute top-3 right-3 font-mono text-xs ${statusColors[status]}`}>
            {status === 'coming-soon' ? 'Coming Soon' : status === 'beta' ? 'Beta' : 'Available'}
          </Badge>
        </div>

        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-5 h-5 text-jules-cyan" />
            <CardTitle className="text-base font-display">{name}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="w-fit text-xs font-mono border-jules-magenta/30 text-jules-magenta"
          >
            {category}
          </Badge>
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TemplateCard;
