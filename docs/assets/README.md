# Documentation Assets

This directory contains visual assets for the documentation.

## Contents

- `architecture-overview.svg` - High-level system architecture
- `data-flow.svg` - Request/response data flow
- `component-hierarchy.svg` - React component structure
- `platform-architecture.svg` - Platform dashboard architecture

## Usage

Reference assets in documentation using relative paths:

```markdown
!Architecture Overview
```

## Generating Diagrams

Diagrams are created using Mermaid syntax in the documentation. For static SVG
exports, use tools like:

- [Mermaid Live Editor](https://mermaid.live/)
- [mermaid-cli](https://github.com/mermaid-js/mermaid-cli)

```bash
# Generate SVG from mermaid file
npx @mermaid-js/mermaid-cli -i diagram.mmd -o output.svg
```
