# Campus Connect Backend

Django REST Framework backend for the Campus Connect application.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- MongoDB
- pip (Python package installer)

### Installation

1. **Clone the repository and navigate to backend**
   ```bash
   git clone <repository-url>
   cd campus-connect/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   ```bash
   # Copy the example environment file
   copy env.example .env
   
   # Edit .env with your configuration
   # SECRET_KEY=your-secret-key-here
   # DEBUG=True
   # DB_NAME=campus_connect
   # DB_HOST=mongodb://localhost:27017/
   # DB_PORT=27017
   ```

6. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a superuser account**
   ```bash
   python manage.py createsuperuser
   ```

8. **Seed the database with sample data**
   ```bash
   python manage.py seed_data
   ```

9. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Authentication Endpoints
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/update/` - Update user profile

### Event Endpoints
- `GET /api/events/` - List all events
- `POST /api/events/` - Create a new event
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event

### Exam Endpoints
- `GET /api/exams/` - List all exams
- `POST /api/exams/` - Create a new exam
- `GET /api/exams/{id}/` - Get exam details
- `PUT /api/exams/{id}/` - Update exam
- `DELETE /api/exams/{id}/` - Delete exam

### Result Endpoints
- `GET /api/results/` - List all results
- `POST /api/results/` - Create a new result
- `GET /api/results/{id}/` - Get result details
- `PUT /api/results/{id}/` - Update result
- `DELETE /api/results/{id}/` - Delete result

### Study Material Endpoints
- `GET /api/materials/` - List all materials
- `POST /api/materials/` - Upload new material
- `GET /api/materials/{id}/` - Get material details
- `PUT /api/materials/{id}/` - Update material
- `DELETE /api/materials/{id}/` - Delete material

### Utility Endpoints
- `GET /api/dashboard-stats/` - Get dashboard statistics
- `GET /api/students/` - Get list of students
- `GET /api/faculty/` - Get list of faculty

## Sample Data

The `seed_data` management command creates:
- 1 Admin user (admin/admin123)
- 3 Faculty users (john_doe, jane_smith, mike_wilson)
- 5 Student users (alice_johnson, bob_brown, carol_davis, david_miller, eve_wilson)
- Sample events, exams, results, and study materials

## Database Models

### User Model
- Custom user model with role-based fields
- Roles: admin, faculty, student
- Additional fields: student_id, faculty_id, phone, address, profile_picture

### Event Model
- title, description, date, location
- created_by (ForeignKey to User)
- is_active flag

### Exam Model
- title, description, date, subject
- faculty (ForeignKey to User)
- is_active flag

### Result Model
- exam (ForeignKey to Exam)
- student (ForeignKey to User)
- marks_obtained, total_marks
- grade (auto-calculated)
- remarks

### Study Material Model
- title, description, material_type
- file (FileField)
- subject, uploaded_by (ForeignKey to User)
- is_active flag

## Permissions

### Role-based Access Control
- **Admin**: Full access to all resources
- **Faculty**: Can create/manage their own content, view all content
- **Student**: Read-only access to events, exams, materials; can view their own results

### Permission Classes
- `IsAdminOrReadOnly`: Admin can edit, others read-only
- `IsFacultyOrAdmin`: Faculty and admin only
- `IsOwnerOrAdmin`: Owner or admin can edit
- `IsStudentOrReadOnly`: Students can view their own data

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Applying Migrations
```bash
python manage.py migrate
```

### Django Admin
Access the admin interface at `http://localhost:8000/admin/`

## Configuration

### Environment Variables
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DB_NAME`: MongoDB database name
- `DB_HOST`: MongoDB connection string
- `DB_PORT`: MongoDB port

### CORS Settings
Configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify database name

2. **Migration Errors**
   - Delete migration files and recreate
   - Check model definitions
   - Ensure all dependencies are installed

3. **CORS Errors**
   - Add frontend URL to CORS_ALLOWED_ORIGINS
   - Check CORS middleware order

4. **JWT Token Issues**
   - Check SECRET_KEY in settings
   - Verify token expiration settings
   - Ensure proper token format in requests

### Debug Mode
Set `DEBUG=True` in .env file for detailed error messages.

## Production Deployment

1. Set `DEBUG=False`
2. Configure production database
3. Set up static file serving
4. Configure CORS for production domain
5. Set up proper logging
6. Use environment variables for sensitive data
