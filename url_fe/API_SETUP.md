# API Configuration Documentation

## Environment Variables

- `NEXT_PUBLIC_API_URL` - The base URL for your backend API
  - Default: `http://localhost:8000`
  - Update this to match your backend server URL

## Usage Examples

### Creating a shortened URL

```typescript
import { urlService } from "@/lib/api-service";

const response = await urlService.createUrl({
  original_url: "https://example.com/very/long/url",
  custom_code: "my-link", // optional
});
```

### Getting user URLs

```typescript
import { urlService } from "@/lib/api-service";

const urls = await urlService.getAllUrls();
```

### User Authentication

```typescript
import { userService } from "@/lib/api-service";

// Register
const registerRes = await userService.register({
  email: "user@example.com",
  password: "password123",
  username: "username",
});

// Login
const loginRes = await userService.login({
  email: "user@example.com",
  password: "password123",
});

// Store token
localStorage.setItem("access_token", loginRes.data.access_token);
```

## Features

- ✅ Axios client with base configuration
- ✅ Request/Response interceptors
- ✅ Automatic Bearer token injection
- ✅ 401 error handling with auto logout
- ✅ Environment-based API URL configuration
- ✅ Type-safe API services
