# Implementation Plan: Delete Config & Delete Account Features

## [Overview]

Add frontend support for deleting user configuration (Resend API key) and deleting user accounts. The backend already implements `DELETE /config` and `DELETE /auth/account` endpoints. This implementation adds the corresponding API methods and UI components.

## [Types]

No new types needed - using existing types from backend responses.

## [Files]

### New files to be created:
None

### Existing files to be modified:
1. `src/lib/api.js`
   - Add `delete()` method to configAPI
   - Add `deleteAccount(password)` method to authAPI

2. `src/pages/SettingsPage.jsx`
   - Add delete API key functionality with confirmation
   - Add delete account functionality with password confirmation modal

### Files to be deleted:
None

## [Functions]

### Modified functions:

1. **configAPI** in `src/lib/api.js`
   - Add: `delete: () => apiClient.delete('/config')`

2. **authAPI** in `src/lib/api.js`
   - Add: `deleteAccount: (password) => apiClient.delete('/auth/account', { data: { password } })`

3. **SettingsPage** in `src/pages/SettingsPage.jsx`
   - Add state for modals: `showDeleteConfigModal`, `showDeleteAccountModal`
   - Add `handleDeleteConfig` function
   - Add `handleDeleteAccount` function
   - Add UI for delete buttons and confirmation modals

## [Classes]

None

## [Dependencies]

None - all dependencies already installed.

## [Testing]

- Test deleting API key from settings page
- Test deleting account with correct password
- Test account deletion fails with wrong password
- Verify user is redirected after account deletion

## [Implementation Order]

1. Update `src/lib/api.js` with new API methods
2. Update `src/pages/SettingsPage.jsx` with delete config UI
3. Update `src/pages/SettingsPage.jsx` with delete account UI and modal
4. Build and test
