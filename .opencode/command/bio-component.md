# Bio Component Command

Creates specialized React components for biological data with built-in superpowers patterns and best practices.

## Usage

```bash
bio-component <name> [options]
```

## Options

- `--type <type>` - Component type:
  - `sequence` - DNA/RNA/protein sequence viewer
  - `experiment` - Experimental data table
  - `visualization` - Data visualization component
  - `upload` - File upload for bio formats
  - `analysis` - Analysis results display

- `--data-type <type>` - Data type (for validation)
  - `fasta` - FASTA sequence data
  - `genbank` - GenBank format
  - `csv` - Experimental CSV data
  - `json` - JSON structured data

- `--features <features>` - Comma-separated features:
  - `export` - Export functionality
  - `filter` - Filtering capabilities
  - `search` - Search functionality
  - `pagination` - Large dataset pagination
  - `realtime` - Real-time updates

## Examples

```bash
# Create a sequence viewer component
bio-component SequenceViewer --type sequence --data-type fasta --features export,search

# Create an experiment data table
bio-component ExperimentTable --type experiment --data-type csv --features filter,pagination

# Create a visualization component
bio-component HeatmapVisualization --type visualization --features export,realtime
```

## Integration with Superpowers

This command automatically applies patterns from:
- `project:bio-development-workflow` - Scientific requirements
- `project:bio-data-management` - Data validation patterns
- `project:api-integration-patterns` - API integration
- `vercel-react-best-practices` - Performance optimization

## Generated Component Features

### Sequence Components
- Format validation (FASTA, GenBank)
- Quality metrics display
- Annotation support
- Export to multiple formats

### Data Table Components
- Scientific notation support
- Advanced filtering
- Batch operations
- Real-time updates via WebSocket

### Visualization Components
- Responsive design
- Color accessibility
- Interactive tooltips
- Publication-ready exports

### Upload Components
- Format validation
- Progress tracking
- Chunk upload for large files
- Error handling

## Testing

Each component includes:
- Unit tests for data validation
- Integration tests for API calls
- Performance tests for large datasets
- Accessibility tests

## Performance Optimizations

- Virtualization for large datasets
- Memoization for expensive calculations
- Lazy loading for visualization data
- Optimized re-rendering patterns

## Example Output

The command generates:
1. Component file with TypeScript types
2. Test file with comprehensive coverage
3. Storybook stories for documentation
4. API integration hooks
5. Validation utilities

```typescript
// Example generated component
interface SequenceViewerProps {
  sequence: string;
  annotations?: SequenceAnnotation[];
  onExport?: (format: 'fasta' | 'genbank') => void;
  className?: string;
}

export const SequenceViewer: React.FC<SequenceViewerProps> = ({
  sequence,
  annotations = [],
  onExport,
  className
}) => {
  // Component implementation with bio-specific patterns
};
```