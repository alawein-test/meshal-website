import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Atom,
  Brain,
  Scale,
  LineChart,
  Cpu,
  User,
  LogOut,
  Home,
  Briefcase,
  FileText,
  Palette,
  ClipboardList,
} from 'lucide-react';
import { useTheme, themeNames } from '@/context/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { session } = useAuthStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/portfolio'))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Portfolio</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/resume'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Resume</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/projects'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Projects Hub</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Platforms">
            <CommandItem onSelect={() => runCommand(() => navigate('/projects/simcore'))}>
              <Cpu className="mr-2 h-4 w-4" />
              <span>SimCore</span>
              <span className="ml-auto text-xs text-muted-foreground">Simulations</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/projects/qmlab'))}>
              <Atom className="mr-2 h-4 w-4" />
              <span>QMLab</span>
              <span className="ml-auto text-xs text-muted-foreground">Quantum</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/projects/talai'))}>
              <Brain className="mr-2 h-4 w-4" />
              <span>TalAI</span>
              <span className="ml-auto text-xs text-muted-foreground">AI Research</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/projects/mezan'))}>
              <Scale className="mr-2 h-4 w-4" />
              <span>MEZAN</span>
              <span className="ml-auto text-xs text-muted-foreground">Automation</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/projects/optilibria'))}>
              <LineChart className="mr-2 h-4 w-4" />
              <span>OptiLibria</span>
              <span className="ml-auto text-xs text-muted-foreground">Optimization</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            {themeNames.map((themeName) => (
              <CommandItem key={themeName} onSelect={() => runCommand(() => setTheme(themeName))}>
                <Palette className="mr-2 h-4 w-4" />
                <span className="capitalize">{themeName}</span>
                {theme === themeName && (
                  <span className="ml-auto text-xs text-primary">Active</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Account">
            {session ? (
              <>
                <CommandItem onSelect={() => runCommand(() => navigate('/profile'))}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(handleLogout)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </CommandItem>
              </>
            ) : (
              <CommandItem onSelect={() => runCommand(() => navigate('/auth'))}>
                <User className="mr-2 h-4 w-4" />
                <span>Sign In</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandPalette;
