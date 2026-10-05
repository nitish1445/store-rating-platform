# Roxiler Store Rating Platform

Full-stack store rating application with role-based access for administrators,
normal users, and store owners.

## Features

- JWT authentication in an HTTP-only cookie
- Normal-user signup and login for all seeded roles
- Role-protected admin, user, and owner routes
- Store browsing and store details
- One rating per user and store
- Create, update, and delete ratings
- Admin management of users, stores, and ratings
- Owner store, rating, and customer views
- PostgreSQL persistence with parameterized SQL queries
- Responsive React UI with Tailwind CSS and toast notifications

## Stack

### Frontend

- React 19
- React Router DOM
- Axios
- Vite
- Tailwind CSS
- React Icons
- React Hot Toast

### Backend

- Node.js and Express
- PostgreSQL with `pg`
- JWT
- bcrypt
- cookie-parser
- CORS
- dotenv
- Morgan

## Project structure

```text
store_rating/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── migrate.js
│   │   └── seed.js
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/authMiddleware.js
│   │   ├── models/
│   │   └── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── Layout/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
└── readme.Md
```

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL database

## Configuration

Create `backend/.env`:

```env
PORT=4500
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
```

Do not commit `.env` or real credentials. The frontend uses the backend URL
below by default, so a frontend `.env` is optional:

```env
VITE_SERVER_URL=http://localhost:4500
```

## Install

From the project root, install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database setup

1. Set `DATABASE_URL` in `backend/.env`.
2. Create the schema:

   ```bash
   cd backend
   npm run migrate
   ```

3. Insert development/demo data:

   ```bash
   npm run seed
   ```

The migration uses `backend/database/schema.sql`. The schema creates `users`,
`stores`, and `ratings`, including the unique `(user_id, store_id)` rating
constraint.

## Run locally

Use two terminals.

### Backend

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:4500`.

### Frontend

```bash
cd frontend
npm run dev
```

The Vite app runs at `http://localhost:5173`.

For a production frontend build:

```bash
cd frontend
npm run build
npm run preview
```

## Authentication

1. The frontend sends credentials to `/auth/login` or `/auth/signup`.
2. The backend validates the request and hashes signup passwords with bcrypt.
3. The backend creates a JWT and sends it in an HTTP-only `token` cookie.
4. The frontend stores the returned public user data in session storage under
   `RolixerUser` for UI state only.
5. Axios sends the cookie because `withCredentials` is enabled.
6. Protected backend routes validate the cookie and role.

The JWT itself is not stored in browser session storage.

## Roles

| Role | Access |
| --- | --- |
| `admin` | Platform overview, users, stores, ratings, profile |
| `user` | Stores, profile, ratings |
| `owner` | Own store, ratings, customers, profile |

## How the project works by role

After login, the backend returns the user's role and the frontend redirects to
the matching dashboard. Every protected API request is checked twice:

1. `authMiddleware` verifies the JWT from the HTTP-only cookie and loads the
   current user.
2. `roleMiddleware` allows only the required role for that route.

This means a user cannot access another role's dashboard by manually changing
the URL.

### Normal user workflow

1. A visitor creates an account from `/user-signup`. New public registrations
   always receive the `user` role.
2. The user logs in and is redirected to `/user`.
3. From the user dashboard, the user can:
   - View the overview page.
   - Browse all available stores.
   - Search/filter stores in the frontend and open store details.
   - See the store's overall rating and number of ratings.
   - Submit one rating from 1 to 5 for a store.
   - Update the existing rating for that store.
   - Remove the rating.
   - View all ratings they have submitted.
   - View their profile and account details.
4. Each rating belongs to the logged-in user. The database prevents more than
   one rating for the same user and store; submitting again updates it.
5. The user can log out from the dashboard header. Logout clears the cookie on
   the backend and removes `RolixerUser` from session storage.

Normal users cannot create stores, manage other users, or see private owner or
administrator data.

### Administrator workflow

1. An administrator logs in with an account created by the seed script or by
   another administrator.
2. The administrator is redirected to `/admin`.
3. From the admin dashboard, the administrator can:
   - View platform totals and overview information.
   - List, filter, inspect, create, update, and delete users.
   - Assign supported roles (`admin`, `user`, or `owner`) when creating users.
   - List, inspect, create, update, and delete stores.
   - Assign stores to owners.
   - View all ratings and open individual rating details.
   - View the administrator profile.
4. Admin operations are protected by the `admin` role middleware, so normal
   users and owners receive an authorization error for these endpoints.

The administrator is the platform-management role. Store owners manage their
own store, while administrators manage the complete platform.

### Store owner workflow

1. A store owner logs in with an account whose role is `owner`.
2. The owner is redirected to `/owner`.
3. From the owner dashboard, the owner can:
   - View their store and its rating statistics.
   - View ratings submitted for their store.
   - Open individual rating details.
   - View customers who rated their store and customer details.
   - View the owner profile.
   - Update the owner password.
   - Update or delete the owned store where permitted.
4. Owner endpoints scope store data to the authenticated owner, so an owner
   cannot manage another owner's store or ratings.

Owners can monitor and maintain their store, but cannot manage platform users,
other stores, or administrator data.

## API

All protected routes require the authentication cookie. Role-protected routes
also require the role shown below.

### Authentication

| Method | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/auth/signup` | Public |
| `POST` | `/auth/login` | Public |
| `POST` | `/auth/logout` | Public |

Signup fields are `name`, `email`, `address`, and `password`. Normal-user
signup uses role `user`.

### User routes

Base path: `/user` — role `user`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/user/profile` | Get current profile |
| `GET` | `/user/stores` | List stores |
| `GET` | `/user/stores/:id` | Get store details and current rating |
| `GET` | `/user/ratings` | List current user's ratings |
| `PUT` | `/user/stores/:id/rating` | Create or update a rating |
| `DELETE` | `/user/stores/:id/rating` | Delete current user's rating |

Rating requests use:

```json
{ "rating": 1 }
```

The accepted rating range is the integer `1` through `5`.

### Owner routes

Base path: `/owner` — role `owner`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/owner/overview` | Owner dashboard data |
| `GET` | `/owner/profile` | Owner profile |
| `PUT` | `/owner/password` | Update owner password |
| `GET` | `/owner/store` | Get owned store |
| `GET` | `/owner/store/:id` | Get store details |
| `PUT` | `/owner/store/:id` | Update owned store |
| `DELETE` | `/owner/store/:id` | Delete owned store |
| `GET` | `/owner/ratings` | Get store ratings |
| `GET` | `/owner/ratings/:id` | Get one rating |
| `GET` | `/owner/customers` | Get store customers |
| `GET` | `/owner/customers/:id` | Get one customer |

### Admin routes

Base path: `/admin` — role `admin`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/admin/profile` | Admin profile |
| `GET` | `/admin/overview` | Platform totals |
| `GET` | `/admin/users` | List users |
| `GET` | `/admin/users/:id` | Get one user |
| `POST` | `/admin/users` | Create a user |
| `PUT` | `/admin/users/:id` | Update a user |
| `DELETE` | `/admin/users/:id` | Delete a user |
| `GET` | `/admin/owners` | List owners |
| `GET` | `/admin/stores` | List stores |
| `GET` | `/admin/stores/:id` | Get one store |
| `POST` | `/admin/stores` | Create a store |
| `PUT` | `/admin/stores/:id` | Update a store |
| `DELETE` | `/admin/stores/:id` | Delete a store |
| `GET` | `/admin/ratings` | List ratings |
| `GET` | `/admin/ratings/:id` | Get one rating |

## Frontend routes

### Public

- `/` — Home
- `/login` — Login
- `/user-signup` — Normal-user signup

### Protected

- `/admin`, `/admin/users`, `/admin/stores`, `/admin/ratings`,
  `/admin/profile`
- `/user`, `/user/stores`, `/user/ratings`, `/user/profile`
- `/owner`, `/owner/store`, `/owner/ratings`, `/owner/customers`,
  `/owner/profile`

Unauthorised role access displays an access-restricted screen.

## Validation

- Name: trimmed, 20–60 characters
- Address: required, maximum 400 characters
- Email: valid email format
- Password: 8–16 characters, at least one uppercase letter and one special
  character
- Rating: integer from 1 to 5
- Database roles: `admin`, `user`, or `owner`

## Available scripts

### Backend

```bash
npm run dev       # Start with nodemon
npm start         # Start normally
npm run migrate   # Apply database/schema.sql
npm run seed      # Insert demo data
```

### Frontend

```bash
npm run dev       # Start Vite
npm run build     # Create production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Security notes

- Keep `JWT_SECRET` long, random, and private.
- Never commit `.env` or database credentials.
- Passwords are hashed before storage.
- JWTs use HTTP-only cookies.
- SQL queries use parameters rather than string interpolation.
- CORS only allows the configured `CLIENT_URL`.
- Role middleware protects each role's API routes.

## Troubleshooting

### API connection errors

Confirm that the backend is running on port `4500` and that
`VITE_SERVER_URL` points to the same URL.

### CORS or cookie errors

Confirm that `CLIENT_URL` exactly matches the frontend origin and that both
requests and Axios use credentials.

### Database errors

Check `DATABASE_URL`, then run:

```bash
cd backend
npm run migrate
```

### Login redirects but data is missing

Check the browser's session storage for `RolixerUser`. The JWT is intentionally
kept in the HTTP-only cookie and cannot be read by frontend JavaScript.
