# Glossary

> Definitions of domain-specific terms used throughout the MA Digital Studios
> Platform

---

## Platform Terms

### General

| Term                   | Definition                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Alawein Platform**   | The overarching ecosystem name for MA Digital Studios' suite of applications and tools |
| **MA Digital Studios** | The organization and brand behind the platform                                         |
| **Platform Dashboard** | A specialized interface for managing and interacting with a specific project type      |
| **Project Hub**        | Central navigation area for accessing all platform projects                            |
| **Studio**             | A workspace environment tailored for specific creative or development tasks            |

### Projects

| Term           | Definition                                                              |
| -------------- | ----------------------------------------------------------------------- |
| **SimCore**    | Scientific computing and simulation platform for physics-based modeling |
| **MEZAN**      | Enterprise automation platform with Arabic/English bilingual support    |
| **TalAI**      | AI/ML training and experimentation platform                             |
| **OptiLibria** | Mathematical optimization and algorithm benchmarking platform           |
| **QMLab**      | Quantum mechanics simulation and visualization platform                 |

---

## Technical Terms

### Architecture

| Term                         | Definition                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------- |
| **Design Tokens**            | Centralized design values (colors, spacing, typography) that ensure consistency |
| **Edge Functions**           | Serverless functions that run close to users for reduced latency                |
| **RLS (Row Level Security)** | Database security feature that restricts data access at the row level           |
| **Semantic Tokens**          | Named design values that convey meaning (e.g., `--primary`, `--destructive`)    |
| **State Management**         | Patterns for managing and sharing application state across components           |

### Frontend

| Term                          | Definition                                     |
| ----------------------------- | ---------------------------------------------- |
| **Component**                 | Reusable UI building block in React            |
| **Hook**                      | React function for reusing stateful logic      |
| **PWA (Progressive Web App)** | Web app with native app-like capabilities      |
| **Shadcn/ui**                 | Component library built on Radix UI primitives |
| **Tailwind CSS**              | Utility-first CSS framework for styling        |
| **Variant**                   | Alternative style or behavior of a component   |

### Backend

| Term              | Definition                                      |
| ----------------- | ----------------------------------------------- |
| **Lovable Cloud** | Backend infrastructure powering the platform    |
| **Migration**     | Database schema change applied incrementally    |
| **Policy**        | Security rule defining data access permissions  |
| **Real-time**     | Instant data synchronization across clients     |
| **Trigger**       | Automated database action in response to events |

---

## Design System Terms

### Colors

| Term            | Definition                                         |
| --------------- | -------------------------------------------------- |
| **Accent**      | Secondary emphasis color for interactive elements  |
| **Background**  | Base surface color for layouts                     |
| **Destructive** | Color indicating dangerous or irreversible actions |
| **Foreground**  | Text and icon color on surfaces                    |
| **Muted**       | Subdued color for secondary content                |
| **Primary**     | Main brand color for key actions                   |
| **Secondary**   | Alternative surface color for contrast             |

### Typography

| Term             | Definition                                 |
| ---------------- | ------------------------------------------ |
| **Display Font** | Decorative font for headings and hero text |
| **Body Font**    | Readable font for paragraph text           |
| **Monospace**    | Fixed-width font for code and data         |
| **Font Scale**   | Proportional sizing system for text        |

### Layout

| Term              | Definition                           |
| ----------------- | ------------------------------------ |
| **Container**     | Max-width wrapper for content        |
| **Grid**          | Multi-column layout system           |
| **Responsive**    | Adapts to different screen sizes     |
| **Spacing Scale** | Consistent spacing values (4px base) |

---

## UI Component Terms

| Term           | Definition                                    |
| -------------- | --------------------------------------------- |
| **Accordion**  | Expandable/collapsible content sections       |
| **Avatar**     | User profile image or initials                |
| **Badge**      | Small label for status or count               |
| **Breadcrumb** | Navigation path indicator                     |
| **Card**       | Contained content block with optional actions |
| **Dialog**     | Modal overlay for focused interactions        |
| **Drawer**     | Slide-in panel from screen edge               |
| **Dropdown**   | Expandable menu of options                    |
| **Input**      | Form field for user text entry                |
| **Popover**    | Floating content triggered by interaction     |
| **Select**     | Dropdown for choosing from options            |
| **Sheet**      | Full-height slide-in panel                    |
| **Skeleton**   | Loading placeholder mimicking content         |
| **Tabs**       | Switchable content sections                   |
| **Toast**      | Temporary notification message                |
| **Tooltip**    | Contextual hint on hover                      |

---

## Testing Terms

| Term                  | Definition                            |
| --------------------- | ------------------------------------- |
| **E2E (End-to-End)**  | Testing complete user flows           |
| **Integration Test**  | Testing component interactions        |
| **Playwright**        | Browser automation testing framework  |
| **Unit Test**         | Testing isolated functions/components |
| **Visual Regression** | Detecting unintended UI changes       |
| **Vitest**            | Fast unit testing framework           |

---

## Security Terms

| Term               | Definition                                   |
| ------------------ | -------------------------------------------- |
| **Authentication** | Verifying user identity                      |
| **Authorization**  | Controlling user permissions                 |
| **CSRF**           | Cross-Site Request Forgery attack prevention |
| **JWT**            | JSON Web Token for secure authentication     |
| **OAuth**          | Open standard for access delegation          |
| **Session**        | Temporary authenticated user state           |
| **XSS**            | Cross-Site Scripting attack prevention       |

---

## Development Workflow Terms

| Term                  | Definition                                   |
| --------------------- | -------------------------------------------- |
| **CI/CD**             | Continuous Integration/Continuous Deployment |
| **Commit**            | Saved code change with message               |
| **Feature Branch**    | Isolated branch for new development          |
| **Lint**              | Automated code style checking                |
| **PR (Pull Request)** | Code review and merge request                |
| **Staging**           | Pre-production testing environment           |

---

## Accessibility Terms

| Term              | Definition                                       |
| ----------------- | ------------------------------------------------ |
| **A11y**          | Abbreviation for accessibility                   |
| **ARIA**          | Accessible Rich Internet Applications attributes |
| **Focus Trap**    | Keyboard focus contained within component        |
| **Screen Reader** | Assistive technology for vision-impaired users   |
| **Skip Link**     | Hidden link to bypass navigation                 |
| **WCAG**          | Web Content Accessibility Guidelines             |

---

## Platform-Specific Terms

### SimCore

| Term           | Definition                                  |
| -------------- | ------------------------------------------- |
| **Simulation** | Computational model of a system             |
| **Parameter**  | Configurable input variable                 |
| **Results**    | Output data from simulation runs            |
| **Progress**   | Completion percentage of running simulation |

### MEZAN

| Term             | Definition                              |
| ---------------- | --------------------------------------- |
| **Workflow**     | Automated sequence of tasks             |
| **Execution**    | Single run of a workflow                |
| **Success Rate** | Percentage of successful executions     |
| **Bilingual**    | Supporting Arabic and English languages |

### TalAI

| Term                | Definition                                |
| ------------------- | ----------------------------------------- |
| **Experiment**      | ML training run with specific config      |
| **Hyperparameters** | Model tuning configuration                |
| **Metrics**         | Performance measurements (loss, accuracy) |
| **Model Type**      | Architecture of neural network            |

### OptiLibria

| Term            | Definition                          |
| --------------- | ----------------------------------- |
| **Algorithm**   | Optimization method (PSO, GA, etc.) |
| **Best Score**  | Optimal value found during run      |
| **Convergence** | Progress toward optimal solution    |
| **Iterations**  | Number of optimization cycles       |

### QMLab

| Term               | Definition                                |
| ------------------ | ----------------------------------------- |
| **Quantum System** | Type of quantum simulation                |
| **Wave Function**  | Mathematical description of quantum state |
| **Measurement**    | Observation of quantum properties         |
| **Particle Count** | Number of particles in simulation         |

---

## Abbreviations

| Abbreviation | Full Term                         |
| ------------ | --------------------------------- |
| **API**      | Application Programming Interface |
| **CLI**      | Command Line Interface            |
| **CSS**      | Cascading Style Sheets            |
| **DOM**      | Document Object Model             |
| **HTML**     | HyperText Markup Language         |
| **HTTP**     | HyperText Transfer Protocol       |
| **JSON**     | JavaScript Object Notation        |
| **SQL**      | Structured Query Language         |
| **SSR**      | Server-Side Rendering             |
| **UI**       | User Interface                    |
| **URL**      | Uniform Resource Locator          |
| **UX**       | User Experience                   |

---

## Related Documents

- [Architecture](./ARCHITECTURE.md)
- [Design System](./DESIGN_SYSTEM.md)
- [API Reference](./API_REFERENCE.md)
