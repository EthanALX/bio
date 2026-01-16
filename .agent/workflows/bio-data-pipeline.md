---
description: Create ETL data pipelines for biological data processing
---
1. **Goal**: Create a data pipeline to Extract, Transform, and Load (ETL) biological data.
2. **Prerequisites**:
   - Source (e.g., File upload, API, Database).
   - Format (e.g., FASTA, GenBank, CSV).
   - Transformations (e.g., Normalize, Validate, Annotate).
   - Destination (e.g., Database, JSON file).
   - If not provided, ASK the user.
3. **Standards**:
   - Use `bio-data-management` skill for data validation rules.
   - Use `api-integration-patterns` if fetching from external sources (NCBI, Ensembl).
4. **Implementation Steps**:
   - **Structure**: Create a modular structure (Extractor -> Transformer -> Loader).
   - **Validation**: Implement robust validation for biological formats. Fail fast on invalid headers/sequences.
   - **Performance**: For large files (e.g., GB-sized FASTA), use streaming (Node.js Streams) instead of loading everything into memory.
   - **Error Handling**: Implement specific errors for data issues vs. network issues.
5. **Output**:
   - Create the pipeline files in `backend/src/pipelines/` or appropriate directory.
   - Create a usage example or test case.