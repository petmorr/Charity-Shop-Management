# Testing Report
---

## 1. Overview

This report documents the testing of the web application developed for a local hospice charity. The application allows each of its four charity shops to showcase its current in-store products. It includes functionalities for both volunteers and managers to manage items and users. The testing was conducted to ensure that all features worked as expected and met the specified requirements.

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
1. **Landing Page & About Us**
2. **Authentication (Login, Logout, Registration)**
3. **Item Management (Add, Edit, Delete Items)**
4. **Volunteer Management (Add, Edit, Delete Volunteers)**
5. **Role-Based Access Control**
6. **Edge Case Handling**

##4. Test Cases
### 1. User Role Tests
| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 1.1     | Log in as a manager and access the dashboard | Manager dashboard loads successfully | OK | ![image](https://github.com/user-attachments/assets/1d05bfe7-4fb6-4df6-97e0-e77e63b4625e) |
| 1.2     | Log in as a volunteer and access the dashboard | Volunteer dashboard loads successfully | OK | ![image](https://github.com/user-attachments/assets/cc22aea7-f07d-4393-9f37-585f1f7f6757) |
| 1.3     | Attempt to access the manage volunteers page as a volunteer | Access denied with an appropriate error message | OK | ![image](https://github.com/user-attachments/assets/1f2dc544-355b-434d-9a1c-41641f319881) |
| 1.4     | Attempt to access manage items as a manager | Access allowed, manage items page loads successfully | OK | ![image](https://github.com/user-attachments/assets/c5db7699-ec80-4058-bdc9-62455096be35) |

### 2. Authentication Tests
| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 2.1     | Log in with valid credentials | Successful login, redirected to the dashboard | OK | ![image](https://github.com/user-attachments/assets/45a1719d-b1b0-4a39-b902-de51805ef29a) |
| 2.2     | Log in with invalid credentials | Access denied, appropriate error message shown | OK | ![image](https://github.com/user-attachments/assets/0dd7a6c5-a1ba-4e23-b6f4-c07eee8e9007) |
| 2.3     | Attempt to log out | Successful logout, redirected to the login page | OK | ![image](https://github.com/user-attachments/assets/72c963ff-ebba-41b1-aaff-0b47f2fafa58) |

### 3. Item Management Tests
| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 3.1     | Add a new item with all required details | Item added successfully, visible in the item list | OK | ![image](https://github.com/user-attachments/assets/7abebc47-b8fe-43d1-9200-17e628c2c6f1) |
| 3.2     | Edit an existing item’s details | Item updated successfully, changes visible in the item list | OK |![image](https://github.com/user-attachments/assets/7840f2bc-0104-4001-b420-ec01f7d3a9ab) |
| 3.3     | Delete an existing item | Item removed from the database and no longer visible in the item list | OK | ![image](https://github.com/user-attachments/assets/f056d497-ef82-4736-a6aa-258e11511029) |
| 3.4     | Add an item with missing required fields | Addition fails, error message displayed | OK | ![image](https://github.com/user-attachments/assets/0548bef9-9385-4f3f-8579-2ca2faccd71b) |
| 3.5     | Add an item with invalid data types (e.g., text in the price field) | Addition fails, the error message displayed | OK | ![image](https://github.com/user-attachments/assets/ca4c866b-a79d-4058-b4da-621f96d3d246) |

### 4. Volunteer Management Tests
| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 4.1     | Add a new volunteer with valid details | Volunteer added successfully, visible in the volunteer list | OK | ![image](https://github.com/user-attachments/assets/acbea806-5330-4507-82bb-930358137f50) |
| 4.2     | Edit an existing volunteer’s details | Volunteer updated successfully, changes visible in the volunteer list | OK | ![image](https://github.com/user-attachments/assets/0e52461d-e8f9-48c3-b68f-403ea53b6fdb) |
| 4.3     | Delete an existing volunteer | Volunteer removed from the database and no longer visible in the volunteer list | OK | ![image](https://github.com/user-attachments/assets/12b949c2-aba2-4459-be71-6536f9f23b28) |
| 4.4     | Add a volunteer with a duplicate username | Addition fails, error message displayed | OK | ![image](https://github.com/user-attachments/assets/84d0496b-e094-4d0b-8a60-6275ac90b567) |
| 4.5     | Add a volunteer with missing required fields | Addition fails, error message displayed | OK | ![image](https://github.com/user-attachments/assets/f389f0aa-55e2-414d-ab87-7db7d40f014a) |

### 5. Access Control Tests
| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 5.1     | Access the manage items page without logging in | Redirected to the login page | OK | ![image](https://github.com/user-attachments/assets/91f45f39-1315-4ca2-99e5-a4a7e877203a) |
| 5.2     | Access the manage volunteers page as a volunteer | Access denied with an appropriate error message | OK | ![image](https://github.com/user-attachments/assets/c53cc094-d964-4fb1-99d2-c4c01ad6660f) |
| 5.3     | Access the manage volunteers page as a manager | Access allowed, manage volunteers page loads successfully | OK | ![image](https://github.com/user-attachments/assets/ea4214c8-984a-4c1f-91e1-b82a0524df5d) |
| 5.4     | Log in and access the dashboard | Access granted, appropriate dashboard loads based on role | OK | ![image](https://github.com/user-attachments/assets/a508302c-df9a-4394-90c8-95affdff9657) |

### 6. Edge Case Tests
| Test ID | Action | Expected Outcome | Status | Evidence |
|---------|--------|------------------|--------|----------|
| 6.1     | Attempt to add an item with an exceptionally long name or description | Addition fails, error message displayed | OK | Screenshot/Logs |
| 6.2     | Attempt to log in with SQL injection in the username field | Login fails, system handles the input safely | OK | Screenshot/Logs |
| 6.3     | Attempt to access a protected route after logging out | Redirected to login page, no access to the protected route | OK | Screenshot/Logs |
| 6.4     | Simulate a database error while retrieving items | Appropriate error message displayed, system remains stable | OK | Screenshot/Logs |

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

---

## Appendices

- **Screenshots:** Refer to the attached screenshots for visual evidence of test results.
- **Test Data:** Detailed information about the test data used during testing.
- **Error Logs:** A summary of any error logs generated during testing, along with resolutions.

---

This testing report is part of the submission for the Web Application Development 2 coursework, contributing 70% of the overall module grade. It has been compiled to demonstrate the comprehensive testing conducted to ensure the functionality and reliability of the developed web application.