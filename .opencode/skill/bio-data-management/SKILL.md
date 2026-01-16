---
name: bio-data-management
description: Use when handling biological data, implementing data validation, or managing scientific datasets - provides patterns for biological data types, validation, storage, and processing workflows
license: MIT
metadata:
  author: visual-bio-project
  version: "1.0.0"
---

# Bio Data Management

Comprehensive patterns for handling biological data in web applications. Covers validation, storage, processing, and display of scientific datasets with integrity and performance considerations.

## When to Apply

Use this skill when:
- Implementing biological data validation or parsing
- Designing data storage strategies for scientific datasets
- Creating data transformation or processing pipelines
- Building import/export functionality for bio formats
- Handling large-scale biological datasets
- Implementing data caching or optimization strategies

## Biological Data Types & Patterns

### Genomic Data Patterns

**DNA/RNA Sequences:**
```typescript
interface SequenceData {
  id: string;
  type: 'dna' | 'rna' | 'protein';
  sequence: string;
  length: number;
  quality?: number[];
  annotations?: SequenceAnnotation[];
}

interface SequenceAnnotation {
  type: 'gene' | 'exon' | 'intron' | 'utr';
  start: number;
  end: number;
  strand: '+' | '-';
  name?: string;
  description?: string;
}
```

**Genome Coordinates:**
```typescript
interface GenomicCoordinate {
  chromosome: string;
  position: number;
  strand?: '+' | '-';
  reference?: string; // hg38, hg19, etc.
}

interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
  strand?: '+' | '-';
  reference?: string;
}
```

### Experimental Data Patterns

**Microarray/Sequencing Data:**
```typescript
interface ExperimentData {
  id: string;
  type: 'rna-seq' | 'microarray' | 'proteomics';
  samples: Sample[];
  measurements: Measurement[];
  metadata: ExperimentMetadata;
}

interface Sample {
  id: string;
  name: string;
  conditions: Record<string, any>;
  tissue?: string;
  donor?: string;
  timestamp: Date;
}
```

**Protein Structures:**
```typescript
interface ProteinStructure {
  id: string;
  name: string;
  sequence: string;
  chains: ProteinChain[];
  domains: ProteinDomain[];
  pdbUrl?: string;
}

interface ProteinChain {
  chainId: string;
  sequence: string;
  length: number;
  secondaryStructure: SecondaryStructure[];
}
```

## Data Validation Strategies

### Format Validation

**FASTA Format Validation:**
```typescript
function validateFasta(content: string): ValidationResult {
  const lines = content.trim().split('\n');
  let hasHeader = false;
  let sequenceLength = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('>')) {
      if (hasHeader && sequenceLength === 0) {
        return { valid: false, error: `Empty sequence before header at line ${i + 1}` };
      }
      hasHeader = true;
      sequenceLength = 0;
    } else if (line) {
      if (!/^[ACGTURYSWKMBDHVNacgturyswkmbdhvn-]+$/.test(line)) {
        return { valid: false, error: `Invalid characters in sequence at line ${i + 1}` };
      }
      sequenceLength += line.length;
    }
  }
  
  return { valid: true };
}
```

**GenBank Format Validation:**
```typescript
function validateGenBank(content: string): ValidationResult {
  const requiredFeatures = ['LOCUS', 'DEFINITION', 'ACCESSION', 'VERSION', 'ORIGIN'];
  const lines = content.split('\n');
  const foundFeatures = new Set<string>();
  
  for (const line of lines) {
    const feature = line.split(' ')[0];
    if (requiredFeatures.includes(feature)) {
      foundFeatures.add(feature);
    }
  }
  
  const missing = requiredFeatures.filter(f => !foundFeatures.has(f));
  if (missing.length > 0) {
    return { valid: false, error: `Missing required features: ${missing.join(', ')}` };
  }
  
  return { valid: true };
}
```

### Data Quality Checks

**Sequence Quality Metrics:**
```typescript
interface QualityMetrics {
  length: number;
  gcContent: number;
  ambiguousCount: number;
  complexityScore: number;
  warnings: string[];
}

function analyzeSequenceQuality(sequence: string): QualityMetrics {
  const ambiguousCount = (sequence.match(/[NRYKMSWBDHV]/gi) || []).length;
  const gcCount = (sequence.match(/[GCgc]/g) || []).length;
  const gcContent = gcCount / sequence.length;
  
  const warnings: string[] = [];
  if (gcContent < 0.3 || gcContent > 0.7) {
    warnings.push('Unusual GC content');
  }
  if (ambiguousCount / sequence.length > 0.05) {
    warnings.push('High ambiguous base content');
  }
  
  return {
    length: sequence.length,
    gcContent,
    ambiguousCount,
    complexityScore: calculateComplexity(sequence),
    warnings
  };
}
```

## Data Storage Strategies

### Database Schema Patterns

**Document Storage for Flexible Data:**
```typescript
// MongoDB/DocumentDB pattern
interface BioDocument {
  _id: string;
  dataType: 'sequence' | 'experiment' | 'annotation';
  version: number;
  createdAt: Date;
  updatedAt: Date;
  data: any; // Flexible structure
  metadata: {
    source: string;
    quality: number;
    tags: string[];
    permissions: string[];
  };
}
```

**Relational Storage for Structured Data:**
```sql
-- Experiments table
CREATE TABLE experiments (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type experiment_type NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Samples table
CREATE TABLE samples (
  id UUID PRIMARY KEY,
  experiment_id UUID REFERENCES experiments(id),
  name VARCHAR(255) NOT NULL,
  conditions JSONB,
  tissue VARCHAR(100)
);

-- Measurements table
CREATE TABLE measurements (
  id UUID PRIMARY KEY,
  sample_id UUID REFERENCES samples(id),
  gene_id VARCHAR(50),
  expression_value DECIMAL(10,6),
  p_value DECIMAL(10,6),
  normalized BOOLEAN DEFAULT FALSE
);
```

### Caching Strategies

**Reference Data Caching:**
```typescript
class ReferenceDataCache {
  private cache = new Map<string, any>();
  private ttl = new Map<string, number>();
  
  async getReferenceGene(geneId: string): Promise<GeneData> {
    const cacheKey = `gene:${geneId}`;
    
    if (this.isValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const geneData = await this.fetchGeneFromDatabase(geneId);
    this.set(cacheKey, geneData, 24 * 60 * 60 * 1000); // 24 hours
    
    return geneData;
  }
  
  private isValid(key: string): boolean {
    return this.cache.has(key) && 
           Date.now() < (this.ttl.get(key) || 0);
  }
}
```

## Data Processing Patterns

### Stream Processing for Large Files

**Large File Parser:**
```typescript
class FastaStreamParser {
  async *parseFile(filePath: string): AsyncGenerator<SequenceData> {
    const fileStream = createReadStream(filePath);
    let currentSequence = '';
    let currentHeader = '';
    
    for await (const line of fileStream) {
      const lineStr = line.toString().trim();
      
      if (lineStr.startsWith('>')) {
        if (currentSequence) {
          yield this.createSequenceData(currentHeader, currentSequence);
        }
        currentHeader = lineStr.substring(1);
        currentSequence = '';
      } else {
        currentSequence += lineStr;
      }
    }
    
    if (currentSequence) {
      yield this.createSequenceData(currentHeader, currentSequence);
    }
  }
  
  private createSequenceData(header: string, sequence: string): SequenceData {
    const parts = header.split('|');
    return {
      id: parts[0] || '',
      sequence,
      length: sequence.length,
      annotations: []
    };
  }
}
```

### Background Processing

**Job Queue for Analysis Tasks:**
```typescript
interface AnalysisJob {
  id: string;
  type: 'blast' | 'alignment' | 'annotation';
  inputFiles: string[];
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

class BioAnalysisQueue {
  async submitAnalysis(
    type: AnalysisJob['type'],
    inputFiles: string[],
    parameters: Record<string, any>
  ): Promise<string> {
    const job: AnalysisJob = {
      id: generateId(),
      type,
      inputFiles,
      parameters,
      status: 'pending',
      progress: 0
    };
    
    await this.saveJob(job);
    await this.queueProcessor.process(job.id);
    
    return job.id;
  }
}
```

## Data Visualization Patterns

### Chart Data Preparation

**Expression Data for Heatmaps:**
```typescript
function prepareHeatmapData(
  expressionData: ExpressionData[],
  samples: string[]
): HeatmapData {
  const genes = [...new Set(expressionData.map(d => d.geneId))];
  
  return {
    genes,
    samples,
    matrix: genes.map(gene => 
      samples.map(sample => {
        const data = expressionData.find(d => d.geneId === gene && d.sampleId === sample);
        return data?.expressionValue || 0;
      })
    ),
    metadata: {
      maxValue: Math.max(...expressionData.map(d => d.expressionValue)),
      minValue: Math.min(...expressionData.map(d => d.expressionValue))
    }
  };
}
```

**Network Graph Data:**
```typescript
function prepareNetworkData(
  interactions: ProteinInteraction[]
): NetworkData {
  const nodes = new Map<string, NetworkNode>();
  const edges: NetworkEdge[] = [];
  
  for (const interaction of interactions) {
    // Add nodes if they don't exist
    if (!nodes.has(interaction.protein1)) {
      nodes.set(interaction.protein1, {
        id: interaction.protein1,
        label: interaction.protein1,
        group: 'protein'
      });
    }
    
    if (!nodes.has(interaction.protein2)) {
      nodes.set(interaction.protein2, {
        id: interaction.protein2,
        label: interaction.protein2,
        group: 'protein'
      });
    }
    
    // Add edge
    edges.push({
      source: interaction.protein1,
      target: interaction.protein2,
      weight: interaction.confidence
    });
  }
  
  return {
    nodes: Array.from(nodes.values()),
    edges
  };
}
```

## Performance Optimization

### Pagination and Virtualization

**Large Dataset Pagination:**
```typescript
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class DatasetPaginator<T> {
  constructor(
    private dataSource: (offset: number, limit: number) => Promise<{ data: T[], total: number }>
  ) {}
  
  async getPage(page: number, pageSize: number): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * pageSize;
    const { data, total } = await this.dataSource(offset, pageSize);
    
    return {
      data,
      total,
      page,
      pageSize,
      hasMore: offset + data.length < total
    };
  }
}
```

## Data Security & Compliance

### Data Anonymization
```typescript
function anonymizePatientData(data: PatientData): AnonymizedData {
  return {
    ...data,
    patientId: generateAnonymousId(),
    name: undefined,
    birthDate: undefined,
    address: undefined,
    // Keep age range if needed for research
    ageRange: calculateAgeRange(data.birthDate)
  };
}
```

## Integration with Other Skills

Works with:
- **project:bio-development-workflow** - Requirements for data structures
- **project:api-integration-patterns** - Backend data endpoints
- **superpowers:test-driven-development** - Testing data validation
- **vercel-react-best-practices** - Performance for large datasets

This skill ensures biological data is handled with scientific rigor, performance considerations, and appropriate security measures.