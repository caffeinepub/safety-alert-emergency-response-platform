# Specification

## Summary
**Goal:** Fix the role assignment error by allowing users to self-select their role (citizen or officer) during registration without requiring author intervention.

**Planned changes:**
- Remove the role-based access control restriction that prevents users from assigning their own roles during registration
- Update the backend user profile creation logic to accept and store the user's selected role from the registration form without special authorization checks
- Verify that the RegistrationForm component correctly passes the selected role to the backend during profile creation

**User-visible outcome:** Users can successfully register as either a citizen or officer by selecting their role during registration, and will be redirected to the appropriate dashboard without encountering the "roles was not found" error.
