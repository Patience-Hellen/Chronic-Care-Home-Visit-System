# ChronoCare: Chronic Disease Home Visit Management System

## 1. Project Overview

ChronoCare is a full-stack healthcare management system designed to support the monitoring and management of patients with chronic illnesses. The system facilitates remote patient monitoring, home visit scheduling, and real-time alerts for abnormal health readings.

The platform is intended for use by healthcare providers and patients, enabling efficient coordination of care outside traditional hospital settings.

---

## 2. Objectives

- To enable remote monitoring of chronic disease patients
- To reduce hospital congestion through home-based care
- To provide real-time alerts based on patient health readings
- To streamline scheduling and management of home visits
- To maintain centralized and accessible patient records

---

## 3. System Features

### 3.1 Authentication and User Roles
- Secure login system
- Role-based access (Patient, Healthcare Provider)

### 3.2 Patient Management
- Patient profile creation and management
- Medical history and condition tracking

### 3.3 Health Readings
- Recording of vital signs (e.g., blood pressure, glucose levels)
- Historical data tracking

### 3.4 Alerts System
- Automatic alerts for abnormal readings
- Notification system for healthcare providers

### 3.5 Home Visit Scheduling
- Request and scheduling of home visits
- Tracking visit status and outcomes

---

## 4. System Architecture

The system follows a client-server architecture:

- **Frontend:** React.js
- **Backend:** Django REST Framework
- **Database:** PostgreSQL
- **API Communication:** RESTful APIs

---

## 5. Technology Stack

| Layer       | Technology                |
|------------|--------------------------|
| Frontend   | React.js                 |
| Backend    | Django, Django REST Framework |
| Database   | PostgreSQL               |
| Version Control | Git & GitHub        |

---

## 6. Project Structure
backend/
│── core/ # Django project settings
│── users/ # Custom user model and authentication
│── patients/ # Patient data management
│── readings/ # Health readings
│── alerts/ # Alert system
│── visits/ # Home visit scheduling
│── manage.py

frontend/
│── src/
│── components/
│── pages/


---

## 7. Installation and Setup

### 7.1 Prerequisites
- Python (>= 3.10)
- Node.js (>= 18)
- PostgreSQL
- Git

---

### 7.2 Backend Setup

bash
git clone <repository-url>
cd backend

python -m venv venv
source venv/Scripts/activate   # Windows

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver

7.3 frontend setup
cd frontend
npm install
npm run dev
