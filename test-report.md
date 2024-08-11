# Testing Report

## Web Application Development 2 - Coursework 2

---

## 1. Overview

This report documents the testing of the web application developed for a local hospice charity. The application allows each of its four charity shops to showcase its current in-store products. The application includes functionalities for both volunteers and managers to manage items and users. The testing was conducted to ensure that all features worked as expected and meet the specified requirements.

## 2. Features Implemented

- **Public Access Features:**
  - Access the "About Us" page with details of the charity and its shops.
  - View details of current items in stock, including the name, description, price, and store location.
  
- **Volunteer Features:**
  - Login functionality.
  - Add, update, and delete items in their assigned store.
  
- **Manager Features:**
  - Add and delete volunteer users.
  - Manage items across all stores.

- **Authentication:**
  - Different levels of access for volunteers and managers.
  - Basic login and registration functionality with password hashing.

## 3. Test Scope

Functional testing was carried out for the following modules:

1. **Landing Page (index.html)**
2. **About Us Page**
3. **Item Management (View, Add, Edit, Delete)**
4. **User Management (Add, Delete)**
5. **Authentication (Login, Logout, Registration)**

## 4. Test Cases

| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 1.1 | Navigate to `localhost:3000` | Landing page loads with navigation links to "About Us", "Items" and "Login" | OK | ![image](https://github.com/user-attachments/assets/f57f94ed-9d86-4e65-8db0-819729cb85c3)
 |
| 1.2 | Click "About Us" | About Us page loads with charity details and shop locations | OK | Screenshot 2 |
| 2.1 | Navigate to `localhost:3000/items` | Items page loads with a list of items, including name, description, price, and store location | OK | Screenshot 3 |
| 2.2 | Login as a volunteer | Redirects to the volunteer dashboard | OK | Screenshot 4 |
| 2.3 | Add new item as a volunteer | Item is added to the store and displayed on the items page | OK | Screenshot 5 |
| 2.4 | Edit an existing item | Item details are updated and displayed correctly | OK | Screenshot 6 |
| 2.5 | Delete an item | Item is removed from the store and no longer displayed on the items page | OK | Screenshot 7 |
| 3.1 | Login as a manager | Redirects to the manager dashboard | OK | Screenshot 8 |
| 3.2 | Add a volunteer user | A New user is added and can log in as a volunteer | OK | Screenshot 9 |
| 3.3 | Delete a volunteer user | Volunteer is removed from the system and can no longer log in | OK | Screenshot 10 |
| 4.1 | Register a new user | User is created and redirected to the login page | OK | Screenshot 11 |
| 4.2 | Attempt to register with an existing username | Error message displayed and the user is prompted to choose a different username | OK | Screenshot 12 |
| 4.3 | Logout as a volunteer | User is logged out and redirected to the login page | OK | Screenshot 13 |
| 5.1 | Unauthorized access to the manager dashboard | User is redirected to the login page with an error message | OK | Screenshot 14 |

## 5. Summary of Test Results

- **Landing Page:**
  - The landing page and navigation to other pages work as expected. All tests passed without issues.

- **About Us Page:**
  - The About Us page correctly displays the charity information and shop locations. All tests passed successfully.

- **Item Management:**
  - Volunteers can successfully add, edit, and delete items. All functionalities are working as expected. Tests for adding items with invalid data, such as missing fields, also passed by showing appropriate error messages.

- **User Management:**
  - Managers can add and delete volunteer users. All tests passed, and the system appropriately handles edge cases, such as attempting to add a user with an existing username.

- **Authentication:**
  - The authentication system works correctly, providing appropriate access levels for volunteers and managers. Logout functionality also works as expected.

- **Error Handling:**
  - The application gracefully handles errors, such as unauthorized access attempts and registration with an existing username, by redirecting the user and displaying appropriate messages.

## 6. Conclusion

The web application has been rigorously tested, and all implemented features function correctly according to the specified requirements. The test coverage includes typical use cases, edge cases, and potential error scenarios. The system meets the specifications and is ready for deployment.

**Recommendation:** Given the robustness of the implemented features and the comprehensive test coverage, the application is expected to perform well in a real-world environment. Regular maintenance and updates are recommended to address any future issues.

---

## Appendices

- **Screenshots:** Refer to the attached screenshots for visual evidence of test results.
- **Test Data:** Detailed information about the test data used during testing.
- **Error Logs:** A summary of any error logs generated during testing, along with resolutions.

---

This testing report is part of the submission for the Web Application Development 2 coursework, contributing to 70% of the overall module grade. The report has been compiled to demonstrate the comprehensive testing conducted to ensure the functionality and reliability of the developed web application.
