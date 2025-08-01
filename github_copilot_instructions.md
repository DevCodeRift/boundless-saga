# GitHub Copilot Game Development Instructions

## Additional Project Instructions

1. Any new instructions or process changes must be added to this instructions.md document for future reference.
2. After any code or process change, always update this file to reflect the latest state and push all changes to GitHub.
2. When creating new database tables (e.g., in Supabase), always keep a log of table names and their purposes in this document to avoid forgetting them.
3. All code snippets and implementations must include clear explanations of what they are and why they are included.
4. Maintain a separate context document (see below) to help team members and Copilot quickly locate files, tables, and key resources for future usage.

### Table Log Example
| Table Name      | Purpose                                 |
|-----------------|-----------------------------------------|
| users           | Stores user accounts and anti-duplicate |
| user_devices    | Tracks devices for duplicate prevention |
| login_attempts  | Tracks login attempts for rate limiting |

Update this table as new tables are added.

## Project Overview
Building a cross-platform text-based game with React web app, React Native mobile, and Electron desktop versions. Current focus: Authentication system with futuristic murim theme.

## Current Sprint: Authentication & Theme Implementation

### Primary Objectives
1. Create homepage with futuristic murim styling
2. Implement dual authentication (Email + Discord OAuth)
3. Set up robust user management with anti-duplicate measures
4. Deploy to production with custom domain

## Tech Stack Requirements

### Frontend Stack
- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS with custom murim theme
- **UI Components:** Headless UI or Radix UI for accessibility
- **Icons:** Lucide React or Heroicons
- **Animations:** Framer Motion for smooth transitions

### Backend & Authentication
- **Backend:** Next.js API routes OR Express.js server
- **Database:** PostgreSQL (free tier: Supabase or Railway)
- **Authentication:** NextAuth.js with Discord provider + custom email
- **Session Management:** JWT tokens + HTTP-only cookies
- **Anti-duplicate Detection:** Device fingerprinting + IP tracking

### Hosting & Infrastructure
- **Frontend Hosting:** Vercel (primary choice) or Netlify
- **Backend Hosting:** Vercel (if Next.js) or Railway (if Express)
- **Database:** Supabase (PostgreSQL) or Railway PostgreSQL
- **Domain:** Custom domain through GitHub Student Pack

## Detailed Implementation Steps

### Step 1: Project Setup and Repository Configuration

#### 1.1 Initialize Project Structure
```bash
# Create main project with Vite
npm create vite@latest murim-game -- --template react-ts
cd murim-game

# Install core dependencies
npm install @tailwindcss/forms @headlessui/react lucide-react framer-motion
npm install next-auth @supabase/supabase-js js-cookie
npm install -D @types/js-cookie

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 1.2 Configure Tailwind for Murim Theme
Create custom color palette in `tailwind.config.js`:
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Murim-inspired color palette
        'void': '#0a0a0a',
        'shadow': '#1a1a1a',
        'obsidian': '#2d2d2d',
        'steel': '#4a5568',
        'mist': '#718096',
        'jade': '#38a169',
        'emerald': '#00d084',
        'gold': '#f6e05e',
        'crimson': '#e53e3e',
        'azure': '#3182ce',
        'silver': '#e2e8f0'
      },
      fontFamily: {
        'cultivation': ['Inter', 'system-ui', 'sans-serif'],
        'ancient': ['Cinzel', 'serif']
      },
      animation: {
        'qi-flow': 'qi-flow 3s ease-in-out infinite',
        'blade-shine': 'blade-shine 2s linear infinite',
        'cultivation-pulse': 'cultivation-pulse 4s ease-in-out infinite'
      }
    }
  }
}
```

### Step 2: Authentication System Setup

#### 2.1 Database Schema Design
```sql
-- Users table with anti-duplicate measures
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  discord_id VARCHAR(50) UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  
  -- Anti-duplicate tracking
  device_fingerprint VARCHAR(255),
  ip_addresses TEXT[], -- Array of IP addresses used
  browser_fingerprint JSONB,
  
  -- Account security
  email_verified BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Device tracking for duplicate prevention
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_trusted BOOLEAN DEFAULT false
);

-- Login attempts tracking
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255), -- email or discord_id
  ip_address INET,
  success BOOLEAN,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_fingerprint VARCHAR(255)
);
```

#### 2.2 Environment Variables Setup
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Security
JWT_SECRET="another-super-secret-key"
ENCRYPTION_KEY="32-character-encryption-key"
```

#### 2.3 NextAuth Configuration
Create `src/lib/auth.ts`:
```typescript
import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Implement email/password verification
        // Check against database, verify password hash
        // Return user object or null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Anti-duplicate user detection logic
      // Check device fingerprint, IP address, etc.
      return true
    },
    async session({ session, token }) {
      // Add custom user data to session
      return session
    }
  }
}
```

### Step 3: Frontend Components Development

#### 3.1 Murim-Themed Homepage Layout
Create futuristic cultivation-inspired design:
```typescript
// Homepage component with murim aesthetics
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-void via-shadow to-obsidian">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="qi-particles"></div>
        <div className="floating-runes"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <AuthenticationModal />
      </div>
    </div>
  )
}
```

#### 3.2 Authentication Modal Component
```typescript
const AuthModal = () => {
  const [authMode, setAuthMode] = useState<'email' | 'discord'>('email')
  
  return (
    <Dialog className="murim-modal">
      <div className="bg-obsidian/90 backdrop-blur-xl border border-jade/20">
        <h2 className="text-gold font-ancient text-2xl">Enter the Cultivation Realm</h2>
        
        {/* Email Authentication Form */}
        {authMode === 'email' && <EmailAuthForm />}
        
        {/* Discord OAuth Button */}
        <DiscordAuthButton />
        
        {/* Toggle between auth methods */}
        <AuthToggle />
      </div>
    </Dialog>
  )
}
```

### Step 4: Anti-Duplicate User System

#### 4.1 Device Fingerprinting Implementation
```typescript
// Device fingerprinting utility
export const generateDeviceFingerprint = async () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Device fingerprint', 2, 2)
  
  const fingerprint = {
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    canvas: canvas.toDataURL(),
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack
  }
  
  return btoa(JSON.stringify(fingerprint))
}
```

#### 4.2 User Registration with Duplicate Prevention
```typescript
export const registerUser = async (userData: UserRegistration) => {
  const deviceFingerprint = await generateDeviceFingerprint()
  const ipAddress = await fetch('/api/get-ip').then(r => r.json())
  
  // Check for existing users with same fingerprint or IP
  const existingUser = await checkForDuplicates({
    email: userData.email,
    deviceFingerprint,
    ipAddress: ipAddress.ip
  })
  
  if (existingUser) {
    throw new Error('Account already exists for this device')
  }
  
  // Create new user with tracking data
  return await createUser({
    ...userData,
    deviceFingerprint,
    ipAddress: ipAddress.ip
  })
}
```

### Step 5: Deployment Configuration

#### 5.1 Vercel Deployment Setup

**Step-by-step Vercel deployment:**

1. **Connect GitHub Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" and choose "Continue with GitHub"
   - Authorize Vercel to access your repositories
   - Click "Import Project" and select your game repository

2. **Configure Build Settings:**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "functions": {
       "app/api/**/*.ts": {
         "runtime": "nodejs18.x"
       }
     }
   }
   ```

3. **Environment Variables Setup:**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all variables from your `.env.local` file
   - Set different values for production (production database URLs, etc.)

4. **Custom Domain Configuration:**
   - In Project Settings → Domains
   - Add your custom domain from GitHub Student Pack
   - Configure DNS records as instructed by Vercel
   - Enable SSL (automatic with Vercel)

#### 5.2 Database Setup with Supabase

**Detailed Supabase setup:**

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign in with GitHub
   - Click "New Project"
   - Choose organization, name project "murim-game-db"
   - Select region closest to your users
   - Generate strong password

2. **Configure Database:**
   - Go to SQL Editor in Supabase dashboard
   - Run the user schema SQL provided above
   - Enable Row Level Security on all tables
   - Set up authentication policies

3. **Get Connection Details:**
   - Go to Settings → Database
   - Copy connection string for `DATABASE_URL`
   - Go to Settings → API
   - Copy `URL` and `anon public` key for environment variables

#### 5.3 Discord OAuth Application Setup

**Step-by-step Discord setup:**

1. **Create Discord Application:**
   - Go to [discord.com/developers/applications](https://discord.com/developers/applications)
   - Click "New Application"
   - Name it "Murim Cultivation Game"
   - Save application

2. **Configure OAuth2:**
   - Go to OAuth2 → General
   - Add redirect URIs:
     - `http://localhost:3000/api/auth/callback/discord` (development)
     - `https://yourdomain.com/api/auth/callback/discord` (production)
   - Copy Client ID and Client Secret

3. **Set Permissions:**
   - Go to OAuth2 → URL Generator
   - Select scopes: `identify`, `email`
   - Copy generated URL for testing

### Step 6: Security Implementation

#### 6.1 Rate Limiting and Protection
```typescript
// API route protection
export const withRateLimit = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    
    // Implement rate limiting logic
    const attempts = await getRecentAttempts(ip as string)
    if (attempts > 5) {
      return res.status(429).json({ error: 'Too many attempts' })
    }
    
    return handler(req, res)
  }
}
```

#### 6.2 Session Security
```typescript
// Secure cookie configuration
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/'
}
```

## GitHub Copilot Usage Guidelines

### Code Generation Prompts
When working with GitHub Copilot, use these specific prompts:

1. **For Components:**
   "Create a React component for [component name] with murim/cultivation theme using Tailwind classes with jade, gold, obsidian colors"

2. **For API Routes:**
   "Create Next.js API route for [functionality] with proper error handling, rate limiting, and TypeScript types"

3. **For Database Queries:**
   "Create PostgreSQL query for [operation] with proper indexing and security considerations"

4. **For Authentication:**
   "Implement [auth feature] with NextAuth.js, device fingerprinting, and duplicate prevention"

### File Structure for Copilot Context
Organize files so Copilot can understand context:
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── game/         # Game-specific components
│   └── layout/       # Layout components
├── lib/
│   ├── auth.ts       # Authentication configuration
│   ├── db.ts         # Database utilities
│   ├── utils.ts      # General utilities
│   └── security.ts   # Security functions
├── pages/
│   ├── api/          # API routes
│   ├── auth/         # Auth pages
│   └── game/         # Game pages
├── styles/
│   └── globals.css   # Global styles with murim theme
└── types/
    └── index.ts      # TypeScript type definitions
```

## Testing and Quality Assurance

### Testing Checklist
- [ ] Email authentication works correctly
- [ ] Discord OAuth flow completes successfully
- [ ] Duplicate account prevention triggers correctly
- [ ] Device fingerprinting captures unique devices
- [ ] Rate limiting prevents spam attempts
- [ ] Responsive design works on all devices
- [ ] Murim theme displays correctly
- [ ] Database connections are secure
- [ ] Environment variables are properly configured
- [ ] Custom domain redirects correctly
- [ ] SSL certificate is active

### Performance Monitoring
- Set up Vercel Analytics for performance tracking
- Monitor database query performance in Supabase
- Track authentication success/failure rates
- Monitor for security incidents

## Maintenance and Updates

### Regular Tasks
1. **Weekly:** Check for security updates in dependencies
2. **Monthly:** Review user authentication logs for anomalies
3. **Quarterly:** Update Discord OAuth application if needed
4. **As needed:** Scale database resources based on user growth

### Backup Strategy
- Supabase provides automatic backups
- Export user data weekly for additional security
- Version control all configuration changes
- Document all manual database changes

## Support and Documentation

### Resources for Team Members
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Common Issues and Solutions
1. **OAuth Redirect Mismatch:** Check Discord app settings and environment variables
2. **Database Connection Issues:** Verify Supabase connection string and firewall settings
3. **Build Failures:** Check for TypeScript errors and missing dependencies
4. **Authentication Loops:** Clear cookies and check NextAuth configuration

This comprehensive guide should enable GitHub Copilot and team members to implement the authentication system with futuristic murim theming while maintaining security and preventing duplicate accounts.