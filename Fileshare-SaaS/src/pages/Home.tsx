
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Upload, Download, Share, Shield, Zap, Globe, Lock } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag and drop files or click to upload. Support for all file types.',
    },
    {
      icon: Share,
      title: 'Instant Sharing',
      description: 'Get a unique link instantly and share files with anyone, anywhere.',
    },
    {
      icon: Download,
      title: 'Quick Download',
      description: 'Recipients can download files immediately without signing up.',
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Your files are stored securely with unique access links.',
    },
  ];

  const learnMoreFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Upload and share files in seconds with our optimized infrastructure.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your files from anywhere in the world with our CDN network.',
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security measures protect your data.',
    },
  ];

  const handleLearnMore = () => {
    document.getElementById('learn-more-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <Layout>
      <div className="relative">
        <AnimatedBackground />
        
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Share Files
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}Instantly
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                The fastest way to upload and share files with anyone. 
                Get a unique link in seconds and share with the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 text-lg px-8 py-3"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleLearnMore}
                  className="hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-lg px-8 py-3"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose FileShare?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Simple, fast, and secure file sharing that just works.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-4">
                    <feature.icon className="w-12 h-12 mx-auto text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Learn More Section */}
        <section id="learn-more-section" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Advanced Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the powerful features that make FileShare the best choice for file sharing.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {learnMoreFeatures.map((feature, index) => (
                <Card 
                  key={index}
                  className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-md border border-white/50 animate-fade-in"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  <div className="mb-6">
                    <feature.icon className="w-16 h-16 mx-auto text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>

            {/* Subscription Tiers Preview */}
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-8 bg-white/90 backdrop-blur-md border border-white/50 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Base Plan</h4>
                  <p className="text-3xl font-bold text-blue-600 mb-4">Free</p>
                  <p className="text-gray-600 mb-4">Perfect for personal use</p>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• 10 uploads per month</li>
                    <li>• Secure file sharing</li>
                    <li>• Basic support</li>
                  </ul>
                </Card>
                <Card className="p-8 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Lite Plan</h4>
                  <p className="text-3xl font-bold text-blue-600 mb-4">$1<span className="text-lg">/month</span></p>
                  <p className="text-gray-600 mb-4">Great for professionals</p>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• 100 uploads per month</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics</li>
                  </ul>
                </Card>
                <Card className="p-8 bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-md border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Pro Plan</h4>
                  <p className="text-3xl font-bold text-purple-600 mb-4">$2.50<span className="text-lg">/month</span></p>
                  <p className="text-gray-600 mb-4">For power users</p>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• 500 uploads per month</li>
                    <li>• Premium support</li>
                    <li>• API access</li>
                    <li>• Custom branding</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-12 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md border border-blue-200/50 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Start Sharing?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of users who trust FileShare for their file sharing needs.
              </p>
              <Link to="/auth">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 text-lg px-8 py-3"
                >
                  Get Started Now
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
