# API Endpoints Reference

## Base URL
```
http://localhost:3001
```

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "farmName": "Green Acres Farm"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "farmId": "clx..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

## Animals

### List Animals
```http
GET /animals?farmId={farmId}
Authorization: Bearer {token}
```

### Get Animal
```http
GET /animals/:id
Authorization: Bearer {token}
```

### Create Animal
```http
POST /animals
Authorization: Bearer {token}
Content-Type: application/json

{
  "tagNumber": "COW-001",
  "name": "Bessie",
  "breed": "Holstein",
  "dateOfBirth": "2020-01-15",
  "gender": "FEMALE",
  "category": "COW",
  "farmId": "clx...",
  "purchasePrice": 15000
}
```

### Update Animal
```http
PATCH /animals/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "PREGNANT",
  "currentWeight": 550
}
```

### Delete Animal
```http
DELETE /animals/:id
Authorization: Bearer {token}
```

## Milk Records

### List Milk Records
```http
GET /milk-records?animalId={animalId}
Authorization: Bearer {token}
```

### Create Milk Record
```http
POST /milk-records
Authorization: Bearer {token}
Content-Type: application/json

{
  "animalId": "clx...",
  "date": "2024-01-15",
  "morningQuantity": 12.5,
  "eveningQuantity": 11.8,
  "quality": "EXCELLENT",
  "recordedBy": "user_id"
}
```

## Expenses

### List Expenses
```http
GET /expenses?farmId={farmId}
Authorization: Bearer {token}
```

### Create Expense
```http
POST /expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmId": "clx...",
  "category": "FEED",
  "description": "Cattle feed purchase",
  "amount": 5000,
  "date": "2024-01-15",
  "vendorName": "Feed Supply Co.",
  "createdBy": "user_id"
}
```

## Workers

### List Workers
```http
GET /workers?farmId={farmId}
Authorization: Bearer {token}
```

### Create Worker
```http
POST /workers
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmId": "clx...",
  "name": "Ram Kumar",
  "contactNumber": "+91-9876543210",
  "role": "Milking Operator",
  "salary": 15000,
  "joiningDate": "2024-01-01"
}
```

## Tasks

### List Tasks
```http
GET /tasks?farmId={farmId}
Authorization: Bearer {token}
```

### Create Task
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmId": "clx...",
  "title": "Clean cattle shed",
  "description": "Clean and disinfect main cattle shed",
  "dueDate": "2024-01-20",
  "priority": "HIGH",
  "createdBy": "user_id"
}
```

## Feeding Logs

### List Feeding Logs
```http
GET /feeding?animalId={animalId}
Authorization: Bearer {token}
```

### Create Feeding Log
```http
POST /feeding
Authorization: Bearer {token}
Content-Type: application/json

{
  "animalId": "clx...",
  "date": "2024-01-15",
  "feedType": "Green Fodder",
  "quantity": 25,
  "unit": "kg",
  "recordedBy": "user_id"
}
```

## Delivery Logs

### List Deliveries
```http
GET /deliveries?farmId={farmId}
Authorization: Bearer {token}
```

### Create Delivery
```http
POST /deliveries
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmId": "clx...",
  "date": "2024-01-15",
  "quantity": 250,
  "destination": "Dairy Cooperative",
  "price": 45,
  "createdBy": "user_id"
}
```

## Vet Visits

### List Vet Visits
```http
GET /vet?animalId={animalId}
Authorization: Bearer {token}
```

### Create Vet Visit
```http
POST /vet
Authorization: Bearer {token}
Content-Type: application/json

{
  "animalId": "clx...",
  "date": "2024-01-15",
  "reason": "Routine checkup",
  "diagnosis": "Healthy",
  "treatment": "Vaccination",
  "vetName": "Dr. Singh",
  "cost": 500
}
```

## Enum Values

### User Roles
- ADMIN
- MANAGER
- WORKER
- VIEWER

### Animal Gender
- MALE
- FEMALE

### Animal Category
- CALF
- HEIFER
- COW
- BULL

### Animal Status
- ACTIVE
- PREGNANT
- SICK
- SOLD
- DECEASED

### Milk Quality
- EXCELLENT
- GOOD
- AVERAGE
- POOR

### Expense Category
- FEED
- MEDICINE
- EQUIPMENT
- LABOR
- UTILITIES
- MAINTENANCE
- VETERINARY
- TRANSPORT
- OTHER

### Worker Status
- ACTIVE
- ON_LEAVE
- RESIGNED
- TERMINATED

### Task Priority
- LOW
- MEDIUM
- HIGH
- URGENT

### Task Status
- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELLED

### Delivery Status
- PENDING
- DELIVERED
- CANCELLED
