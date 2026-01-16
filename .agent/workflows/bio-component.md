---
description: Create a specialized React component for biological data
---
1. **Goal**: Create a React component specialized for biological data (sequences, structures, heatmaps, etc.).
2. **Prerequisites**:
   - Identify the component Name (e.g., `SequenceViewer`).
   - Identify the Type (e.g., Sequence, Experiment, Visualization).
   - Identify the Data Format (e.g., FASTA, JSON, CSV).
   - If these are not provided, ASK the user.
3. **Standards**:
   - Use the `bio-development-workflow` skill for scientific accuracy (validating formats, using correct units).
   - Use the `vercel-react-best-practices` skill for performance (virtualization for long sequences, memoization).
   - Use the `web-design-guidelines` skill for accessibility and aesthetics.
4. **Implementation Steps**:
   - **Interface**: Define strict TypeScript interfaces. Use specific types (e.g., `string` is often too generic for a DNA sequence; validate it).
   - **Component**: Create the file in `frontend/src/components/bio/`.
   - **Features**: Implement export functionality, error handling for malformed data, and loading states.
   - **Styling**: Use Tailwind CSS properties that match the project's design system.
5. **Output**:
   - Write the component file.
   - Write a co-located test file (or storybook story if applicable).