# Backend Changes Summary (Recent Commits)

The following backend changes need to be implemented in the frontend:

## 1. Config Endpoint Updates

### PUT /config Payload Changes
The `resend_api_key` field is now **optional** (previously required):
```json
{
  "resend_api_key": "re_xxxxx",  // Optional - can be empty or omitted
  "from_email": "sender@example.com",  // NEW - optional sender email
  "from_name": "Sender Name"  // NEW - optional sender name
}
```

### GET /config Response Changes
Response now includes sender info:
```json
{
  "id": "uuid",
  "has_resend_key": true,
  "from_email": "sender@example.com",  // NEW
  "from_name": "Sender Name",  // NEW
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### DELETE /config (NEW ENDPOINT)
- **Method**: DELETE
- **Path**: `/config`
- **Auth**: Required (Bearer token)
- **Response**: Returns error with message `"config_deleted"`

## 2. Account Deletion

### DELETE /auth/account (NEW ENDPOINT)
- **Method**: DELETE
- **Path**: `/auth/account`
- **Auth**: Required (Bearer token)
- **Request Body**:
```json
{
  "password": "user's current password"
}
```
- **Success Response**: Error with message `"account_deleted"`

## 3. Email History Endpoint

### GET /email-history (NEW ENDPOINT)
- **Method**: GET
- **Path**: `/email-history`
- **Auth**: Required (Bearer token)
- **Query Parameters**:
  - `limit` (optional, default: 20, max: 100)
  - `offset` (optional, default: 0)
- **Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "process": "email",  // email, chat, gen, gen-email
      "to": "recipient@example.com",
      "subject": "Email Subject",
      "prompt": "Prompt used for generation",
      "success": true,
      "error_message": null,  // only present on failures
      "duration_ms": 1234,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### Privacy Note
Email history does **NOT** store actual email content (HTML/text) - only metadata for privacy.

## 4. App Execute Fallback Logic

When executing processes via `POST /app/execute`, the backend now applies fallback logic:

- **from_email**: 
  - Uses payload `from_email` if provided
  - Falls back to config `from_email` if set
  - Falls back to user's registered email
  
- **from_name**:
  - Uses payload `from_name` if provided
  - Falls back to config `from_name` if set
  - Falls back to "Anonymous"

This means the frontend doesn't need to explicitly pass these values if defaults are acceptable.

## Required Frontend Changes

1. **Config Form**:
   - Make `resend_api_key` optional
   - Add `from_email` and `from_name` input fields

2. **Account Settings**:
   - Add "Delete Account" button with password confirmation modal
   - Send DELETE to `/auth/account` with `{ "password": "..." }`

3. **Email History View**:
   - Create new page/section for viewing email history
   - Implement pagination with limit/offset query params
   - Display execution metadata (no content)

4. **Config Response Handling**:
   - Update to handle `has_resend_key`, `from_email`, `from_name` fields