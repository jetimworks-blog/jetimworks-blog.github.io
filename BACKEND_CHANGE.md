# Backend Change: Prompts Now Saved in Email History

## Summary
Fixed a bug where prompts were not being saved in email history when using the preview endpoint.

## Change Details

### File: `internal/rest/app_handler.go`

**Before (ExecutePreview handler - history creation):**
```go
history := &domain.EmailHistory{
    UserID:        execCtx.UserID,
    Process:       execCtx.Payload.Process,
    GeneratedHtml: output,
    Duration:      duration,
}
```

**After (ExecutePreview handler - history creation):**
```go
history := &domain.EmailHistory{
    UserID:        execCtx.UserID,
    Process:       execCtx.Payload.Process,
    Prompt:        execCtx.Payload.Prompt,  // NEW: Now saves the prompt
    GeneratedHtml: output,
    Duration:      duration,
}
```

## Endpoint Affected
- `POST /v1/execute/preview` (gen process)

## Frontend Impact
When using the preview endpoint, the `prompt` field will now be included in email history records. No frontend changes required - the backend fix ensures prompts are persisted for the `/v1/email-history` GET endpoint responses.

## Related Context
The email history response includes:
- `id` - UUID
- `process` - "gen", "email", "chat", "gen-email"
- `prompt` - The AI prompt used (now properly saved)
- `generated_html` - The HTML output from gen process
- `to` - Recipient email
- `subject` - Email subject
- `success` - Boolean
- `error_message` - Error if failed
- `duration_ms` - Execution time
- `created_at` - Timestamp
