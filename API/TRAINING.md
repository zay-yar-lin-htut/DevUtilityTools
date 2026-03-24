# Developer Utilities Platform – Training Challenge

## Overview

You will build a **developer utilities web application** that provides commonly used developer tools for working with JSON, Markdown, and text.

The system must follow a **full-stack architecture using ASP.NET MVC with a repository pattern** and include a **Vue frontend application**.

Users should be able to use the tools freely, but **saving results requires login or account creation**.

---

# Example Tools

Your application should implement features similar to the following tools:

* https://jsonformatter.curiousconcept.com/
* https://toolsaday.com/text-tools/json-stringify
* https://markdownlivepreview.com/
* https://www.diffchecker.com/

You do **not need to copy the UI**, but the functionality should be similar.

---

# Tech Stack

## Backend

* **ASP.NET 10**
* **MVC Architecture**
* **Repository Pattern**
* **In-Memory Database**

## Frontend

* **Vue**
* **TailwindCSS**

---

# Project Architecture

The project must follow this structure:

```
ASP.NET App
│
├── API
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   └── Models
    │
    └── ClientApp
        ├── Vue Application
        ├── TailwindCSS
        └── Tool UI
```

Explanation:

**ASP.NET App**

Main backend application.

**API**

Handles:

* Authentication
* Tool processing
* Saving results
* Data management

Must implement **Repository Pattern** for data access.

**ClientApp**

Vue frontend responsible for:

* Tool interfaces
* API communication
* Rendering results
* User interaction

---

# Authentication

Users must be able to:

* Register
* Login
* Logout

Rules:

* Tools can be used **without login**
* **Saving results requires login**

Example saved items:

* Saved JSON formatting results
* Saved Markdown documents
* Saved diff results
* Saved merged file

For this challenge, use an **In-Memory database**.

---

# Required Tools

## 1. JSON Formatter & Validator

Features:

* Paste JSON
* Format JSON
* Validate JSON
* Display errors when invalid

---

## 2. JSON Stringify Tool

Features:

* Convert plain text into JSON string format
* Escape special characters
* Support multi-line input

Example:

Input

```
Hello
World
```

Output

```
"Hello\nWorld"
```

---

## 3. Markdown Live Preview

Features:

* Markdown editor
* Live preview rendering
* Update preview while typing

Example:

```
# Title
**Bold**
```

---

## 4. Text Diff Checker

Features:

* Compare two text blocks
* Highlight added text
* Highlight removed text
* Display clear differences
* Should be able to merge

---

# Saving Results

Users should be able to **save outputs from the tools**.

Examples:

* Saved formatted JSON
* Saved Markdown documents
* Saved diff comparisons
* Saved merged results with merged message

Rules:

* Saving requires authentication
* Data stored in **In-Memory database**

---

# Evaluation Criteria

Your submission will be evaluated based on:

1. Architecture design
2. MVC implementation
3. Repository pattern usage
4. Frontend usability
5. API design

---

