# JWT Authentication with Postman

## 🔐 Overview

This guide explains how to use JWT (JSON Web Token) authentication in Postman when testing protected API endpoints.

---

## 🚀 Steps to Use JWT in Postman

### 1. **Login or Signup to Get JWT**
Send a `POST` request to your login endpoint to receive a token.

**Endpoint Example:**

# POST /api/login

```json
**Sample Request Body:**
{
  "email": "user@example.com",
  "password": "yourPassword"
}

```

Sample Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```
---
---

# Responses

### path: /api/responses/


---
# get: '/' 
**403**: Access Deneed
**200**: Success
**500**: Network Issus

# post: '/'
**400**: Failed Validation
**201**: User Created
**500**: Network Issus

# post: '/draft' 
**400**: User Response Not provided
**201**: User Created
**500**: Network Issus

# get: '/draft' 
**200**: got usere draft
**404**: No draft found
**400**: User Response Not provided
**500**: Network Issus

# get: '/:id' 
**400**: User Response Not provided
**200**: got usere draft
**404**: No draft found
**500**: Network Issus

# delete: '/:id'
**400**: User Response Not provided
**200**: got usere draft
**404**: No draft found
**500**: Network Issus

---
---
# Questions

### path: /api/questions/

# get '/', '/:id'
**200**: success
**500**: internet

# post '', '/published'
**400**: question data is required
**201**: success
**500**: internet
