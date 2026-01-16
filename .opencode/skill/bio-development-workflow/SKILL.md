---
name: bio-development-workflow
description: Use when developing biological features, creating bioinformatics components, or modifying scientific data workflows - adapts brainstorming for biological applications with focus on data integrity, scientific accuracy, and research workflows
license: MIT
metadata:
  author: visual-bio-project
  version: "1.0.0"
---

# Bio Development Workflow

Specialized development workflow for biological features and bioinformatics applications. Extends brainstorming principles with scientific data handling, research methodology, and domain-specific patterns.

## When to Apply

Use this skill when:
- Creating new biological features (gene analysis, protein structures, etc.)
- Developing bioinformatics components (charts, data tables, visualization)
- Modifying scientific data workflows or pipelines
- Building experiment interfaces or research tools
- Implementing data import/export for biological formats

## Bio-Specific Requirements Gathering

### 1. Scientific Context Analysis
**Before writing any code, ask about:**

- **Data Types**: What biological data formats? (FASTA, GenBank, CSV, JSON, etc.)
- **Scale**: Data volume considerations (single genes vs genome-scale)
- **Accuracy**: Required precision levels and validation needs
- **Compliance**: Regulatory requirements (HIPAA, GDPR, etc.)
- **Reproducibility**: Experiment replication requirements
- **Performance**: Real-time vs batch processing needs

### 2. Research Workflow Integration
**Understand the scientific process:**

- **Input Sources**: Lab equipment, databases, user uploads, APIs
- **Processing Steps**: Data transformation, analysis, validation
- **Output Requirements**: Reports, visualizations, exports
- **Quality Control**: Error handling, data validation, verification
- **Collaboration**: Multi-user access, sharing, permissions

### 3. User Expertise Assessment
**Target user analysis:**

- **Scientific Background**: Researcher, student, clinician, citizen scientist
- **Technical Comfort**: Expert users vs point-and-click interface
- **Domain Knowledge**: Molecular biology, genetics, medical, general
- **Workflow Preferences**: Guided wizards vs flexible exploration

## Biological Data Patterns

### Data Structure Guidelines

**Genomic Data:**
```typescript
interface GenomicData {
  id: string;
  sequence: string;
  annotations: Annotation[];
  metadata: {
    organism: string;
    version: string;
    source: string;
  };
}
```

**Experimental Data:**
```typescript
interface ExperimentData {
  experimentId: string;
  timestamp: Date;
  conditions: Record<string, any>;
  measurements: Measurement[];
  quality: QualityMetrics;
}
```

**Visualization Data:**
```typescript
interface VisualizationConfig {
  type: 'heatmap' | 'scatter' | 'network' | 'sequence';
  dataSource: string;
  filters: FilterConfig[];
  interactions: InteractionConfig[];
}
```

### Component Design Patterns

**Data Tables with Scientific Features:**
- Sortable columns with scientific notation
- Export to multiple formats (CSV, Excel, JSON)
- Column-based filtering with scientific operators
- Pagination for large datasets
- Row selection for batch operations

**Visualization Components:**
- Responsive sizing for complex data
- Interactive tooltips with detailed information
- Zoom/pan for dense data points
- Color schemes accessible for colorblind users
- Export capabilities for publications

**Input Forms:**
- Validation for biological data formats
- Auto-completion for standard terms (gene names, etc.)
- Units handling and conversion
- File upload with format validation
- Progress indicators for long operations

## Quality Assurance for Biological Applications

### Data Integrity Validation
- **Format Validation**: Check file formats and structure
- **Range Validation**: Verify biological data ranges
- **Consistency Checks**: Cross-reference related data points
- **Completeness**: Required fields and data coverage

### Scientific Accuracy
- **Algorithm Verification**: Validate computational methods
- **Statistical Validation**: Ensure correct statistical methods
- **Reproducibility**: Document parameters and random seeds
- **Version Control**: Track algorithm and parameter changes

### Performance Considerations
- **Large Dataset Handling**: Pagination, virtualization, lazy loading
- **Memory Management**: Streaming for large files
- **Background Processing**: Long-running operations
- **Caching**: Frequently accessed reference data

## Integration with Existing Superpowers

This skill works with these global superpowers:
- **superpowers:test-driven-development** - TDD for bio features
- **superpowers:writing-plans** - Implementation planning for scientific features
- **superpowers:systematic-debugging** - Debugging biological data issues
- **superpowers:verification-before-completion** - Validation of scientific accuracy

## Bio-Specific Anti-Patterns

**Avoid:**
- Hard-coding scientific constants without documentation
- Assuming data quality without validation
- Ignoring scale requirements for large datasets
- Over-simplifying complex biological concepts
- Neglecting accessibility in scientific visualizations

**Prefer:**
- Configurable parameters with scientific defaults
- Comprehensive data validation and error handling
- Scalable architectures from the start
- Clear documentation of biological assumptions
- Accessible design following scientific standards

## Implementation Checklist

Before proceeding to implementation:
- [ ] Scientific requirements clearly documented
- [ ] Data types and formats identified
- [ ] Scale and performance requirements defined
- [ ] User expertise level assessed
- [ ] Quality control measures planned
- [ ] Compliance requirements identified
- [ ] Integration points with existing workflows mapped
- [ ] Testing strategy for scientific accuracy planned

## Next Steps

After completing this bio-specific brainstorming:
1. Use `superpowers:writing-plans` for detailed implementation planning
2. Apply `project:bio-data-management` for data handling patterns
3. Use `project:api-integration-patterns` for backend integration
4. Follow `superpowers:test-driven-development` for implementation

This ensures biological features are developed with scientific rigor, data integrity, and research workflow integration in mind.