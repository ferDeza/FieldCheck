# FieldCheck - Sport Field Booking Management System

A full-stack Spring Boot application for managing sport field bookings with secure authentication, user management, and field reservation capabilities. Built with modern Java technologies and cloud-ready architecture.

---

## Project Overview

FieldCheck is a comprehensive booking management system designed to streamline the reservation process for sport fields. Users can browse available fields, check availability, and create bookings with real-time price calculations. The system implements enterprise-grade security with OAuth2 and JWT authentication.

**Key Use Case:** Users can register, authenticate, browse sport fields, view availability, and book fields for specific time slots with automatic pricing.

---
## Features

### User Management
- **Secure Authentication:** OAuth2 with JWT tokens for stateless API authentication
- **User Registration & Login:** Full user lifecycle management with email-based accounts
- **Role-Based Access Control (RBAC):** User role enumeration (ADMIN, USER, etc.) for permission management
- **User Profile Management:** Track user details including full name, email, and phone number

### Sport Field Management
- **Field Catalog:** Browse available sport fields with detailed information
- **Field Availability:** Real-time availability checking for booking slots
- **Dynamic Pricing:** Price calculation based on booking duration and field type

### Booking System
- **Reservation Management:** Create, view, and manage field bookings
- **Date/Time Slot Selection:** Flexible booking windows with start and end time configuration
- **Automatic Price Calculation:** Total cost computed based on field rate and duration
- **Booking History:** Track user's past and upcoming reservations

### Security
- **OAuth2 Authorization Server:** Complete authentication server implementation
- **JWT Token Management:** Secure token generation and validation
- **Spring Security Integration:** Method-level and URL-based authorization
- **CORS & CSRF Protection:** Production-ready security configuration

---

## Technology Stack

### Backend Framework
- **Spring Boot 4.0.2** – Modern Java application framework
- **Spring Security** – Authentication and authorization
- **Spring Data JPA** – Object-relational mapping and database abstraction
- **Spring MVC** – RESTful API and web controller framework

### Authentication & Authorization
- **OAuth2 Authorization Server** – Token-based authentication
- **OAuth2 Client** – Support for third-party integrations
- **OAuth2 Resource Server** – API resource protection
- **JWT Tokens** – Secure stateless authentication

### Frontend
- **Thymeleaf** – Server-side template engine for dynamic web pages
- **HTML5** – Responsive booking and user interface
- **Spring Security Extras** – Security tag library for Thymeleaf templates

### Database
- **PostgreSQL** – Production-grade relational database
- **Hibernate ORM** – Database mapping with automatic schema generation
- **JPA Sequences** – Database sequence generators for ID management

### Development Tools
- **Lombok** – Reduce boilerplate with annotations (@Data, @Builder, etc.)
- **dotenv-java** – Environment variable management from .env files
- **Spring Boot DevTools** – Hot reload for development
- **Docker Compose** – Containerized PostgreSQL setup

### Testing Framework
- **JUnit 5** – Comprehensive unit and integration testing
- **Spring Security Test** – Security-specific test utilities
- **Spring Boot Test** – Auto-configured test context

---

## Architecture & Design Patterns

### Layered Architecture
```
Controllers (REST/HTTP Layer)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Database (PostgreSQL)
```

### Key Components

**Controllers** (`controllers/`)
- `AuthController` – Authentication endpoints (login, registration)
- `UsersController` – User profile management
- `BookingController` – Booking creation and retrieval
- `SportFieldController` – Field information and availability

**Services** (`services/`)
- `AuthService` – Authentication logic
- `UserService` – User management business logic
- `BookingService` – Booking workflow and price calculations
- `SportFieldService` – Field availability and details
- `TokenService` – JWT token generation and validation

**Models** (`models/`)
- `User` – User entity with UserDetails implementation for Spring Security
- `SportField` – Field information and configurations
- `Booking` – Reservation with foreign keys to User and SportField

**Configuration** (`config/`)
- `SecurityConfig` – Spring Security configuration with OAuth2
- `RsaKeyProperties` – JWT signing key management

**Repositories**
- JPA repositories for database operations with automatic CRUD implementations

---

## Getting Started

### Prerequisites
- Docker and Docker Compose
- **OR** for local development:
  - Java 21 or higher
  - Node.js 18+ and npm
  - PostgreSQL 12+
  - Gradle 8+

### Quick Start (Recommended - Using Docker Compose)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ferDeza/FieldCheck.git
   cd FieldCheck
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   DB_PORT=5432
   DB_NAME=field_db
   DB_USER=admin
   DB_PASSWORD=password123
   ```

3. **Start All Services (Backend, Frontend, Database)**
   ```bash
   docker-compose up
   ```
   
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080/api
   - **Database**: localhost:5432

### Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the project root (parent of backend folder):
   ```env
   DB_PORT=5432
   DB_NAME=field_db
   DB_USER=admin
   DB_PASSWORD=password123
   ```

3. **Start PostgreSQL (using Docker)**
   ```bash
   docker run --name fieldcheck-db -e POSTGRES_PASSWORD=password123 -e POSTGRES_USER=admin -e POSTGRES_DB=field_db -p 5432:5432 -d postgres:15-alpine
   ```

4. **Build the Project**
   ```bash
   ./gradlew build
   ```

5. **Run the Application**
   ```bash
   ./gradlew bootRun
   ```
   
   The backend will start on `http://localhost:8080`

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   The frontend will start on `http://localhost:3000` with hot-reload enabled.

5. **Build for production**
   ```bash
   npm run build
   ```

---

## Frontend - Backend Integration

### API Configuration
The React frontend communicates with the backend via the API service layer in `frontend/src/services/api.js`.

**Environment Variables** (in `frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Frontend Architecture

The React application follows a layered component architecture:

**Pages** – Main application screens:
- `Login` – User authentication
- `Register` – User registration
- `Dashboard` – Welcome dashboard with stats
- `Bookings` – Booking management
- `SportFields` – Browse available fields

**Components** – Reusable UI components:
- `Navigation` – Navigation bar with routing links
- `ProtectedRoute` – Route protection for authenticated users

**Context (State Management)**:
- `AuthContext` – Manages user authentication state, tokens, and session

**Services** – API communication:
- `authService` – Login and registration endpoints
- `bookingService` – Booking CRUD operations
- `sportFieldService` – Sport field listing and creation

### Using the API Services in React Components

```javascript
import { authService, bookingService } from '../services/api';

// Login
const { token } = await authService.login(email, password);

// Get Bookings
const bookings = await bookingService.getAllBookings();

// Create Booking
const booking = await bookingService.createBooking({
  sportFieldId: 1,
  startDateTime: '2024-03-10T10:00:00',
  endDateTime: '2024-03-10T12:00:00',
  notes: 'Team practice'
});

// Delete Booking
await bookingService.deleteBooking(bookingId);
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (React development)

For production, update the `corsConfigurationSource()` bean in `backend/src/main/java/com/app/fieldcheck/config/SecurityConfig.java` with your frontend domain.

---

### Authentication
- **POST** `/api/auth/register` – Register new user
- **POST** `/api/auth/login` – Authenticate user and receive JWT token

### Users
- **GET** `/api/users/{id}` – Get user profile
- **PUT** `/api/users/{id}` – Update user information

### Sport Fields
- **GET** `/api/fields` – List all available fields
- **GET** `/api/fields/{id}` – Get field details
- **GET** `/api/fields/{id}/availability` – Check field availability

### Bookings
- **POST** `/api/bookings` – Create new booking
- **GET** `/api/bookings` – List user's bookings
- **GET** `/api/bookings/{id}` – Get booking details
- **DELETE** `/api/bookings/{id}` – Cancel booking

---

## Project Structure

```
FieldCheck/
├── backend/                         # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/app/fieldcheck/
│   │   │   │   ├── config/              # Security & app configuration
│   │   │   │   ├── controllers/         # REST controllers
│   │   │   │   ├── enums/               # Role and status enumerations
│   │   │   │   ├── models/              # JPA entities
│   │   │   │   ├── repositories/        # Data access layer
│   │   │   │   ├── services/            # Business logic
│   │   │   │   ├── web/                 # Web utilities
│   │   │   │   └── FieldCheckApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml      # Spring configuration
│   │   │       ├── certs/               # SSL certificates
│   │   │       ├── static/              # CSS, JS assets
│   │   │       └── templates/           # Thymeleaf templates
│   │   └── test/
│   │       └── java/                    # Unit & integration tests
│   ├── build.gradle                     # Gradle dependencies & build config
│   ├── Dockerfile                       # Backend container configuration
│   └── HELP.md
├── frontend/                        # React Frontend (Modern SPA)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx           # Navigation bar component
│   │   │   ├── Navigation.css
│   │   │   └── ProtectedRoute.jsx       # Auth-protected route wrapper
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication state management
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx                # User login page
│   │   │   ├── Register.jsx             # User registration page
│   │   │   ├── Dashboard.jsx            # User dashboard/home
│   │   │   ├── Bookings.jsx             # Booking management page
│   │   │   ├── SportFields.jsx          # Browse sport fields
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Bookings.css
│   │   │   └── SportFields.css
│   │   │
│   │   ├── services/
│   │   │   └── api.js                   # API service layer
│   │   │
│   │   ├── App.jsx                      # Main app component with routing
│   │   ├── App.css
│   │   └── index.js
│   │
│   ├── public/                      # Static assets
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   ├── Dockerfile                   # Frontend container configuration
│   ├── FRONTEND_GUIDE.md            # Detailed frontend documentation
│   ├── API_INTEGRATION.md           # API integration guide
│   └── README.md
│
├── compose.yaml                     # Docker Compose setup for entire stack
├── .env                             # Environment variables
├── .env.example
└── Readme.md
```

---

## Security Features

- **OAuth2 Compliant** – Industry-standard authentication protocol
- **JWT Token Authentication** – Stateless, scalable authentication mechanism
- **Password Security** – Spring Security password encoding
- **CSRF Protection** – Built-in cross-site request forgery protection
- **Method-Level Authorization** – Fine-grained permission control
- **Secure Headers** – HTTP security headers configuration

---

## Database Schema

The application uses PostgreSQL with three main entities:

- **users** – User accounts with roles and authentication details
- **sport_fields** – Field information and pricing
- **bookings** – Reservation records linking users to fields with time slots

Database sequences ensure reliable, non-overlapping ID generation across concurrent requests.

---

## Testing

Run tests with:
```bash
./gradlew test
```

The project includes comprehensive test utilities for:
- Spring Security integration testing
- OAuth2 token validation
- JPA repository operations
- API endpoint validation

---

##  Docker & Deployment

### Local Development with Docker
```bash
docker-compose up
```

### Build Docker Image
```bash
./gradlew bootBuildImage
```

The application is containerization-ready for cloud deployment platforms (AWS, GCP, Azure, Kubernetes).

---

## Notable Implementation Details

### Environment Configuration
The application dynamically loads environment variables from `.env` using dotenv-java before Spring initializes, enabling flexible configuration across environments.

### ORM Strategy
- Uses Hibernate with PostgreSQL dialect
- Automatic schema generation with `ddl-auto: update`
- Eager fetching for Booking relationships to prevent N+1 queries
- Sequence-based ID generation for reliability

### Security Token Flow
1. User authenticates via `/auth/login`
2. Server generates RSA-signed JWT token
3. Client includes token in Authorization header
4. Resource Server validates token and authorizes request

---

## What I Learned & Demonstrated

This project showcases competency in:

✅ **Spring Boot Ecosystem** – Complete Spring stack integration (Security, Data, MVC)  
✅ **Enterprise Authentication** – OAuth2 and JWT token implementation  
✅ **Relational Databases** – PostgreSQL with JPA/Hibernate ORM  
✅ **RESTful API Design** – Consistent endpoint design and HTTP semantics  
✅ **Security Best Practices** – Authentication, authorization, secure configuration  
✅ **Lombok & Modern Java** – Reducing boilerplate with annotations  
✅ **Docker & Containerization** – Application deployment readiness  
✅ **Gradle Build System** – Dependency management and build automation  
✅ **Role-Based Access Control** – Permission management patterns  
✅ **Thymeleaf Templates** – Server-side rendering with Spring integration  

---

**Last Updated:** March 2026  
**Java Version:** 21  
**Spring Boot Version:** 4.0.2
