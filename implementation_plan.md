# Implementation Plan

[Overview]
Add sender information fields (`from_email` and `from_name`) to the Settings page only. Users can customize their default sender details for outgoing emails in their configuration. The email forms will use the config values as defaults without override options.

[Types]
No new types required. Adding optional fields to existing data structures:
- Config payload: `{ resend_api_key, from_email?, from_name? }`
- Config response: includes `from_email`, `from_name`

[Files]
- **Modified**: `src/pages/SettingsPage.jsx` - Add sender configuration UI with `from_email` and `from_name` inputs
- **No changes**: `src/pages/YoloEmailForm.jsx` - No override fields needed
- **No changes**: `src/pages/DetailedEmailForm.jsx` - No override fields needed
- **Modified**: `src/lib/validation.js` - Add `validateSenderEmail()` helper function

[Functions]
- **Modified**: `loadConfig()` in SettingsPage - Now loads `from_email` and `from_name` from API response
- **Modified**: `handleSave()` in SettingsPage - Sends `from_email` and `from_name` in config payload
- **New**: `validateSenderEmail()` in validation.js - Validates optional email field

[UI Changes - SettingsPage]
- Add new section below API key: "Sender Information" with icon
- Add helper text explaining defaults: "If not set, emails will use your account email and 'Anonymous' as the sender name"
- Two new optional input fields: "Sender Email" and "Sender Name"
- Fields display existing values from config API
- Fields save to config API when user clicks Save

[Classes]
No class changes required.

[Dependencies]
No new dependencies. Using existing components (Input, Card, etc.)

[Testing]
- Verify SettingsPage loads and displays existing sender info
- Verify SettingsPage saves sender info to backend
- Verify helper text is visible explaining defaults
- Verify email forms work without sender override fields (backward compatible)

[Implementation Order]
1. Add `validateSenderEmail()` to validation.js
2. Update SettingsPage.jsx with sender configuration UI (from_email, from_name inputs below API key)
