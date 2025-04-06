## Description

This is a microservices-based application designed for managing e-commerce deliveries. The system includes independent services for products, orders, deliveries, and authentication, all of which communicate via REST APIs. The goal is to streamline and optimize the e-commerce delivery process, ensuring smooth product management, order handling, and delivery tracking.

## Services
- **Product Service**: Manages product information and stock.
- **Order Service**: Processes orders, calculates totals, updates stock, and tracks order status.
- **Delivery Service**: Assigns deliveries and updates delivery (and order) statuses.
- **Authentication Service**: Handles user registration and login using JWT for secure access.

## API Routes
♡ &nbsp; **Products Microservice** :  
   - POST /product/add ➜ Add a new product.  
   - GET /product/:id ➜ Get a specific product by its ID.
   - PATCH /product/:id/stock ➜ Update stock after an order.  

♡ &nbsp; **Orders Microservice** :
  - POST /order/add ➜ Process a new order:
    - Check if products exist and have stock
    - Calculate total price
    - Save the order
    - Update product stock  
  - GET /order/:id ➜ Get a specific order by its ID.   
  - PATCH /order/:id/status ➜ Update order status ("Confirmed", "Shipped")   

♡ &nbsp; **Delivery Microservice** :
  - POST /delivery/add ➜ Create a new delivery:
    - Check if order exists  
    -  Assign a delivery person  
    - Save the delivery

  - PUT /delivery/:id ➜ Update delivery status.

♡ &nbsp; **Authentication Microservice** :
  - POST /auth/register ➜ Register a new user.  
  - POST /auth/login ➜ Login user and return a JWT token.
  - GET /auth/profile ➜ Get info of logged-in user (uses JWT).

## Setup

1. **Clone the repository**:
   ```bash
   https://github.com/er-hiba/E-commerce_Delivery_System.git
   cd E-commerce_Delivery_System
   ```

2. **Install dependencies in each service folder**:
    ```bash
    npm install
    ```
    
3. **Set up environment variables**:
   - Copy the .env.example file in each service folder to .env:
    ```bash
    cp authentication-service/.env.example authentication-service/.env
    cp products-service/.env.example products-service/.env
    cp orders-service/.env.example orders-service/.env
    cp delivery-service/.env.example delivery-service/.env
    ```
   - Edit the .env file and fill in the required values.

4. **Start the services**:
    ```bash
     npm start
    ```
