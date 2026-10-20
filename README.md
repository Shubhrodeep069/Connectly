# Connectly — Social Media Feed Application

Connectly is a full-stack social media feed application built using the MERN stack. Users can create accounts, share text and image posts, interact with posts, and connect through comments and likes.

## Features

- **User Authentication:** Register and log in securely using password hashing and JWT authentication.
- **Create Posts:** Share text-only posts, image-only posts, or text with an image.
- **Like & Unlike:** Interact with posts using likes.
- **Comments:** Add comments to posts.
- **Delete Posts:** Users can delete their own posts.
- **Live Feed:** View posts with author information and timestamps.
- **Responsive UI:** A clean interface designed for a smooth user experience.
- **Database Integration:** Store users and posts in MongoDB.

## Tech Stack

**Frontend**
- React
- Vite
- Axios
- React Router
- Lucide React
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## Project Structure

```text
skillnexis-week4-connectly/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas account or another MongoDB connection
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd skillnexis-week4-connectly
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository URL.

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
```

Replace the placeholder values with your own credentials. Never commit your actual `.env` file.

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`, assuming port 5000 is available.

### 3. Configure the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/posts` | Fetch the post feed |
| POST | `/api/posts` | Create a post (authentication required) |
| PUT | `/api/posts/:id/like` | Like or unlike a post |
| POST | `/api/posts/:id/comments` | Add a comment |
| DELETE | `/api/posts/:id` | Delete your own post |

## Security Notes

- Passwords are hashed using bcryptjs.
- Protected routes use JWT authentication.
- Database credentials and secrets belong in environment variables.
- Do not upload `.env` files or expose database credentials publicly.

## Future Improvements

- Image uploads using a file-storage service
- User profiles and profile-picture updates
- Follow and unfollow users
- Notifications and real-time updates
- Pagination and improved feed filtering

## Author

Developed as a full-stack web development project for the SkillNexis internship.
