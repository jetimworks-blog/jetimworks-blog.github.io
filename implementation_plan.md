# Implementation Plan

[Overview]

Build a React-based frontend application for the email-user-backend that enables user authentication (register, login, logout) with JWT tokens and a feature-rich email composition experience with two modes: "YOLO" quick send and detailed email crafting.

The application will use Vite + React with TailwindCSS for styling, featuring a playful but professional design with serif typography. The frontend will communicate with the Go backend running on `http://localhost:8080` (configurable via `.env`), implementing secure JWT token storage, refresh mechanisms, and backend-persisted request history.

**Color Palette:** White (#FFFFFF), Blue (#2563EB), Deep Navy (#1E3A5F), Black (#000000)

**Auth Flow:** Auto-redirect to homepage on successful login.

**History Storage:** Request history stored in both localStorage (for offline access) and persisted to backend database for cross-device access.

[Types]

### User Types
```typescript
interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
```

### Email Payload Types
```typescript
// YOLO Mode - Simple quick send
interface YoloEmailPayload {
  to: string;
  subject: string;
  prompt: string;
  process: "email";
}

// Detailed Mode - Meticulous email composition
interface DetailedEmailPayload {
  to: string;
  subject: string;
  prompt: string;
  process: "gen-email";
  // Detailed options (mapped to prompt enhancement)
  tone?: "professional" | "friendly" | "casual" | "formal" | "persuasive";
  fontFeel?: "serif" | "sans-serif" | "modern" | "classic" | "playful";
  wordCount?: { min: number; max: number };
  styling?: "minimal" | "bold" | "elegant" | "corporate";
  includeCallToAction?: boolean;
  callToActionText?: string;
  keyMessage?: string;
}

// Backend Execute Response
interface ExecuteResponse {
  success: boolean;
  output: string;
  error: string;
}
```

### State Types
```typescript
interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
}

interface HistoryItem {
  id: string;
  process: string;
  to: string;
  subject: string;
  prompt: string;
  output: string;
  success: boolean;
  created_at: string;
}
```

[Files]

### New Files to Create

**Configuration & Setup:**
- `src/.env` - Environment variables (VITE_API_BASE_URL=http://localhost:8080)
- `tailwind.config.js` - TailwindCSS configuration with serif fonts
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Tailwind imports + custom styles

**Core Application:**
- `src/lib/api.js` - API client with JWT handling
- `src/lib/auth.js` - Auth utilities (token storage, refresh, guards)
- `src/context/AuthContext.jsx` - Authentication state management
- `src/hooks/useAuth.js` - Auth hook for components
- `src/hooks/useApi.js` - API hook with auth headers

**Components:**
- `src/components/ui/Button.jsx` - Reusable styled button with variants
- `src/components/ui/Input.jsx` - Styled input component
- `src/components/ui/LoadingSpinner.jsx` - Animated loading indicator
- `src/components/ui/Card.jsx` - Card container component
- `src/components/ui/Toast.jsx` - Toast notification system
- `src/components/layout/Navbar.jsx` - Navigation bar with auth state
- `src/components/layout/Footer.jsx` - Footer component
- `src/components/layout/Layout.jsx` - Main layout wrapper

**Page Components:**
- `src/pages/LoginPage.jsx` - User login form
- `src/pages/RegisterPage.jsx` - User registration form
- `src/pages/HomePage.jsx` - Post-login homepage with email forms
- `src/pages/HistoryPage.jsx` - Request history view
- `src/pages/YoloEmailForm.jsx` - Quick email send form
- `src/pages/DetailedEmailForm.jsx` - Meticulous email form
- `src/pages/EmailResult.jsx` - Result display with actions
- `src/pages/SettingsPage.jsx` - Resend API key configuration

**Loading Experience:**
- `src/components/ui/MagicLoader.jsx` - Interactive loading animation with typing effect
- `src/components/ui/ProgressSteps.jsx` - Step-by-step progress indicator

### Existing Files to Modify
- `package.json` - Add dependencies (react-router-dom, tailwindcss, axios)
- `vite.config.js` - Add environment variable support
- `src/main.jsx` - Add Router and AuthProvider
- `src/App.jsx` - Setup routes with auth guards
- `index.html` - Add Google Fonts (Playfair Display, Merriweather)

### Files to Delete
- `src/App.css` - Replaced by TailwindCSS

[Functions]

### API Client Functions
```javascript
// src/lib/api.js
- apiClient() - Axios instance with interceptors for JWT
- authAPI - Auth endpoint methods (login, register, logout, me, refresh)
- configAPI - Config endpoint methods (get, set)
- emailAPI - Email execution methods (execute, getProcesses)
```

### Auth Utilities
```javascript
// src/lib/auth.js
- getStoredToken() - Get access token from localStorage
- setStoredToken(token) - Store access token
- clearStoredToken() - Remove tokens on logout
- getStoredUser() - Get stored user data
- setStoredUser(user) - Store user data
- isTokenExpired(token) - Check JWT expiry
- getProtectedHeaders() - Get headers with Authorization
```

### Context Functions
```javascript
// src/context/AuthContext.jsx
- AuthProvider({ children }) - Context provider component
- useAuth() - Hook for auth state access
- login(email, password) - Authenticate and store tokens
- register(email, password) - Create account and store tokens
- logout() - Clear auth state and blacklist token
- refreshToken() - Get new tokens using refresh token
- fetchUser() - Fetch current user from /auth/me
```

### Form Validation Functions
```javascript
// src/lib/validation.js
- validateEmail(email) - Email format validation
- validatePassword(password) - Password strength check (8+ chars)
- validateRequired(value, fieldName) - Required field check
```

[Classes]

### UI Components
```jsx
// Button - Styled button with variants
Props: { variant: "primary" | "secondary" | "ghost", size: "sm" | "md" | "lg", loading: boolean, children }
States: default, hover, active, disabled, loading

// Input - Form input with label
Props: { label, type, placeholder, error, required, ...inputProps }
States: default, focus, error, disabled

// Card - Container component
Props: { className, children, title }
Variants: default, elevated, bordered

// MagicLoader - Interactive loading experience
Props: { message, steps: string[] }
Features: Animated text typing, step progress, cancel option

// Toast - Notification component
Props: { type: "success" | "error" | "info", message, duration }
Features: Auto-dismiss, manual close
```

### Page Components
```jsx
// LoginPage
- Email input field
- Password input field  
- "Remember me" checkbox
- Login button (loading state)
- "Don't have an account?" link to register
- Error message display

// RegisterPage
- Email input field
- Password input field (with strength indicator)
- Confirm password field
- Register button (loading state)
- "Already have an account?" link to login
- Success redirect to login

// HomePage
- Welcome message with user email
- Two-column layout for email options
- "YOLO Quick Send" card (large, prominent)
- "Craft with Care" detailed form card
- API key setup banner (if not configured)

// YoloEmailForm
- Recipient email input
- Subject line input
- Prompt textarea
- Send button with loading state
- Character count for prompt

// DetailedEmailForm
Multi-step wizard:
Step 1: Recipient & Subject
Step 2: Tone & Style preferences
Step 3: Content preferences (word count, key message)
Step 4: CTA preferences (optional)
Step 5: Review & Send

// HistoryPage
- List of past requests with filters
- Request card showing: date, recipient, subject, status
- Expand to view full prompt and output
- Re-send functionality
- Delete from history

// EmailResult
- Success/error state display
- Generated email preview
- Copy to clipboard button
- Send another button
- Back to home link

// SettingsPage
- Resend API key input (masked)
- Save button
- Key status indicator
- Instructions for obtaining API key
```

[Dependencies]

### New NPM Dependencies
```json
{
  "react-router-dom": "^7.0.0",     // Routing
  "axios": "^1.7.0",               // HTTP client
  "tailwindcss": "^4.0.0",          // Styling
  "@tailwindcss/vite": "^4.0.0",    // Vite Tailwind plugin
  "framer-motion": "^11.0.0",       // Animations
  "sonner": "^1.4.0",               // Toast notifications
  "clsx": "^2.1.0"                  // Conditional classes
}
```

### Configuration Updates
- Add VITE_API_BASE_URL to vite.config.js env handling
- Configure Tailwind with Playfair Display + Merriweather fonts
- Set up PostCSS for Tailwind processing

[Testing]

### Test Strategy
Manual testing plan covering:

**Authentication Flow:**
1. Register new user → redirect to login
2. Login with valid credentials → redirect to homepage
3. Login with invalid credentials → show error message
4. Logout → clear tokens, redirect to login
5. Protected route access without auth → redirect to login
6. Token refresh on page reload

**Email YOLO Flow:**
1. Fill recipient, subject, prompt
2. Submit → show MagicLoader
3. Success → show result with copy option
4. Error → show error toast with retry

**Email Detailed Flow:**
1. Complete multi-step wizard
2. Review summary before submit
3. Submit → show MagicLoader with steps
4. Success → show result
5. Error handling at each step

**History Flow:**
1. View request history
2. Filter by date/status
3. Expand request details
4. Re-send previous request

**Settings Flow:**
1. Set Resend API key
2. Verify key status updates
3. Show masked key on return

### Visual Validation
- Responsive design (mobile/tablet/desktop)
- Typography hierarchy with serif fonts
- Loading animation smoothness
- Error/success state consistency
- Button hover/active states
- Form validation feedback

[Implementation Order]

1. **Project Setup & Configuration**
   - Add npm dependencies
   - Configure TailwindCSS with serif fonts
   - Set up environment variables
   - Update index.html with Google Fonts

2. **Auth Infrastructure**
   - Create API client with interceptors
   - Build auth utilities and storage
   - Implement AuthContext provider
   - Create auth hooks

3. **UI Component Library**
   - Build Button, Input, Card components
   - Create MagicLoader with animations
   - Implement Toast notification system
   - Build layout components (Navbar, Footer, Layout)

4. **Authentication Pages**
   - Create LoginPage with form validation
   - Create RegisterPage with password strength
   - Set up routing with auth guards
   - Implement protected route component

5. **Homepage & Email Forms**
   - Build HomePage with email option cards
   - Create YoloEmailForm with validation
   - Build DetailedEmailForm multi-step wizard
   - Implement prompt enhancement logic

6. **Email Execution & Results**
   - Connect forms to backend API
   - Create MagicLoader with step progress
   - Build EmailResult display
   - Add copy to clipboard functionality

7. **History & Settings**
   - Implement HistoryPage with list view
   - Add request filtering
   - Create SettingsPage for API key
   - Build status indicators

8. **Polish & Animations**
   - Add Framer Motion transitions
   - Implement loading animations
   - Polish responsive design
   - Add micro-interactions

9. **Testing & Validation**
   - Test complete user flows
   - Verify error handling
   - Check responsive breakpoints
   - Validate form submissions
