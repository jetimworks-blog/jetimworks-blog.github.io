# Implementation Plan

[Overview]
Add sender name instruction to the AI-generated prompt in both DetailedEmailForm and YoloEmailForm pages. The instruction will tell the AI to sign emails from the user's configured sender name, extracting a name from the email address if the configured name is "Anonymous".

[Types]
No new type definitions needed.

[Files]
1. **src/pages/DetailedEmailForm.jsx**
   - Modify `buildEnhancedPrompt()` function (lines 186-213) to append sender name instruction
   - Import `useAuth` hook from `../context/AuthContext` and `configAPI` from `../lib/api`
   - Add state for sender name and loading state for config
   - Fetch config on component mount to get `from_name`

2. **src/pages/YoloEmailForm.jsx**
   - Add new state for sender name
   - Import `useAuth` hook and `configAPI`
   - Fetch config on component mount
   - Modify `handleGeneratePreview()` and `handleRegeneratePreview()` to append sender instruction to prompt

[Functions]
1. **Modified: DetailedEmailForm.buildEnhancedPrompt()**
   - File: `src/pages/DetailedEmailForm.jsx`
   - Location: lines 186-213
   - Change: Append sender name instruction at the end of enhancedPrompt before returning

2. **Modified: YoloEmailForm.handleGeneratePreview()**
   - File: `src/pages/YoloEmailForm.jsx`
   - Location: lines 91-125
   - Change: Append sender instruction to `formData.prompt` before sending to API

3. **Modified: YoloEmailForm.handleRegeneratePreview()**
   - File: `src/pages/YoloEmailForm.jsx`
   - Location: lines 127-157
   - Change: Append sender instruction to `formData.prompt` before sending to API

4. **New: getSenderName(user, fromName)**
   - Purpose: Determine the sender name to use in the instruction
   - Logic: If `fromName` is not "Anonymous" and not empty, use it; otherwise extract name from user.email
   - This helper function can be added to both components or as a shared utility

[Classes]
No class modifications needed.

[Dependencies]
No new package dependencies required.

[Testing]
1. Test detailed form: Verify prompt includes sender instruction
2. Test yolo form: Verify prompt includes sender instruction
3. Test with "Anonymous" sender name: Verify name is extracted from email
4. Test with custom sender name: Verify custom name is used

[Implementation Order]
1. Read config to get `from_name` on mount in both forms
2. Create helper function to determine sender name (from config or extract from email)
3. Modify DetailedEmailForm to append instruction to prompt
4. Modify YoloEmailForm to append instruction to prompt in both generate and regenerate functions
