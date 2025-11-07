# Honourus - Simple Employee Recognition Platform

## 🎯 Overview

Honourus is a clean, minimalistic employee recognition and credit management platform designed to boost workplace engagement through simple task management, peer recognition, and productivity tracking. Built with React, TypeScript, and a modern blue & gold design inspired by our brand identity.

## ✨ Key Features

### 🎨 **Clean, Minimalistic Design**
- **Brand Colors**: Blue (#2563eb) primary with gold (#f59e0b) accents
- **5 Beautiful Themes**: Light, Dark, Ocean, Purple, Forest
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Simple Navigation**: Clean sidebar with essential features only

### 📋 **Task Management**
- **Kanban-style Interface**: Visual task organization with drag-and-drop
- **Credit System**: Tasks reward completion with credits
- **Priority Management**: High, Medium, Low priority levels
- **Team Collaboration**: Assign tasks to team members

### 🏆 **Recognition System**
- **4 Recognition Types**: Achievement, Collaboration, Innovation, Leadership
- **Peer Recognition**: Award credits to celebrate team contributions
- **Recognition Feed**: Timeline of team achievements
- **Personal Stats**: Track given and received recognition

### 👥 **Team Features**
- **Team Management**: Create and organize teams
- **Member Profiles**: View team member credits and achievements
- **Department Organization**: Group members by departments

### 📊 **Analytics & Insights**
- **Performance Metrics**: Task completion rates and trends
- **Credit Analytics**: Track earned credits over time
- **Visual Charts**: Interactive charts built with Recharts
- **Progress Tracking**: Personal and team productivity insights

### 🔍 **Smart Search**
- **Global Search**: Find tasks, people, teams, and recognition
- **Filter Options**: Search by type, status, and priority
- **Quick Access**: Jump directly to relevant content

## 🚀 Architecture

### **Three-Mode Application Flow**
1. **Marketing Mode**: Clean landing page with feature overview
2. **Tutorial Mode**: 4-step interactive onboarding
3. **Workspace Mode**: Full-featured dashboard experience

### **Technical Stack**
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Components**: 40+ shadcn/ui components
- **Icons**: Lucide React icon library
- **Animations**: Motion/React for smooth interactions
- **Charts**: Recharts for data visualization
- **Backend**: Supabase with Edge Functions
- **Database**: PostgreSQL with real-time updates
- **Authentication**: Supabase Auth with session management

## 🎨 Design System

### **Color Palette**
```css
Primary Blue:    #2563eb  /* Main actions, navigation */
Gold Accent:     #f59e0b  /* Secondary actions, highlights */
Success Green:   #10b981  /* Completed states */
Warning Red:     #ef4444  /* Errors, high priority */
Neutral Gray:    #6b7280  /* Text, borders */
```

### **Typography**
- **Font**: Inter (Google Fonts)
- **Headings**: 500-700 font weight
- **Body**: 400 font weight
- **Scale**: 12px to 32px responsive sizing

### **Components**
- **Cards**: Subtle shadows with rounded corners
- **Buttons**: Primary, secondary, outline, ghost variants
- **Badges**: Status indicators with contextual colors
- **Progress**: Linear progress bars for completion tracking

## 📱 Responsive Design

### **Desktop (1024px+)**
- Full sidebar navigation
- Multi-column layouts
- Hover interactions
- Keyboard shortcuts

### **Tablet (768px-1023px)**
- Collapsible sidebar
- Touch-optimized targets
- Adaptive grid layouts

### **Mobile (<768px)**
- Bottom navigation
- Single-column layouts
- Thumb-friendly interactions
- Swipe gestures

## 🛠️ Development

### **File Structure**
```
├── components/
│   ├── auth/           # Authentication components
│   ├── marketing/      # Landing page
│   ├── tutorial/       # Onboarding flow
│   ├── ui/            # Reusable UI components
│   └── workspace/     # Main application views
├── contexts/          # React Context providers
├── styles/           # Tailwind CSS configuration
├── types/            # TypeScript type definitions
└── utils/            # Helper functions and API calls
```

### **Key Components**
- **Logo**: Brand logo component with size variants
- **AuthModal**: Clean sign-in/sign-up modal
- **WorkspaceSidebar**: Minimalist navigation
- **DashboardView**: Overview with key metrics
- **TasksView**: Task management interface
- **RecognitionView**: Peer recognition system
- **AnalyticsView**: Performance charts and insights

## 🔧 Setup & Installation

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Supabase account (optional for backend features)

### **Installation**
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Variables**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🎯 Usage

### **Getting Started**
1. **Demo Mode**: Click "Try Demo Mode" for instant access
2. **Sign Up**: Create an account with email/password
3. **Tutorial**: Complete the 4-step onboarding
4. **Dashboard**: Access the main workspace

### **Core Workflows**
- **Create Tasks**: Add tasks with credits and assign to team members
- **Give Recognition**: Celebrate achievements and award credits
- **Track Progress**: Monitor completion rates and team performance
- **Manage Teams**: Organize members and collaborate effectively

## 🎨 Customization

### **Themes**
Switch between 5 built-in themes:
- **Light**: Clean professional look
- **Dark**: Easy on the eyes
- **Ocean**: Deep blue theme
- **Purple**: Creative and modern
- **Forest**: Natural and calming

### **Brand Colors**
All colors use CSS custom properties for easy customization:
```css
--primary: #2563eb;
--accent: #f59e0b;
--foreground: #1a1a1a;
--background: #ffffff;
```

## 🔒 Security & Privacy

- **Secure Authentication**: Supabase Auth with session management
- **Data Protection**: All API endpoints protected with bearer tokens
- **Privacy First**: No sensitive data stored in localStorage
- **CORS Protection**: Proper security headers on all requests

## 📈 Performance

- **Fast Loading**: Optimized bundle size with code splitting
- **Smooth Animations**: 60fps transitions with Motion/React
- **Responsive Images**: Optimized image loading and fallbacks
- **Efficient Rendering**: React 18 concurrent features

## 🤝 Contributing

We welcome contributions! Key areas for improvement:
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Bundle optimization
- **Features**: New recognition types and analytics
- **Mobile**: Enhanced mobile experience

## 📄 License

MIT License - see LICENSE file for details.

---

**Honourus** - Simple, beautiful employee recognition for modern teams.

Built with ❤️ using React, TypeScript, and Tailwind CSS.