
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  file_upload_count: number;
  file_upload_limit: number;
}

const Subscription = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    
    setUser(session.user);
    await fetchSubscriptionData();
    setIsLoading(false);
  };

  const fetchSubscriptionData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscribe = async (plan: 'lite' | 'pro') => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  const plans = [
    {
      name: 'Base',
      price: 'Free',
      priceDetail: 'Forever',
      uploads: '10 uploads/month',
      features: [
        'Secure file sharing',
        'Basic support',
        'File history',
        'Download tracking'
      ],
      buttonText: 'Current Plan',
      isCurrentPlan: !subscriptionData?.subscribed,
      icon: Zap,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Lite',
      price: '$1',
      priceDetail: 'per month',
      uploads: '100 uploads/month',
      features: [
        'Everything in Base',
        'Priority support',
        'Advanced analytics',
        'Faster uploads'
      ],
      buttonText: subscriptionData?.subscribed && subscriptionData?.subscription_tier === 'Lite' ? 'Manage Subscription' : 'Upgrade Now',
      isCurrentPlan: subscriptionData?.subscribed && subscriptionData?.subscription_tier === 'Lite',
      icon: Crown,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Pro',
      price: '$2.50',
      priceDetail: 'per month',
      uploads: '500 uploads/month',
      features: [
        'Everything in Lite',
        'Premium support',
        'Advanced integrations',
        'Custom branding',
        'API access'
      ],
      buttonText: subscriptionData?.subscribed && subscriptionData?.subscription_tier === 'Pro' ? 'Manage Subscription' : 'Upgrade Now',
      isCurrentPlan: subscriptionData?.subscribed && subscriptionData?.subscription_tier === 'Pro',
      icon: Star,
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <Layout>
      <div className="relative min-h-screen">
        <AnimatedBackground />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your file sharing needs
            </p>
          </div>

          {/* Current Usage */}
          {subscriptionData && (
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/50 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Current Usage</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Files uploaded this month: {subscriptionData.file_upload_count} / {subscriptionData.file_upload_limit}
                  </span>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((subscriptionData.file_upload_count / subscriptionData.file_upload_limit) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name}
                className={`
                  p-8 relative overflow-hidden transition-all duration-300 animate-fade-in
                  ${plan.isCurrentPlan 
                    ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-blue-200/50 shadow-xl ring-2 ring-blue-200' 
                    : 'bg-white/80 hover:shadow-xl hover:scale-105'
                  }
                  backdrop-blur-md border border-white/50
                `}
                style={{ animationDelay: `${(index + 1) * 300}ms` }}
              >
                {plan.isCurrentPlan && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                    Current
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.priceDetail}</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">{plan.uploads}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => {
                    if (plan.name === 'Lite') {
                      if (subscriptionData?.subscribed && subscriptionData?.subscription_tier === 'Lite') {
                        handleManageSubscription();
                      } else {
                        handleSubscribe('lite');
                      }
                    } else if (plan.name === 'Pro') {
                      if (subscriptionData?.subscribed && subscriptionData?.subscription_tier === 'Pro') {
                        handleManageSubscription();
                      } else {
                        handleSubscribe('pro');
                      }
                    }
                  }}
                  disabled={plan.name === 'Base' && plan.isCurrentPlan}
                  className={`
                    w-full py-3 text-lg font-semibold transition-all duration-200
                    ${plan.name !== 'Base' 
                      ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg hover:scale-105 text-white` 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Card className="p-8 bg-white/80 backdrop-blur-md border border-white/50 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
                  <p className="text-gray-600">Yes, you can cancel your subscription at any time through the customer portal.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What happens to my files?</h4>
                  <p className="text-gray-600">Your files remain accessible even after cancellation, but upload limits revert to the free plan.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
                  <p className="text-gray-600">No setup fees or hidden charges. Pay only the monthly subscription fee.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Need help?</h4>
                  <p className="text-gray-600">Contact our support team for any questions or assistance with your subscription.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
