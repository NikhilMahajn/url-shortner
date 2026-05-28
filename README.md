# URL Shortener Application

A full-stack URL shortening service that allows users to create, manage, and share shortened URLs. Built with a modern tech stack featuring FastAPI for the backend and Next.js for the frontend.

## 🎯 Features

- **URL Shortening**: Convert long URLs into short, shareable links with 6-character codes
- **User Authentication**: Secure registration and login with token-based authentication
- **URL Management**: Create, view, and manage your shortened URLs
- **Click Tracking**: Track the number of clicks on each shortened URL
- **Custom Short Codes**: Option to create custom short codes for URLs
- **URL Expiration**: Set expiration dates for shortened URLs
- **Recent Links**: View a list of recently created links
- **Responsive UI**: Modern, mobile-friendly interface with Shadcn UI components

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 URL Shortener System                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (url_fe/)              Backend (url_be/)     │
│  ├── Next.js 15                  ├── FastAPI          │
│  ├── TypeScript                  ├── SQLAlchemy ORM   │
│  ├── Shadcn UI                   ├── Alembic (Migrations)
│  └── React 19                    └── PostgreSQL (DB) │
│                                                         │
│  Communication: REST API over HTTP with CORS enabled   │
└─────────────────────────────────────────────────────────┘
```

## 📋 Tech Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Authentication**: JWT Tokens
- **Language**: Python 3.8+

### Frontend
- **Framework**: Next.js 15+ (React 19)
- **Language**: TypeScript
- **UI Library**: Shadcn UI + Radix UI
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form

## 📁 Project Structure

```
Url Shortner/
├── url_be/                           # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py                   # FastAPI application setup
│   │   ├── db/
│   │   │   ├── base.py               # SQLAlchemy base model
│   │   │   └── database.py           # Database connection
│   │   ├── models/
│   │   │   ├── url.py                # URL model
│   │   │   └── user.py               # User model
│   │   ├── schemas/
│   │   │   ├── url.py                # URL request/response schemas
│   │   │   └── user.py               # User request/response schemas
│   │   ├── router/
│   │   │   ├── url.py                # URL endpoints
│   │   │   └── user.py               # User endpoints
│   │   └── services/
│   │       └── url.py                # URL business logic
│   ├── alembic/
│   │   ├── env.py                    # Alembic configuration
│   │   └── versions/                 # Migration scripts
│   ├── alembic.ini                   # Alembic settings
│   └── run.py                        # Backend entry point
│
├── url_fe/                           # Frontend (Next.js)
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── [code]/
│   │       └── page.tsx              # Redirect page
│   ├── components/
│   │   ├── Header.tsx                # Header component
│   │   ├── HeroSection.tsx           # Hero section
│   │   ├── ShortenerForm.tsx         # URL shortener form
│   │   ├── RecentLinks.tsx           # Recent URLs display
│   │   ├── ResultDisplay.tsx         # Result display
│   │   ├── Footer.tsx                # Footer component
│   │   ├── theme-provider.tsx        # Theme provider
│   │   └── ui/                       # Shadcn UI components
│   ├── lib/
│   │   ├── api-service.ts            # API service layer
│   │   ├── api-endpoints.ts          # API endpoint definitions
│   │   ├── api.ts                    # Axios instance
│   │   └── utils.ts                  # Utility functions
│   ├── hooks/
│   │   ├── use-toast.ts              # Toast hook
│   │   └── use-mobile.ts             # Mobile detection hook
│   ├── public/                       # Static assets
│   ├── styles/                       # Global styles
│   └── package.json
│
└── README.md                         # This file
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### URLs Table
```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url VARCHAR NOT NULL,
    short_code VARCHAR UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    expiry_date TIMESTAMP NULL
);
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ with pip
- Node.js 18+ with pnpm
- PostgreSQL 12+ installed and running
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd url_be
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-dotenv python-jose passlib bcrypt
   ```

4. **Configure database**:
   - Create a PostgreSQL database
   - Create `.env` file in `url_be/` directory:
     ```env
     DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener
     SECRET_KEY=your-secret-key-here
     ```

5. **Run database migrations**:
   ```bash
   cd url_be
   alembic upgrade head
   ```

6. **Start backend server**:
   ```bash
   python run.py
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd url_fe
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure API endpoint** (if needed):
   - Update `NEXT_PUBLIC_API_URL` in `.env.local` if backend is on different URL
   - Default: `http://localhost:8000`

4. **Start development server**:
   ```bash
   pnpm dev
   ```
   Frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Register new user |
| `POST` | `/api/users/login` | Login user |

### URL Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/urls/shorten` | Create shortened URL |
| `GET` | `/api/urls/` | Get all user's URLs |
| `GET` | `/api/urls/{id}` | Get specific URL details |
| `DELETE` | `/api/urls/{id}` | Delete shortened URL |

### Redirect

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/{short_code}` | Redirect to original URL |

## 💻 Development

### Running Both Services

**Terminal 1 - Backend**:
```bash
cd url_be
source venv/bin/activate
python run.py
```

**Terminal 2 - Frontend**:
```bash
cd url_fe
pnpm dev
```

### API Testing

- Use the included Bruno collection in `url_be/api_collection/` for API testing
- Or use tools like Postman, Insomnia, or curl

### Database Migrations

Create a new migration:
```bash
cd url_be
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Backend returns JWT access token
3. Token is stored in localStorage
4. Token is sent in `Authorization` header for protected endpoints
5. Backend validates token before processing requests

## 📝 Request/Response Examples

### Register User
```bash
POST http://localhost:8000/api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

### Create Shortened URL
```bash
POST http://localhost:8000/api/urls/shorten
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "original_url": "https://example.com/very/long/url",
  "custom_code": "my-link"  # optional
}
```

### Redirect to Original URL
```bash
GET http://localhost:8000/my-link
```

## 🛠️ Troubleshooting

### Backend Issues

- **Port already in use**: Change port in `run.py` or stop the process using port 8000
- **Database connection error**: Check DATABASE_URL in `.env` and ensure PostgreSQL is running
- **CORS errors**: Check CORS middleware configuration in `app/main.py`

### Frontend Issues

- **API connection error**: Ensure backend is running and `NEXT_PUBLIC_API_URL` is correct
- **Port already in use**: Run `pnpm dev -p 3001` to use different port
- **Node modules issues**: Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install`

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Shadcn UI Components](https://ui.shadcn.com/)

## 📄 License

This project is open source and available for educational purposes.

## ✨ Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Last Updated**: May 28, 2026
