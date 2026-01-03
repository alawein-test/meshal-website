import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, Check, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ResumeExport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create resume content
    const resumeContent = generateResumeHTML();

    // Open print dialog for PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(resumeContent);
      printWindow.document.close();
      printWindow.focus();

      // Wait for styles to load
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    setIsGenerating(false);
    setIsComplete(true);
    toast.success('Resume ready for download!');

    setTimeout(() => setIsComplete(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : isComplete ? (
          <>
            <Check className="w-4 h-4" />
            Ready!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download PDF
          </>
        )}
      </Button>

      <Button variant="outline" onClick={handlePrint} className="gap-2">
        <Printer className="w-4 h-4" />
        Print
      </Button>
    </div>
  );
}

function generateResumeHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Meshal Alawein - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Space Grotesk', sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #22d3ee;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 5px;
      color: #1a1a2e;
    }

    .title {
      font-size: 18px;
      color: #22d3ee;
      margin-bottom: 10px;
    }

    .contact {
      font-size: 14px;
      color: #666;
    }

    .contact a {
      color: #22d3ee;
      text-decoration: none;
    }

    section {
      margin-bottom: 25px;
    }

    h2 {
      font-size: 18px;
      color: #22d3ee;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    }

    .experience-item, .education-item {
      margin-bottom: 15px;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .company {
      font-weight: 600;
    }

    .role {
      color: #666;
    }

    .date {
      color: #999;
      font-size: 14px;
    }

    .description {
      font-size: 14px;
      color: #444;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .skill-category h3 {
      font-size: 14px;
      color: #22d3ee;
      margin-bottom: 5px;
    }

    .skill-list {
      font-size: 13px;
      color: #444;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .project {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 5px;
    }

    .project-name {
      font-weight: 600;
      color: #22d3ee;
    }

    .project-desc {
      font-size: 13px;
      color: #666;
    }

    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Meshal Alawein</h1>
    <div class="title">Computational Physicist & Software Engineer</div>
    <div class="contact">
      <a href="mailto:meshal@berkeley.edu">meshal@berkeley.edu</a> •
      <a href="https://linkedin.com/in/meshal-alawein">LinkedIn</a> •
      <a href="https://github.com/meshal-alawein">GitHub</a>
    </div>
  </header>

  <section>
    <h2>Summary</h2>
    <p class="description">
      Computational physicist with 10+ years of experience bridging scientific computing and software engineering.
      Specialized in high-performance simulation engines, optimization algorithms, and AI research frameworks.
      Passionate about transforming complex physics into elegant, performant code.
    </p>
  </section>

  <section>
    <h2>Experience</h2>

    <div class="experience-item">
      <div class="experience-header">
        <div>
          <span class="company">QuantumLabs</span> •
          <span class="role">Lead Computational Scientist</span>
        </div>
        <span class="date">2020 - Present</span>
      </div>
      <p class="description">
        Leading development of quantum simulation platforms. Architected QMLab, processing 1M+ quantum states.
        Reduced computation time by 85% through GPU optimization.
      </p>
    </div>

    <div class="experience-item">
      <div class="experience-header">
        <div>
          <span class="company">TechFlow Solutions</span> •
          <span class="role">Senior Software Engineer</span>
        </div>
        <span class="date">2017 - 2020</span>
      </div>
      <p class="description">
        Developed MEZAN enterprise automation platform. Implemented AI-driven decision systems.
        Built bilingual (Arabic/English) workflow engine serving 50K+ daily users.
      </p>
    </div>

    <div class="experience-item">
      <div class="experience-header">
        <div>
          <span class="company">MIT Research Lab</span> •
          <span class="role">Research Associate</span>
        </div>
        <span class="date">2014 - 2017</span>
      </div>
      <p class="description">
        Conducted computational physics research. Published 12 peer-reviewed papers.
        Developed SimCore simulation engine now used across 20+ research institutions.
      </p>
    </div>
  </section>

  <section>
    <h2>Education</h2>

    <div class="education-item">
      <div class="experience-header">
        <div>
          <span class="company">MIT</span> •
          <span class="role">Ph.D. Computational Physics</span>
        </div>
        <span class="date">2014</span>
      </div>
    </div>

    <div class="education-item">
      <div class="experience-header">
        <div>
          <span class="company">Stanford University</span> •
          <span class="role">B.S. Physics & Computer Science</span>
        </div>
        <span class="date">2010</span>
      </div>
    </div>
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skills-grid">
      <div class="skill-category">
        <h3>Languages</h3>
        <div class="skill-list">Python, Rust, TypeScript, Julia, C++, Go</div>
      </div>
      <div class="skill-category">
        <h3>Frameworks</h3>
        <div class="skill-list">React, PyTorch, TensorFlow, FastAPI, Node.js</div>
      </div>
      <div class="skill-category">
        <h3>Scientific</h3>
        <div class="skill-list">NumPy, SciPy, CUDA, WebGPU, OpenCL</div>
      </div>
      <div class="skill-category">
        <h3>Infrastructure</h3>
        <div class="skill-list">AWS, Docker, Kubernetes, PostgreSQL, Redis</div>
      </div>
    </div>
  </section>

  <section>
    <h2>Key Projects</h2>
    <div class="projects-grid">
      <div class="project">
        <div class="project-name">SimCore</div>
        <div class="project-desc">Real-time physics simulation engine with GPU acceleration</div>
      </div>
      <div class="project">
        <div class="project-name">QMLab</div>
        <div class="project-desc">Interactive quantum mechanics laboratory platform</div>
      </div>
      <div class="project">
        <div class="project-name">MEZAN</div>
        <div class="project-desc">Enterprise workflow automation with AI decision-making</div>
      </div>
      <div class="project">
        <div class="project-name">OptiLibria</div>
        <div class="project-desc">Optimization algorithm library for scientific computing</div>
      </div>
    </div>
  </section>
</body>
</html>
  `;
}
