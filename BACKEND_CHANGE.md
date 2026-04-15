# Backend Change Summary

## Commit: fcb1c63746d727f334e587cf0d2767cf2d6b2bfb
**feat: split execute endpoint into preview and confirm for two-step email workflow**

## Uncommitted Changes (This Session)

### Feature: Default Resend API Key Fallback

When a user has no Resend API key configured, the backend now falls back to a default key from environment config.

**Files changed:**
- `internal/config/config.go` - Added `DefaultResendAPIKey` field
- `internal/rest/app_handler.go` - Updated to use fallback key

**Behavior change:**
- Previously: Users without a ResendAPIKey in their config would get `missing_resend_api_key` error
- Now: Users without a ResendAPIKey in their config will use the default `RESEND_API_KEY` from .env

**No API/Payload changes** - The endpoints, request/response formats remain the same.

**Backend requires:** `.env` must have `RESEND_API_KEY=your_key` set for the fallback to work.