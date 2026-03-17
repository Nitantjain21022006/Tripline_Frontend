# 🚀 TripLine: The Future of Multi-Modal Travel

![TripLine Banner](file:///C:/Users/admin/.gemini/antigravity/brain/24b92e0c-03bf-4485-bf6b-88c9e47a8db9/tripline_banner_1773751657379.png)

> **TripLine** is a premium, full-stack travel booking ecosystem designed for seamless journey planning across **Flights, Trains, and Buses**. Built with a robust **Spring Boot** backend and a high-performance **React** frontend, it offers a state-of-the-art experience for modern travelers.

---

## 🎨 Human-Computer Interaction (HCI) Perspective

TripLine is engineered with **User-Centric Design** at its core. Our interface adheres to industry-standard HCI principles to ensure maximum usability and delight.

### 🧠 Core HCI Principles Applied
*   **Visibility of System Status**: Real-time seat availability and booking progress indicators (e.g., interactive seat maps).
*   **Consistency & Standards**: A unified design language across all transport modes, ensuring users don't have to relearn the interface for different bookings.
*   **Error Prevention**: Smart validation on search inputs (e.g., date pickers that prevent past-date selection) and confirmation modals before financial transactions.
*   **Aesthetic & Minimalist Design**: A "Premium Dark/Light" theme that prioritizes essential information, reducing cognitive load during complex trip planning.
*   **Help & Documentation**: Integrated "DocPage" providing clear guidance on system features.

---

## 🗄️ Database Management System (DBMS) Perspective

The system architecture is backed by a highly normalized relational schema designed for **Data Integrity** and **High-Performance Querying**.

### 📊 Entity-Relationship (ER) Diagram
```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER {
        Long id PK
        String email UK
        String password
        String role
    }
    STATION ||--o{ TRIP : origin_of
    STATION ||--o{ TRIP : destination_of
    STATION {
        Long id PK
        String name
        String code UK
        String city
    }
    VEHICLE ||--o{ TRIP : assigned_to
    VEHICLE {
        Long id PK
        String name
        Enum transport_mode
        Integer capacity
    }
    TRIP ||--o{ TICKET : generates
    TRIP ||--o{ BOOKING : contains
    TRIP {
        Long id PK
        DateTime departure_time
        DateTime arrival_time
        BigDecimal price
        Integer available_seats
    }
    BOOKING ||--|{ TICKET : issues
    BOOKING {
        Long id PK
        String status
        BigDecimal total_amount
    }
```

### 🔐 Data Integrity & Scalability
- **Transactional Integrity**: ACID properties are strictly maintained during the seat reservation process using Spring Data JPA's `@Transactional` scope.
- **Indexing Strategy**: Optimized lookup for scheduled trips using composite indexes on `(origin_station_id, destination_station_id, departure_time)`.
- **Constraint Management**: Foreign key constraints ensure referential integrity across Stations, Vehicles, and Trips.

---

## 🏗️ System Architecture

TripLine follows a decoupled **Client-Server Architecture** optimized for scalability and security.

```mermaid
graph TD
    subgraph "Frontend (React + Vite)"
        UI[User Interface] --> State[Context API / Hooks]
        State --> API_Client[Axios Service Layer]
    end

    subgraph "Backend (Spring Boot)"
        API_Client -- "RESTful API (JSON)" --> Controller[REST Controllers]
        Controller --> Service[Business Logic Layer]
        Service --> Security[Spring Security / JWT]
        Service --> Repo[JPA Repository Layer]
    end

    subgraph "Database (Oracle/H2)"
        Repo --> DB[(Relational DB)]
    end

    subgraph "External Integrations"
        Service --> Stripe[Stripe Payment Gateway]
        Service --> Mail[SMTP Email Service]
    end
```

---

## 🚀 Key Features
- **Multi-Modal Search**: Single search bar for Flights, Trains, and Buses.
- **Interactive Seat Selection**: Visual SVG-based seat selection for all vehicles.
- **Dynamic Pricing**: Real-time fare calculation based on journey distance and mode.
- **Admin Command Center**: Complete dashboard for managing carriers, vehicles, and system configurations.
- **JWT Security**: Robust authentication with secure cookie-based session management.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Java 17, Spring Boot 3.x, Spring Security, JWT, Lombok.
- **Persistence**: Hibernate/JPA, Oracle SQL / PostgreSQL.
- **Infrastructure**: Vercel (Frontend), Render (Backend), Maven.

---

## 📦 Installation & Setup

### Prerequisites
- JDK 17+
- Node.js 18+
- Maven 3.x

### Backend Setup
1. Navigate to `/backend`
2. Configure `.env` with your DB credentials and Stripe keys.
3. Run `mvn spring-boot:run`

### Frontend Setup
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm run dev`

---
*Developed with ❤️ by the TripLine Team.*
