# Fileshare-SaaS

A modern, secure file sharing platform built with React, TypeScript, and Supabase. Share files with ease while maintaining control over access and subscriptions.

---

## ✨ Features

- **Secure File Sharing**: Upload and share files with secure, time-limited links
- **User Authentication**: Complete user registration and login system
- **Subscription Management**: Premium features with Stripe integration
- **Dashboard**: User-friendly interface to manage your files and account
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live file status and sharing updates
- **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Payments**: Stripe (Checkout, Customer Portal, Subscription Management)
- **Deployment**: Vercel/Netlify ready
- **Package Manager**: npm/bun

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Fileshare-SaaS.git
   cd Fileshare-SaaS
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create the following environment variables in your `.env.local`:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up Supabase Edge Functions**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link your project
   supabase link --project-ref your_project_ref

   # Deploy edge functions
   supabase functions deploy
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
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
```

## 🔧 Configuration

### Supabase Setup

1. **Database Tables**: The application expects the following tables:
   - `users` - User profiles
   - `files` - File metadata
   - `subscriptions` - User subscription data

2. **Storage Buckets**: Create a `files` bucket for file storage

3. **Row Level Security (RLS)**: Enable RLS on all tables for security

### Stripe Integration

1. **Webhook Endpoints**: Configure Stripe webhooks for subscription events
2. **Products**: Create subscription products in your Stripe dashboard
3. **Customer Portal**: Set up customer portal configuration

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically detect the Vite configuration

### Netlify Deployment

1. **Connect your repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`
4. **Configure environment variables**

## 📱 Usage

### For Users

1. **Sign Up/Login**: Create an account or sign in
2. **Upload Files**: Drag and drop or click to upload files
3. **Share Files**: Generate secure links to share your files
4. **Manage Subscriptions**: Upgrade to premium for more features

### For Developers

1. **Customize UI**: Modify components in `src/components/`
2. **Add Features**: Extend functionality in `src/pages/`
3. **Database Changes**: Update Supabase schema and types
4. **Edge Functions**: Modify serverless functions in `supabase/functions/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/Fileshare-SaaS/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Vite](https://vitejs.dev) for the fast build tool
- [Stripe](https://stripe.com) for payment processing

---

Made with ❤️ by [Ayush Kumar]
