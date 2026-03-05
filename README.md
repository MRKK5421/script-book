# ScriptBook – Your Digital Script Writing Book

A production-ready digital script writing application with a realistic book interface.

## Features

- 📖 Realistic book-like interface with page turning animation
- ✍️ Rich text editor with script formatting
- 🔐 JWT Authentication
- 📚 Multiple books with chapters and pages
- 🌙 Dark mode
- 📥 Export to PDF
- 🐳 Dockerized deployment

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, TipTap
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose


### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ (for backend)
- npm or yarn package manager

### Development Setup

1. **Start the Database:**
   ```bash
   docker-compose up -d
   ```
   This will start PostgreSQL on port 5432

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend will run on http://localhost:3001

3. **Start the Frontend:**
   ```bash
   cd scriptbook
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173

### Database Schema

The application uses the following main tables:
- `users` - User authentication and profiles
- `books` - Book metadata and settings
- `chapters` - Chapter organization within books
- `pages` - Individual script pages with content
- `user_settings` - User preferences and settings

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

#### Books
- `GET /api/books` - Get all user books
- `POST /api/books` - Create new book
- `GET /api/books/:id` - Get single book with chapters
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete book

#### Chapters
- `GET /api/chapters/book/:bookId` - Get book chapters
- `POST /api/chapters/book/:bookId` - Create new chapter

#### Pages
- `GET /api/pages/chapter/:chapterId` - Get chapter pages
- `POST /api/pages/chapter/:chapterId` - Create new page
- `PUT /api/pages/:pageId` - Update page content
- `DELETE /api/pages/:pageId` - Delete page

#### Users
- `GET /api/users/settings` - Get user preferences
- `PUT /api/users/settings` - Update user preferences

### Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scriptbook
DB_USER=scriptbook_user
DB_PASSWORD=scriptbook_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Production Deployment

For production deployment:

1. Set up PostgreSQL database
2. Configure environment variables
3. Build and deploy backend
4. Build and deploy frontend
5. Configure reverse proxy for API routes

### Technology Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Hot Toast
- Vite

**Backend:**
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- Docker & Docker Compose

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### License

MIT License - feel free to use this project for personal or commercial purposes.

## License

MIT
