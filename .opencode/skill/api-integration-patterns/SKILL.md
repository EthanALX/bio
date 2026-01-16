---
name: api-integration-patterns
description: Use when creating API endpoints, integrating frontend with backend, or handling biological data communication - provides patterns for bioinformatics APIs, data contracts, error handling, and real-time data streaming
license: MIT
metadata:
  author: visual-bio-project
  version: "1.0.0"
---

# API Integration Patterns

Specialized API patterns for biological data communication between frontend and backend. Covers data contracts, streaming, error handling, and performance optimization for scientific applications.

## When to Apply

Use this skill when:
- Creating new API endpoints for biological data
- Implementing frontend-backend data integration
- Designing real-time data streaming for experiments
- Building file upload/download systems for bio formats
- Optimizing API performance for large datasets
- Implementing authentication for sensitive data

## Data Contract Patterns

### TypeScript API Types

**Biological Data Contracts:**
```typescript
// API Request/Response types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
  warnings?: string[];
}

interface SequenceAnalysisRequest {
  sequence: string;
  analysisType: 'blast' | 'alignment' | 'annotation';
  parameters: Record<string, any>;
  database?: string;
}

interface ExperimentResultsResponse {
  experimentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  results?: AnalysisResult[];
  error?: string;
  estimatedTimeRemaining?: number;
}
```

**Frontend API Client:**
```typescript
class BioApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async analyzeSequence(
    request: SequenceAnalysisRequest
  ): Promise<ApiResponse<ExperimentResultsResponse>> {
    const response = await fetch(`${this.baseUrl}/api/analysis/sequence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
    
    return response.json();
  }
  
  async getExperimentStatus(
    experimentId: string
  ): Promise<ApiResponse<ExperimentResultsResponse>> {
    const response = await fetch(
      `${this.baseUrl}/api/experiments/${experimentId}/status`
    );
    
    return response.json();
  }
}
```

### Backend API Patterns

**FastAPI Endpoint Example:**
```python
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional

app = FastAPI(title="Bio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SequenceAnalysisRequest(BaseModel):
    sequence: str
    analysisType: str
    parameters: dict = {}
    database: Optional[str] = None
    
    @validator('sequence')
    def validate_sequence(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Sequence cannot be empty')
        if not all(c.upper() in 'ACGTURYSWKMBDHVN-' for c in v):
            raise ValueError('Invalid characters in sequence')
        return v.upper()

class AnalysisResponse(BaseModel):
    experimentId: str
    status: str
    progress: float = 0.0
    results: Optional[List[dict]] = None
    error: Optional[str] = None
    estimatedTimeRemaining: Optional[int] = None

@app.post("/api/analysis/sequence", response_model=AnalysisResponse)
async def analyze_sequence(
    request: SequenceAnalysisRequest,
    background_tasks: BackgroundTasks
):
    try:
        experimentId = await create_analysis_job(request)
        background_tasks.add_task(process_analysis, experimentId, request)
        
        return AnalysisResponse(
            experimentId=experimentId,
            status="pending",
            estimatedTimeRemaining=300  # 5 minutes estimate
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## Streaming & Real-time Patterns

### WebSocket for Live Updates

**Frontend WebSocket Client:**
```typescript
class ExperimentWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  connect(experimentId: string): void {
    this.ws = new WebSocket(`ws://localhost:8000/ws/experiment/${experimentId}`);
    
    this.ws.onopen = () => {
      console.log('Connected to experiment updates');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };
    
    this.ws.onclose = () => {
      console.log('Disconnected from experiment updates');
      // Attempt to reconnect after delay
      setTimeout(() => this.connect(experimentId), 5000);
    };
  }
  
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
  
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

**Backend WebSocket Handler:**
```python
from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, experiment_id: str):
        await websocket.accept()
        if experiment_id not in self.active_connections:
            self.active_connections[experiment_id] = []
        self.active_connections[experiment_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, experiment_id: str):
        if experiment_id in self.active_connections:
            self.active_connections[experiment_id].remove(websocket)
            if not self.active_connections[experiment_id]:
                del self.active_connections[experiment_id]
    
    async def send_update(self, experiment_id: str, message: dict):
        if experiment_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[experiment_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    disconnected.append(connection)
            
            # Remove dead connections
            for conn in disconnected:
                self.disconnect(conn, experiment_id)

manager = ConnectionManager()

@app.websocket("/ws/experiment/{experiment_id}")
async def websocket_endpoint(websocket: WebSocket, experiment_id: str):
    await manager.connect(websocket, experiment_id)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, experiment_id)

async def update_experiment_progress(experiment_id: str, progress: float):
    await manager.send_update(experiment_id, {
        "type": "progress",
        "payload": {"progress": progress}
    })
```

## File Handling Patterns

### Large File Upload

**Frontend Upload Component:**
```typescript
class BioFileUploader {
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    // Start upload session
    const session = await this.startUploadSession(file.name, file.size);
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      await this.uploadChunk(session.uploadId, chunkIndex, chunk);
      
      if (onProgress) {
        onProgress(((chunkIndex + 1) / totalChunks) * 100);
      }
    }
    
    return this.completeUpload(session.uploadId);
  }
  
  private async startUploadSession(
    filename: string,
    fileSize: number
  ): Promise<UploadSession> {
    const response = await fetch('/api/upload/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, fileSize }),
    });
    
    return response.json();
  }
  
  private async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunk: Blob
  ): Promise<void> {
    const formData = new FormData();
    formData.append('uploadId', uploadId);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('chunk', chunk);
    
    await fetch('/api/upload/chunk', {
      method: 'POST',
      body: formData,
    });
  }
}
```

**Backend File Upload Handler:**
```python
import os
import aiofiles
from fastapi import UploadFile, File

UPLOAD_DIR = "uploads"

@app.post("/api/upload/start")
async def start_upload_session(
    filename: str,
    fileSize: int
):
    upload_id = generate_uuid()
    os.makedirs(f"{UPLOAD_DIR}/{upload_id}", exist_ok=True)
    
    return {
        "uploadId": upload_id,
        "chunkSize": 1024 * 1024,  # 1MB
        "totalChunks": (fileSize + 1024 * 1024 - 1) // (1024 * 1024)
    }

@app.post("/api/upload/chunk")
async def upload_chunk(
    uploadId: str,
    chunkIndex: int,
    chunk: UploadFile = File(...)
):
    chunk_path = f"{UPLOAD_DIR}/{uploadId}/chunk_{chunkIndex}"
    
    async with aiofiles.open(chunk_path, 'wb') as f:
        content = await chunk.read()
        await f.write(content)
    
    return {"status": "success"}

@app.post("/api/upload/complete")
async def complete_upload(uploadId: str):
    # Combine chunks into final file
    chunk_dir = f"{UPLOAD_DIR}/{uploadId}"
    final_filename = await combine_chunks(chunk_dir)
    
    # Process the uploaded file
    await process_uploaded_file(final_filename)
    
    return {"filename": final_filename, "status": "completed"}
```

## Error Handling Patterns

### Structured Error Responses

**Custom Error Types:**
```typescript
class BioApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
    public details?: any
  ) {
    super(message);
    this.name = 'BioApiError';
  }
}

// Specific error types
class ValidationError extends BioApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class DataNotFoundError extends BioApiError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404, 'NOT_FOUND');
  }
}

class AnalysisError extends BioApiError {
  constructor(message: string, details?: any) {
    super(message, 422, 'ANALYSIS_ERROR', details);
  }
}
```

**Error Handling Middleware:**
```python
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

class BioAPIException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int,
        error_code: str,
        details: dict = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}

@app.exception_handler(BioAPIException)
async def bio_api_exception_handler(request: Request, exc: BioAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )

# Custom exception types
class ValidationError(BioAPIException):
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, 400, "VALIDATION_ERROR", details)

class DataNotFoundError(BioAPIException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            f"{resource} '{identifier}' not found",
            404,
            "NOT_FOUND",
            {"resource": resource, "identifier": identifier}
        )
```

## Performance Optimization

### Caching Strategies

**Frontend Response Caching:**
```typescript
class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    
    const data = await fetcher();
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
    
    return data;
  }
  
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

interface CacheEntry {
  data: any;
  expiresAt: number;
}
```

**Backend Response Caching:**
```python
import time
from functools import wraps
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

def cache_response(expire: int = 300, key_builder: callable = None):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
                result = await FastAPICache.get_backend().get(cache_key)
                if result:
                    return result
            
            result = await func(*args, **kwargs)
            
            if key_builder:
                await FastAPICache.get_backend().set(
                    cache_key, 
                    result, 
                    expire=expire
                )
            
            return result
        return wrapper
    return decorator

@app.get("/api/genes/{gene_id}")
@cache_response(expire=3600)  # Cache for 1 hour
async def get_gene_info(gene_id: str):
    # Gene data doesn't change frequently
    return await fetch_gene_from_database(gene_id)
```

## Authentication & Security

### API Key Management
```typescript
class AuthenticatedApiClient extends BioApiClient {
  private apiKey: string;
  
  constructor(baseUrl: string, apiKey: string) {
    super(baseUrl);
    this.apiKey = apiKey;
  }
  
  protected async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    
    return fetch(url, { ...options, headers });
  }
}
```

### Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/analysis/sequence")
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def analyze_sequence(
    request: Request,
    sequence_request: SequenceAnalysisRequest,
    background_tasks: BackgroundTasks
):
    # Analysis is computationally expensive, so we rate limit
    pass
```

## Integration with Other Skills

Works with:
- **project:bio-data-management** - Data structures and validation
- **project:bio-development-workflow** - API requirements gathering
- **superpowers:verification-before-completion** - API testing
- **vercel-react-best-practices** - Performance optimization

These patterns ensure robust, secure, and performant communication between frontend and backend for biological applications.