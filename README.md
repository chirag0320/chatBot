# AI Customer Support Application

This is a full-stack AI-powered customer support application. It includes a React-based frontend and an Express-based backend, with MongoDB as the database. Users can chat with an AI assistant and authenticate via login/signup.

---

## Features

### Frontend
- Built with **React**, **TypeScript**, and **Vite**.
- User authentication (login and signup).
- Chat interface with AI assistant.
- Infinite scroll for chat history.
- Responsive design with clean UI and styled components.

### Backend
- Built with **Express** and **TypeScript**.
- MongoDB for storing user and chat data.
- JWT-based authentication.
- Rate limiting for API endpoints.
- Integration with OpenRouter AI for generating AI responses.

---

## Project Structure

### Frontend (`client/`)
- **Components**: Reusable UI components such as `InputField`, `Message`, and `PrivateRoute`.
- **Pages**: 
  - `Auth`: Login/signup page.
  - `Chat`: Chat interface with AI assistant.
- **Hooks**: Custom hooks like `useAuthForm` and `useChat` for managing state and logic.
- **Context**: `AuthContext` for authentication state management.
- **Services**: API service for interacting with backend endpoints.

### Backend (`server/`)
- **Routes**:
  - `authRoutes`: Handles user authentication (signup and login).
  - `chatRoutes`: Handles chat operations (sending messages, fetching history).
- **Models**:
  - `User`: Schema for user data.
  - `ChatMessage`: Schema for chat messages.
- **Services**: `aiService` for interacting with OpenRouter AI.
- **Middlewares**:
  - `auth`: Protects routes by verifying JWT tokens.
  - `rateLimiter`: Prevents abuse by limiting API requests.

---

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Docker (optional, for running with Docker Compose)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
````

2. Install dependencies for frontend and backend:

   **Backend**

   ```bash
   cd server
   npm install
   ```

   **Frontend**

   ```bash
   cd client
   npm install
   ```
3. Create a `.env` file in both `server` and `client` directories with your environment variables:

   ```
   # Example for server/.env
   MONGO_URI=<your-mongo-uri>
   JWT_SECRET=<your-jwt-secret>
   OPENROUTER_API_KEY=<your-api-key>

   # Example for client/.env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```
5. Start the frontend server:

   ```bash
   cd client
   npm run dev
   ```
6. Open your browser at `http://localhost:5173` (or the port shown in the terminal) to access the app.

---

## Usage

* **Sign up** with a username, email, and password.
* **Login** with your credentials.
* Chat with the AI assistant using the chat interface.
* Infinite scroll loads older messages.
* AI typing indicator shows while AI is generating a response.

---

## Folder Structure

```
root
├─ client/          # React frontend
│  ├─ components/   # Reusable UI components
│  ├─ pages/        # Auth & Chat pages
│  ├─ hooks/        # Custom hooks
│  ├─ context/      # React context
│  └─ services/     # API services
├─ server/          # Express backend
│  ├─ routes/       # API routes
│  ├─ models/       # Mongoose models
│  ├─ services/     # AI integration
│  └─ middlewares/  # Auth & rate limiting
├─ README.md
└─ package.json
```
