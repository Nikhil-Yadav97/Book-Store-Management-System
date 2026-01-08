# 📚 Book Store Management System

A full-featured bookstore application with separate interfaces for users and store owners, featuring financial tracking, inventory management, and purchase capabilities.

## 🎯 Project Overview

The Book Store Management System is a dual-interface platform that allows:
- **Users** to browse books, make purchases, and manage their accounts
- **Store Owners** to manage inventory, track finances, and monitor store operations

---

## 🚀 User Journey Sequence

### 1. **Landing Page** 
<img width="1896" height="1035" alt="home" src="https://github.com/user-attachments/assets/6c631093-34aa-4cef-9750-90e0d4ceb39c" />


- Public homepage accessible to all visitors
- Features calls to action for browsing and signing in

### 2. **Authentication** 
<img width="1895" height="1037" alt="login" src="https://github.com/user-attachments/assets/a67a487b-5c0d-4aa2-8935-75d828939cc4" />
<img width="1896" height="1030" alt="register" src="https://github.com/user-attachments/assets/e263b2d0-9ebc-4daf-9a51-1891c6f14edc" />

- Login/registration interface
- Supports both user and owner accounts
- Option to create new accounts

### 3. **User Interface Flow**

#### 3.1 **User Home Dashboard** 
<img width="1915" height="1038" alt="user home" src="https://github.com/user-attachments/assets/247782ca-9385-4461-813b-3d9ca8ccce98" />

- Personalized welcome message
- Dashboard for exploring titles and managing library
- Navigation: Home, Stores, History, Profile

#### 3.2 **Browse & Purchase Books** 
<img width="1913" height="1042" alt="user buys" src="https://github.com/user-attachments/assets/4f807bd7-dfc6-4f61-a541-2726596cb047" />

- Displays available books with details:
  - Atomic Habits (¥750) - 13 units
  - The Alchemist (¥450) - 82 units
  - Dan Brown Collection (¥197) - 34 units
- Individual "Buy" buttons for each book
- Location: Dehradun, India store

#### 3.3 **User Transaction History** 
<img width="1893" height="1041" alt="user transaction" src="https://github.com/user-attachments/assets/bafb5703-7435-4396-844e-bc23dd8c9cce" />

- Financial overview with available balance
- Recent transactions list
- Deposit/withdrawal functionality

#### 3.4 **User Profile Page** 
<img width="1903" height="1042" alt="profile page user" src="https://github.com/user-attachments/assets/9965ca99-b2c5-4741-aad9-b072c58ceee8" />

- Account details display
- Access to order history and account management
- Logout option

### 4. **Store Owner Interface Flow**

#### 4.1 **Owner Home** 
<img width="1918" height="1027" alt="owner home" src="https://github.com/user-attachments/assets/5899ff04-7828-4751-8472-89b652f8a4b0" />

- Personalized welcome for store owner "Alex"
- Displays store location information
- Store name

#### 4.2 **Book Management** 
<img width="1902" height="1041" alt="Book Info" src="https://github.com/user-attachments/assets/645a2800-a3a4-4331-9728-97c7582e155c" />

- Detailed book information view
- Shows inventory data 
- Pricing and metadata management
- Last inventory sync tracking

#### 4.3 **Financial Management** 
<img width="1902" height="1037" alt="owner transaction" src="https://github.com/user-attachments/assets/89a84ee9-36e8-4bf3-bdd4-6cbbbe990bae" />

- Store cash flow and transaction ledger
- Current balance display (¥10,000)
- Deposit/withdrawal controls
- Transaction history with real-time sync

---

## 🏗️ System Architecture

### User Roles:
1. **Regular Users**
   - Browse book catalog
   - Purchase books
   - Manage personal wallet
   - View order history

2. **Store Owners**
   - Manage inventory
   - Process financial transactions
   - Monitor store balance
   - View detailed book statistics

### Key Features:
- ✅ Real-time financial tracking
- ✅ Inventory management
- ✅ Transaction history
- ✅ User wallet system
- ✅ Role-based access control
- ✅ Purchase system
