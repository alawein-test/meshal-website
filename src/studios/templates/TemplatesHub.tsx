// Templates Hub - Quantum/Cyberpunk aesthetic
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Layout,
  Zap,
  Type,
  Palette,
  Grid3X3,
  ShoppingBag,
  Eye,
  BookOpen,
  Sparkles,
  Shield,
  Users,
  BarChart3,
  FormInput,
  Columns,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout, HubHeader } from '@/components/shared';
import TemplateCard from './components/TemplateCard';
import TemplatePreview from './components/TemplatePreview';
import {
  DashboardPreview,
  LandingPreview,
  PortfolioPreview,
  EcommercePreview,
  BlogPreview,
  SaaSPreview,
  AdminDashboardPreview,
  CRMPreview,
  AnalyticsPreview,
  FormBuilderPreview,
  KanbanPreview,
  FileManagerPreview,
  UIComponentsPreview,
  AnimationDemosPreview,
} from './previews';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'available' | 'coming-soon' | 'beta';
  route?: string;
  previewComponent?: React.ReactNode;
}

const templates: Template[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Template',
    description:
      'Data visualization and analytics dashboard with charts, metrics, and real-time updates.',
    category: 'Layout',
    icon: Grid3X3,
    status: 'available',
    previewComponent: <DashboardPreview />,
  },
  {
    id: 'landing',
    name: 'Landing Page Template',
    description:
      'Modern marketing landing page with hero section, features, CTA, and testimonials.',
    category: 'Marketing',
    icon: Layout,
    status: 'available',
    previewComponent: <LandingPreview />,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Template',
    description: 'Personal portfolio showcase with projects, skills, and contact sections.',
    category: 'Portfolio',
    icon: Code2,
    status: 'available',
    previewComponent: <PortfolioPreview />,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Template',
    description:
      'Complete e-commerce storefront with product grid, filters, and cart functionality.',
    category: 'Shop',
    icon: ShoppingBag,
    status: 'available',
    previewComponent: <EcommercePreview />,
  },
  {
    id: 'blog',
    name: 'Blog Template',
    description:
      'Clean blog layout with featured posts, article cards, and reading time indicators.',
    category: 'Content',
    icon: BookOpen,
    status: 'available',
    previewComponent: <BlogPreview />,
  },
  {
    id: 'saas',
    name: 'SaaS Landing',
    description:
      'Modern SaaS landing page with pricing tables, features, and call-to-action sections.',
    category: 'Marketing',
    icon: Sparkles,
    status: 'available',
    previewComponent: <SaaSPreview />,
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    description:
      'Full-featured admin panel with user management, system logs, and real-time stats.',
    category: 'Admin',
    icon: Shield,
    status: 'available',
    previewComponent: <AdminDashboardPreview />,
  },
  {
    id: 'crm',
    name: 'CRM Template',
    description: 'Sales CRM with pipeline management, contact tracking, and deal stages.',
    category: 'Business',
    icon: Users,
    status: 'available',
    previewComponent: <CRMPreview />,
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description:
      'Real-time analytics with traffic charts, conversion metrics, and data visualization.',
    category: 'Analytics',
    icon: BarChart3,
    status: 'available',
    previewComponent: <AnalyticsPreview />,
  },
  {
    id: 'form-builder',
    name: 'Form Builder',
    description: 'Drag-and-drop form builder with field types, validation, and live preview.',
    category: 'Tools',
    icon: FormInput,
    status: 'available',
    previewComponent: <FormBuilderPreview />,
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Project management board with drag-and-drop cards, columns, and task tracking.',
    category: 'Tools',
    icon: Columns,
    status: 'available',
    previewComponent: <KanbanPreview />,
  },
  {
    id: 'file-manager',
    name: 'File Manager',
    description: 'Cloud file management with folders, uploads, previews, and storage tracking.',
    category: 'Tools',
    icon: FolderOpen,
    status: 'available',
    previewComponent: <FileManagerPreview />,
  },
  {
    id: 'components',
    name: 'UI Components',
    description: 'Reusable component library: buttons, forms, cards, modals, and more.',
    category: 'Components',
    icon: Palette,
    status: 'available',
    previewComponent: <UIComponentsPreview />,
  },
  {
    id: 'animations',
    name: 'Animation Demos',
    description:
      'Framer Motion animations: transitions, gestures, scroll effects, and interactions.',
    category: 'Effects',
    icon: Zap,
    status: 'available',
    previewComponent: <AnimationDemosPreview />,
  },
  {
    id: 'typography',
    name: 'Typography System',
    description: 'Font family showcases, text hierarchy, and semantic typography tokens.',
    category: 'Design',
    icon: Type,
    status: 'coming-soon',
  },
  {
    id: 'colors',
    name: 'Color Schemes',
    description: 'Pre-built color palettes and theme variations for different design aesthetics.',
    category: 'Design',
    icon: Palette,
    status: 'coming-soon',
  },
];

const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];

const TemplatesHub = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handlePreview = (template: Template) => {
    if (template.status !== 'coming-soon') {
      setPreviewTemplate(template);
      setIsPreviewOpen(true);
    }
  };

  const handleUseTemplate = (template: Template) => {
    // Template usage will be implemented with project creation flow
    setIsPreviewOpen(false);
  };

  return (
    <PageLayout
      title="Templates Studio"
      description="Explore reusable design templates, UI components, and interactive examples for your next project."
      keywords={['templates', 'UI components', 'React templates', 'dashboard', 'landing page']}
    >
      {/* Header */}
      <HubHeader
        title="Templates Studio"
        description="Explore reusable design templates, UI components, and interactive examples. Click on any available template to preview and use it."
        icon={Layout}
        primaryColor="cyan"
        secondaryColor="purple"
      />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-6 mb-6 text-sm font-mono"
      >
        <div className="flex items-center gap-2 text-jules-green">
          <Eye className="w-4 h-4" />
          <span>{templates.filter((t) => t.status === 'available').length} Available</span>
        </div>
        <div className="flex items-center gap-2 text-jules-cyan">
          <Zap className="w-4 h-4" />
          <span>{templates.filter((t) => t.status === 'beta').length} Beta</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{templates.filter((t) => t.status === 'coming-soon').length} Coming Soon</span>
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className={`font-mono transition-all ${
              selectedCategory === cat
                ? 'bg-jules-cyan/20 border-jules-cyan/50 text-jules-cyan'
                : 'border-jules-border/50 text-muted-foreground hover:border-jules-cyan/30 hover:text-jules-cyan hover:bg-jules-cyan/10'
            }`}
          >
            {cat}
          </Button>
        ))}
      </motion.div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <TemplateCard
              id={template.id}
              name={template.name}
              description={template.description}
              category={template.category}
              icon={template.icon}
              status={template.status}
              onPreview={() => handlePreview(template)}
              onUse={() => handleUseTemplate(template)}
            />
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-jules-surface/30 border border-jules-cyan/20 rounded-xl p-8 text-center backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold mb-2 font-mono text-jules-cyan">
          {'// More Templates Coming Soon'}
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          We're continuously adding new templates based on your design briefs. Check back regularly
          for new additions and updates.
        </p>
      </motion.div>

      {/* Preview Modal */}
      <TemplatePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={
          previewTemplate
            ? {
                id: previewTemplate.id,
                name: previewTemplate.name,
                description: previewTemplate.description,
                category: previewTemplate.category,
                previewComponent: previewTemplate.previewComponent,
              }
            : null
        }
        onUse={() => previewTemplate && handleUseTemplate(previewTemplate)}
      />
    </PageLayout>
  );
};

export default TemplatesHub;
