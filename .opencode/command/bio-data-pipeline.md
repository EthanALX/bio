# Bio Data Pipeline Command

Creates ETL (Extract, Transform, Load) data pipelines for biological data processing with integrated superpowers patterns.

## Usage

```bash
bio-data-pipeline <name> [options]
```

## Options

- `--source <type>` - Data source type:
  - `file-upload` - User uploaded files
  - `api-endpoint` - External API data
  - `database` - Database query results
  - `stream` - Real-time data stream

- `--format <format>` - Input data format:
  - `fasta` - FASTA sequence files
  - `genbank` - GenBank format
  - `csv` - CSV experimental data
  - `json` - JSON structured data
  - `xml` - XML biological data

- `--transform <operations>` - Comma-separated transformations:
  - `validate` - Data quality validation
  - `normalize` - Data normalization
  - `annotate` - Add biological annotations
  - `filter` - Apply data filters
  - `aggregate` - Statistical aggregation

- `--destination <type>` - Output destination:
  - `database` - Store in database
  - `file` - Generate output files
  - `api` - Send to API endpoint
  - `cache` - Cache for quick access

## Examples

```bash
# Create a FASTA file processing pipeline
bio-data-pipeline FastaProcessor --source file-upload --format fasta --transform validate,annotate --destination database

# Create an API data collection pipeline
bio-data-pipeline ApiCollector --source api-endpoint --format json --transform normalize,filter --destination cache

# Create a real-time stream processor
bio-data-pipeline StreamProcessor --source stream --format csv --transform validate,aggregate --destination api
```

## Pipeline Components

### 1. Extraction Layer

**File Upload Extraction:**
- Chunked upload for large files
- Format validation during upload
- Progress tracking and error handling
- Virus scanning for security

**API Data Extraction:**
- Rate limiting and retry logic
- Authentication handling
- Data pagination support
- Error recovery mechanisms

**Database Extraction:**
- Query optimization
- Connection pooling
- Streaming for large result sets
- Transaction management

### 2. Transformation Layer

**Data Validation:**
```typescript
// Generated validation patterns
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metrics: QualityMetrics;
}

class FastaValidator {
  validate(content: string): ValidationResult {
    // FASTA-specific validation logic
    // Sequence quality checks
    // Format compliance verification
  }
}
```

**Data Normalization:**
```typescript
// Biological data normalization
class DataNormalizer {
  normalizeSequences(sequences: SequenceData[]): NormalizedSequences {
    // Standardize sequence formats
    // Handle ambiguous bases
    // Convert between coordinate systems
  }
  
  normalizeExpression(expression: ExpressionData[]): NormalizedExpression {
    // Log transformation
    // Quantile normalization
    // Batch effect correction
  }
}
```

**Annotation Enrichment:**
```typescript
class AnnotationService {
  async annotateSequences(sequences: string[]): Promise<SequenceAnnotation[]> {
    // Lookup gene names
    // Add functional annotations
    // Include pathway information
  }
  
  async annotateVariants(variants: VariantData[]): Promise<VariantAnnotation[]> {
    // Clinical significance
    // Population frequencies
    // Predicted effects
  }
}
```

### 3. Loading Layer

**Database Loading:**
- Batch insert operations
- Upsert logic for idempotency
- Index optimization
- Transaction safety

**File Generation:**
- Multiple output formats
- Compression for large files
- Metadata inclusion
- Integrity verification

**API Publishing:**
- Webhook notifications
- Event streaming
- RESTful endpoints
- GraphQL subscriptions

## Performance Optimizations

### Parallel Processing
```typescript
class ParallelProcessor {
  async processInBatches<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    batchSize: number = 1000,
    concurrency: number = 4
  ): Promise<R[]> {
    // Parallel batch processing
    // Memory management
    // Progress tracking
    // Error handling
  }
}
```

### Memory Management
```typescript
class StreamProcessor {
  async processLargeFile(filePath: string): Promise<ProcessingResult> {
    // Stream-based processing
    // Chunked reading
    // Backpressure handling
    // Resource cleanup
  }
}
```

### Caching Strategy
```typescript
class PipelineCache {
  // Reference data caching
  // Intermediate result caching
  // Query result caching
  // Distributed cache support
}
```

## Monitoring & Observability

### Metrics Collection
```typescript
interface PipelineMetrics {
  throughput: number;
  errorRate: number;
  processingTime: number;
  memoryUsage: number;
  queueDepth: number;
}

class MetricsCollector {
  recordProcessingStep(step: string, duration: number): void;
  recordError(error: Error, context: any): void;
  recordThroughput(itemsProcessed: number, timeWindow: number): void;
}
```

### Logging & Auditing
- Structured logging with context
- Data lineage tracking
- Performance profiling
- Error traceback collection

## Error Handling & Recovery

### Retry Logic
```typescript
class RetryManager {
  async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    backoffMs: number = 1000
  ): Promise<T> {
    // Exponential backoff
    // Circuit breaker pattern
    // Dead letter queue
  }
}
```

### Data Recovery
- Checkpoint and restart capability
- Partial failure handling
- Data consistency verification
- Rollback mechanisms

## Integration with Superpowers

This command leverages:
- `project:bio-data-management` - Data patterns and validation
- `project:api-integration-patterns` - Backend integration
- `vercel-react-best-practices` - Performance optimization
- `superpowers:test-driven-development` - Testing patterns

## Generated Pipeline Structure

```
src/pipelines/
├── <name>/
│   ├── extractors/
│   │   ├── file-extractor.ts
│   │   ├── api-extractor.ts
│   │   └── database-extractor.ts
│   ├── transformers/
│   │   ├── validator.ts
│   │   ├── normalizer.ts
│   │   └── annotator.ts
│   ├── loaders/
│   │   ├── database-loader.ts
│   │   ├── file-loader.ts
│   │   └── api-loader.ts
│   ├── monitoring/
│   │   ├── metrics.ts
│   │   └── logger.ts
│   ├── types.ts
│   ├── pipeline.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── performance/
└── docs/
    ├── pipeline.md
    └── api.md
```

## Configuration

Each pipeline includes configurable options:
- Processing parameters
- Quality thresholds
- Performance settings
- Notification preferences

```typescript
interface PipelineConfig {
  validation: ValidationConfig;
  performance: PerformanceConfig;
  monitoring: MonitoringConfig;
  notifications: NotificationConfig;
}
```

## Deployment

Generated pipelines are container-ready with:
- Dockerfile generation
- Kubernetes manifests
- Environment variable configuration
- Health check endpoints

## Example Usage

```typescript
// Generated pipeline usage
const pipeline = new BioDataPipeline('fasta-processor');

const result = await pipeline.process({
  source: { type: 'file', path: '/path/to/file.fasta' },
  transformations: ['validate', 'annotate'],
  destination: { type: 'database', table: 'sequences' }
});

console.log(`Processed ${result.recordsProcessed} records`);
console.log(`Quality score: ${result.qualityScore}`);
```