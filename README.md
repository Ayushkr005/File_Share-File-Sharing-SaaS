Fileshare-SaaS
A modern, secure file sharing platform built with React, TypeScript, and Supabase. Share files with ease while maintaining control over access and subscriptions.

✨ Features
Secure File Sharing: Upload and share files with secure, time-limited links
User Authentication: Complete user registration and login system
Subscription Management: Premium features with Stripe integration
Dashboard: User-friendly interface to manage your files and account
Responsive Design: Works seamlessly on desktop and mobile devices
Real-time Updates: Live file status and sharing updates
Modern UI: Beautiful interface built with Tailwind CSS and shadcn/ui
🛠️ Tech Stack
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS + shadcn/ui components
Backend: Supabase (Database, Auth, Storage, Edge Functions)
Payments: Stripe (Checkout, Customer Portal, Subscription Management)
Deployment: Vercel/Netlify ready
Package Manager: npm/bun
🚀 Getting Started
Prerequisites
Node.js 18+ or Bun
Supabase account
Stripe account (for payments)
Installation
Clone the repository

git clone https://github.com/yourusername/Fileshare-SaaS.git
cd Fileshare-SaaS
Install dependencies

npm install
# or
bun install
Set up Supabase

Create a new project at supabase.com
Copy your project URL and anon key
Create the following environment variables in your .env.local:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
Set up Supabase Edge Functions

# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Deploy edge functions
supabase functions deploy
Start the development server

npm run dev
# or
bun dev
Open your browser Navigate to http://localhost:5173

📁 Project Structure
Fileshare-SaaS/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── FileUpload.tsx  # File upload component
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   └── AnimatedBackground.tsx
│   ├── pages/              # Application pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Auth.tsx        # Authentication pages
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── Download.tsx    # File download page
│   │   └── Subscription.tsx # Subscription management
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client and types
│   └── lib/                # Utility functions
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── check-subscription/
│   │   ├── create-checkout/
│   │   └── customer-portal/
│   └── config.toml         # Supabase configuration
└── public/                 # Static assets
🔧 Configuration
Supabase Setup
Database Tables: The application expects the following tables:

users - User profiles
files - File metadata
subscriptions - User subscription data
Storage Buckets: Create a files bucket for file storage

Row Level Security (RLS): Enable RLS on all tables for security

Stripe Integration
Webhook Endpoints: Configure Stripe webhooks for subscription events
Products: Create subscription products in your Stripe dashboard
Customer Portal: Set up customer portal configuration
🚀 Deployment
Vercel Deployment
Connect your repository to Vercel
Set environment variables in Vercel dashboard
Deploy - Vercel will automatically detect the Vite configuration
Netlify Deployment
Connect your repository to Netlify
Set build command: npm run build
Set publish directory: dist
Configure environment variables
📱 Usage
For Users
Sign Up/Login: Create an account or sign in
Upload Files: Drag and drop or click to upload files
Share Files: Generate secure links to share your files
Manage Subscriptions: Upgrade to premium for more features
For Developers
Customize UI: Modify components in src/components/
Add Features: Extend functionality in src/pages/
Database Changes: Update Supabase schema and types
Edge Functions: Modify serverless functions in supabase/functions/
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is open source and available under the MIT License.

🆘 Support
If you encounter any issues or have questions:

Check the Issues page
Create a new issue with detailed information
Contact the maintainers
🙏 Acknowledgments
Supabase for the backend infrastructure
shadcn/ui for the beautiful UI components
Tailwind CSS for the styling framework
Vite for the fast build tool
Stripe for payment processing
Made with ❤️ by [Ayush Kumar]
