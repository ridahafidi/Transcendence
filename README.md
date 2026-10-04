*This project has been created as part of the 42 curriculum by iboubkri, aezghari, yelouam, rhafidi.*

# TaskFlow: Collaborative Workspace Platform

## Description
TaskFlow is a comprehensive collaborative workspace and task management platform. Our goal is to provide teams with a unified environment for real-time communication, file sharing, and organizational management. Key features include real-time chat, role-based access control (RBAC), organization/workspace separation, an advanced analytics dashboard, and secure file management. 

## Instructions
**Prerequisites:**
- Docker and Docker Compose
- Make
- Available ports: 80, 443, 5432

**Execution:**
1. Clone the repository.
2. Copy the example environment file: `cp env.example .env` and fill in your 42 API credentials.
3. Build and run the infrastructure: `make up` (or `docker-compose up --build -d`).
4. Access the application at `https://localhost` (Note: Accept the self-signed certificate warning for local development).

## Team Information
- **iboubkri - Product Owner (PO):** Defined the product vision, prioritized the backlog, managed Jira, and validated completed features.
- **aezghari - Project Manager (PM) / Scrum Master:** Facilitated meetings, tracked progress across 1-2 day tasks, and managed blockers.
- **yeoulam - Technical Lead / Architect:** Designed the Spring Boot micro-architecture, defined the Docker network infrastructure, and reviewed critical pull requests.
- **rhafidi - Developer:** Implemented core backend REST APIs, configured the STOMP WebSocket broker, and built the secure file upload service.
*(Note: All members acted as Developers implementing features across the stack).*

## Project Management
We utilized an Agile Scrum methodology. Work was organized via a Jira Kanban board broken down into granular 1-2 day Epics and Tasks. We held weekly syncs to discuss blockers. Communication was primarily handled via a dedicated Discord server.

## Technical Stack
- **Frontend:** React, Vite, Tailwind CSS (Custom Design System)
- **Backend:** Java 17, Spring Boot 3, Spring Security 6, Spring Data JPA
- **Database:** PostgreSQL (with Flyway for migrations)
- **Infrastructure:** Docker, Docker Compose, Nginx (with ModSecurity v3 WAF), HashiCorp Vault

## Database Schema
- **Users:** Stores credentials, 42 OAuth metadata, and profile details.
- **Organizations & Workspaces:** Maps a many-to-many relationship with Users to define boundaries.
- **Messages:** Stores real-time chat payloads with relationships to Workspaces and Users.
- **Notifications:** Tracks system events and read-states per user.
- **Files:** Stores metadata, MIME types, and access control mappings for uploaded content.

## Features List
- Secure Email/Password & 42 OAuth Authentication.
- Real-time 1-on-1 and channel messaging.
- Organization and Workspace CRUD with role management.
- Real-time notification system.
- Secure file upload, preview, and download.
- Advanced analytics dashboard for activity tracking.

## Modules & Point Calculation (Total: 17 Points)
We targeted a robust enterprise architecture, focusing heavily on security, Web, and User Management. 

**Major Modules (2 points each):**
1. **Web - Frameworks:** Used React (Frontend) and Spring Boot (Backend) to ensure a scalable architecture.
2. **Web - Real-time Features:** Implemented STOMP over WebSockets for live chat, presence tracking, and instant notifications.
3. **Web - Public API:** Created a secured, external-facing API with Bucket4j rate-limiting and Swagger documentation.
4. **User Management - Organization System:** Built full CRUD for Organizations and Workspaces to isolate team data.
5. **User Management - Advanced Permissions:** Implemented a granular Role-Based Access Control (RBAC) system with `@PreAuthorize` guards.
6. **Data & Analytics - Dashboard:** Created an interactive analytics dashboard using Recharts to visualize user activity trends.
7. **Cybersecurity - WAF & Vault:** Integrated HashiCorp Vault for secrets management and Nginx ModSecurity with OWASP Core Rule Set to harden the application.

**Minor Modules (1 point each):**
8. **Web - Custom Design System:** Built 10+ highly reusable Tailwind UI components (Modals, Tables, Toasts).
9. **Web - File Management:** Implemented secure file uploads with magic-byte validation and access controls.
10. **User Management - OAuth:** Integrated the 42 API for remote authentication.

## Individual Contributions
- **aezghari:** Implemented the RBAC backend logic, OAuth 2.0 exchange, and Vault infrastructure.
- **rhafidi:** Built the analytics dashboard, integrated Recharts, and developed the data-table component.
- **yelouam:** Set up the STOMP WebSocket broker, real-time chat UI, and notification event bus.
- **iboubkri:** Configured Nginx ModSecurity, built the file upload validation service, and designed the base React layouts.

## Resources
- **AI Usage:** Generative AI was used strictly to assist with breaking down Jira tasks, defining architectural boilerplate structures, and resolving specific CSS cross-browser bugs. All AI-generated suggestions were manually reviewed, tested, and adapted by the team to ensure complete understanding during the defense.
