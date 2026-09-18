# Medical Appointment - Reschedule E2E

This Postman collection validates the end-to-end flow for rescheduling a medical appointment in the Medical Appointment System API.

It covers:
- Authentication and automatic JWT handling
- Appointment discovery and availability lookup
- Appointment creation
- Successful reschedule flow
- Negative and boundary scenarios
- Response assertions for every request
- AI-assisted generation and validation workflow

---

## Overview

The collection is designed to be runnable without manual token pasting.

The flow is:

1. Log in with a valid user
2. Retrieve the authenticated user profile
3. Get the active doctors list
4. Get doctor availability and time slots
5. Create a test appointment
6. Reschedule the appointment to a new date/time
7. Validate the updated appointment
8. Execute negative scenarios

---

## Prerequisites

Before running the collection in Postman:

- Postman installed
- A valid QA/test user for the API
- Access to the API base URL
- A working environment with the required variables configured

The target API base URL used by default is:

- https://qa-challenge-backend.vercel.app

---

## Required environment variables

Import the provided environment file and populate the following values:

- `baseUrl`  
  Example: `https://qa-challenge-backend.vercel.app`

- `email`  
  Valid user email for authentication

- `password`  
  Valid user password for authentication

The collection also dynamically creates and updates the following variables during execution:

- `sessionToken`
- `currentUserId`
- `doctorId`
- `availableTimeSlots`
- `appointmentId`
- `appointmentDate`
- `originalAppointmentDate`
- `originalTimeSlot`
- `newAppointmentDate`
- `newTimeSlot`
- `maxResponseMs`

---

## Authentication behavior

The collection performs login automatically using:

- `POST {{baseUrl}}/api/auth/login`

The request body is:

```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

The API response is expected to contain a JWT token:

```json
{
  "token": "..."
}
```

That token is automatically saved to the `sessionToken` variable and used in subsequent authenticated requests.

---

## Request flow

### 1. Authentication
- `POST Login`
- `GET Current User`

These requests validate that the session is active and that the JWT token is valid.

### 2. Test Data Setup
- `GET Active Doctors`
- `GET Doctor Availability`
- `POST Create Appointment`
- `GET Appointment Detail`

This set of requests prepares the data needed to perform the reschedule flow.

### 3. Reschedule Happy Path
- `PUT Reschedule Appointment`
- `GET Appointment After Reschedule`

This validates the actual business flow: the appointment is updated to a new date and time and the state is confirmed.

### 4. Edge Cases
The collection includes negative tests for:
- Missing required fields
- Invalid date format
- Past dates
- Invalid time slots
- Non-existing appointment IDs
- Requests without authentication
- Invalid login credentials

---

## Dynamic variable logic

Several requests rely on variables populated in earlier steps.

Examples:
- `doctorId` is set by `GET Active Doctors`
- `availableTimeSlots` is set by `GET Doctor Availability`
- `appointmentId` is set by `POST Create Appointment`
- `newAppointmentDate` is generated in the Pre-request script of the reschedule request
- `newTimeSlot` is selected from the available slots and stored dynamically

This ensures the collection is runnable without hardcoded IDs and values.

---

## Assertions included

Each request includes Postman tests to validate:

- HTTP status code
- Response format
- Presence of required fields
- Correct data values
- Expected success/failure behavior
- Runtime performance thresholds

Examples:
- Validate login returns `200` and has a token
- Validate user profile has an `id`
- Validate doctors list is non-empty
- Validate availability includes `time_slots`
- Validate reschedule response contains `success: true`
- Validate the updated date/time matches the requested values
- Validate failed requests return an expected error status

---

## Response time validation

The collection includes a configurable variable:

- `maxResponseMs`

Default value:

```text
5000
```

Requests can validate that the API responds within the expected timeframe.

---

## Execution order

To run successfully, execute the collection in this order:

1. Authentication
   - POST Login
   - GET Current User

2. Test Data Setup
   - GET Active Doctors
   - GET Doctor Availability
   - POST Create Appointment
   - GET Appointment Detail

3. Reschedule Happy Path
   - PUT Reschedule Appointment
   - GET Appointment After Reschedule

4. Edge Cases
   - Run negative scenarios as required

---

## Newman / CLI execution

This collection is also compatible with Newman for CI/CD or local command-line execution.

Example command:

```bash
npx newman run Medical_Appointment_Reschedule.postman_collection.json \
  --environment Medical_Appointment_Reschedule.postman_environment.json \
  --env-var "email=your-user@example.com" \
  --env-var "password=your-password" \
  --reporters cli,json,junit \
  --reporter-json-export reports/reschedule-results.json \
  --reporter-junit-export reports/reschedule-results.xml
```

This keeps credentials out of the collection file and allows them to be passed at runtime.

---

## AI-Assisted Test Generation

This collection was created with the support of AI-assisted tooling to accelerate the design and validation of a reliable end-to-end API testing flow.

AI was used to:
- Interpret the OpenAPI contract and map the required endpoints
- Identify the authentication, availability, appointment, and reschedule flow
- Suggest the dynamic variable chain needed to avoid hardcoded IDs and manual token copying
- Generate the base assertion logic for status codes and response validation
- Create boundary and negative scenarios for API robustness
- Produce a cleanup flow to restore the original appointment state
- Structure the collection for execution in both Postman and Newman/CLI environments

The generated flow was then reviewed and refined against the actual observed API behavior, especially around the reschedule response and persistence rules. This was necessary because some backend responses returned `success: true` even when the underlying appointment state did not actually change, which is a real behavior to detect and validate in QA automation.

This approach helps reduce setup time and standardizes the test logic while keeping the collection adaptable to real API changes.

---


## File structure

- `Medical_Appointment_Reschedule.postman_collection.json`
- `Medical_Appointment_Reschedule.postman_environment.json`

---