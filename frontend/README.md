# Campus Connect Frontend

React + Vite frontend for the Campus Connect application.

## Setup Instructions

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd campus-connect/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Sidebar.jsx     # Sidebar navigation
│   ├── Footer.jsx      # Footer component
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── About.jsx       # About page
│   ├── Contact.jsx     # Contact page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Events.jsx      # Events management
│   ├── Exams.jsx       # Exams management
│   ├── Results.jsx     # Results management
│   ├── StudyMaterials.jsx # Study materials
│   └── Profile.jsx     # User profile
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── services/           # API services
│   └── api.js          # API configuration and services
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Features

### Authentication
- User registration and login
- JWT token management
- Role-based access control
- Protected routes

### Dashboard
- Role-specific dashboard content
- Statistics and quick actions
- Recent activity overview

### Event Management
- Create, edit, delete events
- Event listing and search
- Date and location management

### Exam Management
- Create and manage exams
- Subject-based organization
- Faculty-specific controls

### Results Management
- Grade entry and management
- Student result viewing
- Automatic grade calculation

### Study Materials
- File upload and management
- Material categorization
- Download functionality

### User Profile
- Profile information management
- Account settings
- Role-specific information display

## Components

### Navbar
- Responsive navigation
- User authentication status
- Role-based menu items
- Mobile-friendly design

### Sidebar
- Role-based navigation
- Active state management
- User information display

### Forms
- React Hook Form integration
- Form validation
- Error handling
- Loading states

## API Integration

### Authentication
- JWT token storage
- Automatic token refresh
- Request/response interceptors

### API Services
- Centralized API configuration
- Error handling
- Loading states
- Type-safe API calls

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color palette
- Responsive design
- Component classes

### Custom Components
- Reusable button styles
- Form input styles
- Card components
- Loading states

## State Management

### React Context
- Authentication state
- User information
- Global app state

### Local State
- Component-specific state
- Form state management
- UI state (modals, loading)

## Routing

### React Router
- Protected routes
- Role-based access
- Public routes
- Navigation guards

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Features
- Collapsible navigation
- Touch-friendly interfaces
- Optimized layouts

## Development

### Code Quality
- ESLint configuration
- Prettier formatting
- Component organization
- Error boundaries

### Performance
- Code splitting
- Lazy loading
- Optimized builds
- Image optimization

## Environment Configuration

### API Base URL
```javascript
const BASE_URL = 'http://localhost:8000/api';
```

### CORS Configuration
Backend must allow requests from:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Build and Deployment

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deployment
1. Build the application
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables
4. Set up proper routing for SPA

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check backend server is running
   - Verify API base URL
   - Check CORS configuration

2. **Authentication Issues**
   - Clear localStorage
   - Check token expiration
   - Verify login credentials

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify all dependencies

4. **Styling Issues**
   - Check Tailwind CSS configuration
   - Verify class names
   - Check CSS imports

### Debug Mode
Enable debug mode in browser dev tools for detailed error messages.

## Contributing

1. Follow the existing code style
2. Use meaningful component names
3. Add proper error handling
4. Write responsive components
5. Test on multiple devices

## License

This project is licensed under the MIT License.
