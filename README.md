Inview_
This repository contains the source code for the Inview Inventory application.  
It includes both frontend and backend components, along with supporting configuration and test files.

Project Structure
Frontend - inventory
- React
- React Router
- Axios
- Component-level styling (CSS)
- Unit tests with Jest and React Testing Library

Backend - InvenTracker
- ASP.NET Core Web API
- JWT-based authentication and authorization
- Service and repository layers
- Logging support (extensible)
- Unit tests with xUnit and InMemory EF Core

Database
- Entity Framework Core
- SQL Server integration (can also use InMemory for development and tests)

Features

User Authentication
- Register and login for Admin and Staff roles
- JWT token generation and validation

Inventory Management
- Create, read, update and delete inventory items
- Auto or manual SKU handling
- Category and pricing information

Stock In/Out
- Record IN and OUT transactions
- Automatic quantity updates on inventory
- Validation for insufficient stock on OUT operations

Alerts
- Low stock and critical stock detection
- Alerts page with status indicators
- Alert count displayed in the UI

Reports
- Summary of transactions and stock levels
- Basic visualizations for categories and movement

Architecture
- Clear separation of controllers, services, repositories and DTOs
- Reusable business logic in services
- Unit tests for controllers and services on both inventory and auth flows
