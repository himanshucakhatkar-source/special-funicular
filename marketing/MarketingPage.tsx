import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import { useHonourus } from '../../hooks/useHonourus';
import { AuthModal } from '../auth/AuthModal';
import { Logo } from '../ui/logo';

export function MarketingPage() {
  const { setMode, setUser } = useHonourus();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  const handleGetStarted = () => {
    setAuthModalOpen(true);
  };

  const handleTryDemo = () => {
    // Demo user for quick access
    const demoUser = {
      id: 'demo-user',
      name: 'Alex Johnson',
      email: 'demo@honourus.com',
      role: 'manager' as const,
      credits: 1250,
      department: 'Engineering',
    };
    
    setUser(demoUser);
    setMode('tutorial');
  };

  const features = [
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Simple task boards with credit rewards for completion.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Organize teams and channels for better communication.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track productivity and performance with clear insights.',
    },
    {
      icon: Trophy,
      title: 'Recognition',
      description: 'Celebrate achievements with peer recognition system.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" className="font-[Abel] font-[Abyssinica_SIL] font-[Genos] font-bold" />
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </nav>
            <Button onClick={handleGetStarted} size="sm">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-8">
            <Logo size="xl" showText={false} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Simple Employee Recognition
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Boost team engagement with easy task management, peer recognition, and productivity tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGetStarted} size="lg" className="px-8">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8" onClick={handleTryDemo}>
              Try Live Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Everything you need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple tools to help teams work better together and celebrate achievements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-none bg-muted/30 hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Trusted by teams worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <p className="text-sm text-muted-foreground">Increase in engagement</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[rgba(255,159,0,1)] mb-2">60%</div>
              <p className="text-sm text-muted-foreground">Boost in productivity</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Employee satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to transform your workplace?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams using Honourus to build better workplace culture.
          </p>
          <Button onClick={handleGetStarted} size="lg" className="px-8">
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 Honourus. Simple employee recognition platform.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}