# Backend Change Summary

## Commit: fcb1c63
**Feature:** Split execute endpoint into preview and confirm for two-step email workflow

## Endpoint Changes

### New Endpoints

#### 1. `POST /app/execute` (Preview)
- **Purpose:** Generate HTML email preview without sending
- **Process used:** `gen`
- **Request payload:**
  ```json
  {
    "process": "gen",
    "prompt": "string (required)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "output": "string (generated HTML)",
    "error": ""
  }
  ```
- **Validation:** 
  - `prompt` is required
  - `html` and `html_file` are NOT allowed for preview

#### 2. `POST /app/execute/confirm` (Confirm)
- **Purpose:** Send email with pre-generated HTML
- **Process used:** `email`
- **Request payload:**
  ```json
  {
    "process": "email",
    "to": "string (required)",
    "subject": "string (required)",
    "html": "string (required - pre-generated HTML)",
    "from_email": "string (optional)",
    "from_name": "string (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "output": "string",
    "error": ""
  }
  ```
- **Validation:**
  - `to`, `subject`, and `html` are required
  - `prompt` is NOT allowed (use pre-generated HTML)

### Legacy Endpoint
- `POST /app/execute` with other processes (`email`, `chat`, `gen-email`) still works as before

## Data Model Changes

### EmailHistory
- **New field:** `generated_html` - Stores the generated HTML content

### EmailHistoryResponse
- **New field:** `generated_html` - Included in API responses

## Error Messages
- `html_not_allowed`: "HTML content should not be provided for preview. Use the prompt to generate HTML."
- `prompt_not_allowed`: "Prompt should not be provided when sending with pre-generated HTML."

## Frontend Changes Required
1. Update email workflow to use two-step approach:
   - Step 1: Call `POST /app/execute` with `process: "gen"` and `prompt` to get HTML preview
   - Step 2: Call `POST /app/execute/confirm` with `process: "email"` and `html` (from step 1) to send
2. Display generated HTML in preview before sending
3. Store `generated_html` in history responses for potential re-send
