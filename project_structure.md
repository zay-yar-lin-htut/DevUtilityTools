# Fusion.IntelligentPortal.API - Project Structure

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Framework** | ASP.NET Core 8.0 (Web API) |
| **Language** | C# (.NET 8) |
| **Database** | SQL Server with Entity Framework Core 8.0 |
| **ORM** | Entity Framework Core |
| **Authentication** | JWT Bearer Tokens (Dual schemes: SuperAdmin & CustomerAdmin) |
| **Background Jobs** | Hangfire with SQL Server storage |
| **API Documentation** | Swagger/Swashbuckle |
| **API Versioning** | ASP.Versioning |
| **Cloud Services** | Azure (Key Vault, Blob Storage, AI services, Communication Email) |
| **AI/ML Services** | Azure OpenAI, Azure AI Document Intelligence, Azure Speech Services |
| **Mapping** | AutoMapper |
| **Excel Processing** | EPPlus, ClosedXML, ExcelDataReader |
| **PDF Processing** | PDFsharp, PdfPig |
| **Audio Processing** | NAudio, MediaToolkit, Xabe.FFmpeg |

---

## Architecture Overview

The project follows a **4-layer architecture** with clear separation of concerns:

```
Fusion.IntelligentPortal.API/
├── API/              # Presentation Layer (ASP.NET Core Web API)
├── BAL/              # Business Access Layer (Business Logic)
├── MODEL/            # Domain Layer (Entities, DTOs, Configuration)
└── REPOSITORY/       # Data Access Layer (Repositories, EF Core)
```

### Project Dependencies

```
API → BAL → REPOSITORY
      ↓
     MODEL
```

---

## Directory Structure

### API/ - Presentation Layer

| Directory/File | Purpose |
|----------------|---------|
| `Controllers/` | 46 API Controllers handling HTTP requests |
| `Helpers/` | Utility classes (Authentication, ImageHandler, KeyVaultService, TokenGenerator) |
| `Program.cs` | Application startup, DI configuration, middleware setup |
| `appsettings.json` | Application configuration |
| `ffmpeg/` | FFmpeg binaries for video/audio processing |
| `HangfireAttachments/` | Background job implementations |
| `Properties/` | Launch settings, Azure deployment profiles |
| `AutoMapperProfile.cs` | Entity to DTO mapping configurations |

### BAL/ - Business Logic Layer

| Directory | Purpose |
|-----------|---------|
| `Services/` | 50 service implementations (business logic) |
| `IServices/` | 48 service interfaces (dependency contracts) |
| `Shared/` | 24 shared utilities/services (OCR, OpenAI, Blob, Scheduling, etc.) |

### MODEL/ - Domain Layer

| Directory | Purpose |
|-----------|---------|
| `Entities/` | 73 Entity Framework entity classes (database models) |
| `DTOs/` | 44 Data Transfer Objects for API contracts |
| `ApplicationConfig/` | Configuration models (AppSettings, ResponseModel, Common) |
| `DataContext.cs` | Entity Framework DbContext with 72 DbSets |

### REPOSITORY/ - Data Access Layer

| Directory | Purpose |
|-----------|---------|
| `Repositories/Repositories/` | 72 entity-specific repository implementations |
| `UnitOfWork/` | Unit of Work pattern implementation |
| `Repositories/` | Generic repository interface and base implementation |

---

## Key Patterns

### Controller Pattern

```csharp
[Authorize(AuthenticationSchemes = "CustomerAdmin")]
[Produces("application/json")]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1")]
public class OcrBatchController : ControllerBase
```

### Service Pattern

- Interfaces in `BAL/IServices/` (e.g., `IOcrGPTBatchService.cs`)
- Implementations in `BAL/Services/` (e.g., `OcrGPTBatchService.cs`)

### Repository Pattern

- Generic repository interface: `IGenericRepository<T>`
- Entity-specific repositories: `OcrBatchRepository.cs`, etc.
- Unit of Work for transaction management

### API Response Pattern

```csharp
return Ok(new ResponseModel {
    Message = Messages.Successful,
    Status = APIStatus.Successful,
    Data = result
});
```

### AutoMapper Profile

- Centralized mapping in `API/AutoMapperProfile.cs`
- Extensive Entity to DTO mappings with custom configurations

---

## Feature Domains

| Domain | Controllers |
|--------|-------------|
| **OCR/Document Processing** | OcrBatch, OcrLarge, OcrModel, OcrVision, PrebuiltDoc, DocumentAi |
| **Speech Services** | SpeechToText, SpeechToTextLarge, TextToSpeech, TTS/STT Power Apps |
| **AI/ML** | AIModel, AiPrompt, ModelPrompt |
| **User Management** | Employee, CustomerAdmin, ProductAdmin, Role, Permission |
| **Company** | RegisterCompany, Company |
| **Data Management** | DataManagement, StoreProcedure |
| **LINE Integration** | LineWebhook, LineChannelConfigurations |
| **Validation** | Validation |
| **Logging** | Log, LogOcrHistory |
| **Dashboard** | Dashboard |
| **Infrastructure** | Token, FileUpload, VMService, EndpointSetting |

---

## Azure Integration

| Service | Usage |
|---------|-------|
| **Key Vault** | Secrets stored and loaded at startup |
| **Blob Storage** | File storage for images, converted files, OCR results |
| **OpenAI** | Azure OpenAI with custom load balancer |
| **Document Intelligence** | Document parsing and OCR |
| **Speech Services** | Text-to-Speech and Speech-to-Text |
| **Email** | Azure Communication Email service |

---

## Authentication

- **Dual JWT Schemes**: Separate authentication for SuperAdmin vs CustomerAdmin
- **JWT Bearer Tokens** for API authorization
- Role-based permissions with `Role` and `Permission` entities

---

## Background Jobs

- **Hangfire** with SQL Server storage
- Recurring jobs for:
  - Daily resets
  - Expiry checks
  - Reminder emails

---

## Special Configurations

| Setting | Value |
|---------|-------|
| Max Request Body Size | 500MB |
| Code Pages Encoding | Enabled for Excel file support |
| API Versioning | Enabled via `ASP.Versioning` |
| Swagger | Enabled for API documentation |

---

## Database Entities Overview

The system manages data for:

- **Users & Auth**: Employees, Product Admins, Customer Admins, Roles, Permissions
- **Companies**: Company profiles, Pricing Plans, Active Employees
- **AI Services**: AI Models, Prompts, Endpoint configurations
- **OCR Services**: Models, Batches, Logs, Vision GPT, Prebuilt docs
- **Speech Services**: Text-to-Speech, Speech-to-Text, Power App integrations
- **Communication**: LINE webhook configurations, Chat history
- **Validation**: Master file validation, Human validation
- **Infrastructure**: Endpoint settings, Call logs, Token management

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `API/Program.cs` | Main entry point with full DI configuration |
| `API/appsettings.json` | Environment config, Azure endpoints, Blob containers |
| `API/appsettings.Development.json` | Development-specific overrides |
| `API/API.sln` | Visual Studio solution file |
| `API/.config/dotnet-tools.json` | .NET tool manifest |
| `API/Properties/launchSettings.json` | VS debug launch profiles |
| `API/Properties/ServiceDependencies/` | Azure App Service deployment configs |
