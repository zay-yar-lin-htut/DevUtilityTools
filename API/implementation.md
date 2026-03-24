# Developer Utilities Platform - Implementation Plan

## Overview
Build a developer utilities web application with JSON, Markdown, and Diff tools using ASP.NET MVC (Backend) + Vue + TailwindCSS (Frontend).

---

## Project Architecture

```
ASP.NET App
│
├── API (Controllers, Services, Repositories, Models)
│
└── ClientApp (Vue Application)
```

### Database
- **In-Memory Database**
- **User**: UserId (PK & FK), Username, PasswordHash, Email, CreatedAt
- **SavedResult**: Id, UserId (FK), ToolType, Input, Output, CreatedAt
- **ToolType**: Enum (JsonFormatter, JsonStringify, MarkdownPreview, DiffChecker)

---

## Step 1: Project Foundation + Authentication

### Backend

#### Models
1. **User.cs** - `UserId` (int, PK), Username, PasswordHash, Email, CreatedAt
2. **ToolType.cs** - Enum: JsonFormatter, JsonStringify, MarkdownPreview, DiffChecker
3. **SavedResult.cs** - Id, UserId (FK), ToolType, Input, Output, CreatedAt

#### Interfaces
1. **IUserRepository**
   - `Task<User?> GetById(int userId)`
   - `Task<User?> GetByUsername(string username)`
   - `Task<User> Create(User user)`
   - `Task<User> Update(User user)`

2. **ISavedResultRepository**
   - `Task<SavedResult> Create(SavedResult result)`
   - `Task<SavedResult?> GetById(int id)`
   - `Task<IEnumerable<SavedResult>> GetByUserId(int userId)`
   - `Task<SavedResult> Update(SavedResult result)`
   - `Task Delete(int id)`

#### Repositories (In-Memory)
1. **UserRepository** - Implements IUserRepository with Dictionary<int, User>
2. **SavedResultRepository** - Implements ISavedResultRepository with Dictionary<int, SavedResult>

#### Services
1. **AuthService**
   - `Task<(User user, string? error)> Register(string username, string email, string password)`
   - `Task<(User? user, string? error)> Login(string username, string password)`
   - Password hashing using BCrypt

#### Controllers
1. **AuthController**
   - POST `/api/auth/register` - Register new user
   - POST `/api/auth/login` - Login user
   - POST `/api/auth/logout` - Logout user

### Frontend

#### Setup
- Vue Router for navigation
- Pinia for state management (auth state)
- Axios for API calls
- TailwindCSS for styling

#### Full Screen Responsive Design
- Remove default body margins
- Use full viewport height with `min-h-screen`
- Responsive Navigation: Hamburger menu (mobile) / Horizontal menu (desktop)
- Responsive Tool Views: Full width, proper padding, grid/flex layouts

#### Pages
1. **LoginView.vue** - Username/password form
2. **RegisterView.vue** - Username/email/password form

#### Features
- Form validation with error messages
- Store user session in localStorage
- Auth state persistence
- Protected routes for saving results

---

## Steps 2-5: Tool Views (Frontend Only)

All tool logic is handled in the frontend using JavaScript/Vue.

### Step 2: JSON Formatter Tool (Frontend)
- JSON parsing and formatting using `JSON.parse()` and `JSON.stringify()`
- Line-by-line validation with error messages
- Line numbers with alternating colors (odd/even)
- Copy buttons (icon) for input and output
- Example placeholder
- Responsive design

### Step 3: JSON Stringify Tool (Frontend)
- Text to JSON string conversion using `JSON.stringify()`
- Line numbers with alternating colors (odd/even)
- Copy buttons (icon) for input and output
- Example placeholder
- Responsive design

### Step 4: Markdown Preview Tool (Frontend)
- Real-time markdown rendering using regex
- Supports: headings (h1-h6), bold, italic, code, lists, links, blockquotes
- Split pane: Editor + Preview
- Line numbers with alternating colors (odd/even)
- Copy button (icon) for input
- Example placeholder
- Responsive design

### Step 5: Diff Checker Tool (Frontend)
- Line-by-line text comparison
- 3-panel layout: Original | Modified | Result (always visible on desktop)
- Git-like line coloring: red for removed (-), green for added (+)
- Line numbers with alternating colors (odd/even)
- Copy buttons (icon) for each panel
- Accept Left/Right functionality
- Mobile-responsive with tabs

### Common UI Features (All Tools)
- Line numbers: Alternating background colors (odd: gray-100, even: gray-200)
- Copy buttons: SVG icon instead of text, larger size (px-3 py-2 text-lg)
- Responsive layouts: Full width, proper padding
- Error messages with line/column info where applicable

---

## Step 6: Saved Results + Integration

### Backend

#### Controllers
1. **SavedResultsController**
   - GET `/api/saved` - Get all saved results for current user
   - GET `/api/saved/{id}` - Get specific saved result
   - POST `/api/saved` - Save new result
   - PUT `/api/saved/{id}` - Update existing saved result
   - DELETE `/api/saved/{id}` - Delete saved result

#### Features
- All saved results CRUD operations
- Update functionality for all history
- User ownership validation

### Frontend

#### Components
1. **SavedResultsView.vue**
   - List all saved results grouped by tool type
   - Expand/view saved item
   - Update button
   - Delete button
   - Connect Save buttons in tool views to API

2. **HomeView.vue** (Enhanced)
   - Display recent saved results (last 5 items)
   - Show tool type, input preview (truncated), timestamp
   - Click to navigate to saved result
   - "Recent Activity" section (authenticated users only)

#### Features
- View saved results per tool type
- Update existing saved items
- Delete saved items
- Empty state handling
- Recent history on home page

---

## API Endpoints Summary

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |

### Saved Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/saved | Get user's saved results |
| GET | /api/saved/{id} | Get specific saved result |
| POST | /api/saved | Save new result |
| PUT | /api/saved/{id} | Update saved result |
| DELETE | /api/saved/{id} | Delete saved result |

---

## Validation & Error Messages

All tools will include:

1. **Empty Input** - "Input cannot be empty"
2. **Invalid JSON** - "Invalid JSON: {error details with line/column}"
3. **Authentication Required** - "Please login to save results"
4. **Unauthorized** - "You do not have permission to modify this"
5. **Server Error** - "An error occurred. Please try again"

---

## Running the Application

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- npm

### Commands

From the root folder (`API/`):

```bash
# Install dependencies (one-time)
npm install

# Run both frontend and backend concurrently
npm run dev

# Run only backend (serves built frontend on port 7001)
npm run serve

# Build both frontend and backend
npm run build

# Build only frontend
npm run build:frontend

# Build only backend
npm run build:backend
```

### Ports
| Service | Port | URL |
|---------|------|-----|
| Backend (HTTP) | 7001 | http://localhost:7001 |
| Frontend (Dev) | 5173 | http://localhost:5173 |
| Frontend (Prod) | - | Served by backend at http://localhost:7001 |

---

## File Structure

```
API/
├── package.json              # Root npm scripts
├── API.csproj               # .NET project
├── Program.cs               # Entry point
├── Models/
│   ├── User.cs
│   ├── SavedResult.cs
│   └── ToolType.cs
├── Interfaces/
│   ├── IUserRepository.cs
│   └── ISavedResultRepository.cs
├── Repositories/
│   ├── UserRepository.cs
│   └── SavedResultRepository.cs
├── Services/
│   └── AuthService.cs
├── Controllers/
│   ├── AuthController.cs
│   └── SavedResultsController.cs
└── ClientApp/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── views/
        │   ├── HomeView.vue
        │   ├── LoginView.vue
        │   ├── RegisterView.vue
        │   ├── JsonFormatterView.vue
        │   ├── JsonStringifyView.vue
        │   ├── MarkdownPreviewView.vue
        │   ├── DiffCheckerView.vue
        │   └── SavedResultsView.vue
        ├── stores/
        │   └── auth.ts
        ├── router/
        │   └── index.ts
        ├── services/
        │   └── api.ts
        └── App.vue
```

---

## Implementation Order

1. **Step 1** - Foundation & Auth (Backend + Frontend) ✅
2. **Step 2** - JSON Formatter Tool (Frontend) ✅
3. **Step 3** - JSON Stringify Tool (Frontend) ✅
4. **Step 4** - Markdown Preview Tool (Frontend) ✅
5. **Step 5** - Diff Checker Tool (Frontend) ✅
6. **Step 6** - Saved Results Integration (Backend + Frontend) - In Progress
