# Backend Changes Summary

## Change 1: Prompts Now Saved in Email History

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

---

## Change 2: Only Email Process Saves to History

The `ExecutePreview` endpoint (gen process) no longer saves to email history. Only `ExecuteConfirm` (email process) saves to history.

This means:
- `POST /v1/execute/preview` (gen process) - No history saved
- `POST /v1/execute/confirm` (email process) - History saved

---

## Change 3: Database Cascade Delete

### File: `domain/user.go`

Added cascade delete relationships:

```go
type User struct {
    // ... existing fields ...
    
    // Cascade delete relationships
    Configs        []Config        `gorm:"foreignKey:UserID;constraint:OnDelete:Cascade"`
    EmailHistories []EmailHistory  `gorm:"foreignKey:UserID;constraint:OnDelete:Cascade"`
}
```

When a user is deleted, all their configs and email histories are automatically deleted by PostgreSQL.

---

## Endpoint Impact

| Endpoint | Process | Saves History |
|----------|---------|---------------|
| POST /v1/execute/preview | gen | ❌ No |
| POST /v1/execute/confirm | email | ✅ Yes |
| POST /v1/execute | email/gen/chat/gen-email | ✅ Yes (for all) |

## Email History Response Fields
- `id` - UUID
- `process` - "email", "chat", "gen", "gen-email"
- `prompt` - The AI prompt used (now properly saved)
- `generated_html` - The HTML output from gen process
- `to` - Recipient email
- `subject` - Email subject
- `success` - Boolean
- `error_message` - Error if failed
- `duration_ms` - Execution time
- `created_at` - Timestamp
