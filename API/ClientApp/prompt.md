# Technical Specification: Advanced JSON Formatter & Multi-Error Validator

## 1. Overview
The goal is to upgrade the current JSON Formatter tool. Instead of displaying a single standard error message, the tool must provide a synchronized "Error View" in the Output component that highlights syntax issues directly within the code and lists multiple custom error messages in English.

## 2. Output Component Logic (Dynamic Rendering)
The Output component must operate in two distinct modes based on the validation state:

### Mode A: Success (Formatted View)
- **Trigger:** Input is 100% valid JSON.
- **Behavior:** - Display the JSON with standard indentation (e.g., 2 spaces).
    - Apply syntax highlighting (different colors for keys, strings, numbers, etc.).
- **Header:** Clear all error banners and status messages.

### Mode B: Error (Debug View)
- **Trigger:** Input contains one or more syntax errors.
- **Behavior:**
    - Display the **Original Raw Input** in the Output box.
    - **Visual Highlighting:** Wrap every identified error segment in a `<span class="json-error-mark">`.
    - **Styling:** Use a red background or a red wavy underline for these spans to make them pop.

---

## 3. Validation & Multi-Error Engine
Standard `JSON.parse()` is insufficient as it stops at the first error. 

- **Requirement:** Implement a "Linter" approach (using a library like `jsonlint` or a custom recursive descent parser) to identify **all** syntax errors in a single pass.
- **Error Tracking:** Capture the `line number`, `column`, and `type of error` for every issue found.

---

## 4. Custom Error Mapping (English Language)
Replace technical engine errors with user-friendly descriptions.

| Error Type | Custom English Message |
| :--- | :--- |
| **Missing Comma** | "A comma (,) is missing between data entries." |
| **Missing Quotes** | "Double quotes (\") are missing around the Key or String value." |
| **Unclosed Bracket** | "A closing bracket ( } or ] ) is missing for the JSON structure." |
| **Trailing Comma** | "An extra comma (,) was found at the end of the item list." |
| **Invalid Value** | "The value provided does not match a valid JSON format." |

---

## 5. CSS Requirements
```css
/* Style for the error highlight in the Output Box */
.json-error-mark {
    background-color: rgba(255, 77, 79, 0.2);
    border-bottom: 2px wavy #ff4d4f;
    cursor: help;
}

/* Style for the Error List Area */
.error-list-container {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff1f0;
    border: 1px solid #ffccc7;
    border-radius: 4px;
}

.error-item {
    color: #cf1322;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}