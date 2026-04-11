# System Patterns

## Architecture

```
src/
├── components/
│   ├── ui/          # Reusable UI components (Button, Input, Card, etc.)
│   ├── layout/      # Navbar, Footer, Layout wrappers
│   └── auth/        # Auth-specific components (ProtectedRoute)
├── context/         # React Context (AuthContext)
├── hooks/           # Custom hooks (useAuth)
├── lib/             # Utilities (api, auth, validation)
└── pages/           # Page components
```

## API Integration

- **Axios instance**: `src/lib/api.js`
- **Base URL**: `http://localhost:8080`
- **Auth interceptors**: Automatic JWT token injection
- **Refresh token handling**: Automatic token refresh

## Authentication Flow

1. User submits credentials
2. Backend returns access_token + refresh_token
3. Tokens stored in localStorage
4. Axios interceptor adds Authorization header
5. ProtectedRoute checks auth state

## TailwindCSS v4 Setup

- Uses `@tailwindcss/vite` plugin (NOT postcss)
- No tailwind.config.js file
- Custom theme in `src/index.css` using `@theme`
- Fonts: Playfair Display (headings), Merriweather (body)
