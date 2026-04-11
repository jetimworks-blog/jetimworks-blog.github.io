# Implementation Plan

[Overview]
Fix Yolo email form to send `prompt` instead of `html`, make history cards fully clickable, and implement preloaded form data on resend for both YOLO and Detailed email forms.

[Types]
No new types required.

[Files]

1. **Modify: `src/pages/YoloEmailForm.jsx`**
   - Change payload field from `html` to `prompt` (line 95)
   - Add `useLocation` hook to receive history data
   - Initialize form state from location state if provided

2. **Modify: `src/pages/DetailedEmailForm.jsx`**
   - Add `useLocation` hook to receive history data
   - Initialize form state from location state if provided

3. **Modify: `src/pages/HistoryPage.jsx`**
   - Make entire card clickable via onClick on Card wrapper div
   - Pass history item data via navigate state on resend
   - Keep chevron only as visual indicator, remove separate click handler

[Functions]
No new functions needed. Modifications to existing functions only.

[Classes]
No class changes.

[Dependencies]
No new dependencies.

[Testing]
- Verify YOLO form sends `prompt` field in API payload
- Verify clicking anywhere on history card toggles expansion
- Verify resend preloads data in YOLO form and allows editing
- Verify resend preloads data in Detailed form and allows editing

[Implementation Order]
1. Fix YoloEmailForm payload field (`html` → `prompt`)
2. Update YoloEmailForm to receive and preload history data
3. Read DetailedEmailForm to understand its structure
4. Update DetailedEmailForm to receive and preload history data
5. Update HistoryPage to make card fully clickable and pass data via navigate