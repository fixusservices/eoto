import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Brain, Target, Sparkles, BookOpen, Trophy } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center animate-float shadow-glow">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Each One Teach One
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect, collaborate, and excel together. Join EOTO to transform your learning experience through peer-to-peer education.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="xl" variant="gradient" className="shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Connections</h3>
            <p className="text-muted-foreground">AI-powered matching to find study partners and mentors who share your goals</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow">
            <Brain className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Collaborative Learning</h3>
            <p className="text-muted-foreground">Join study groups, share resources, and learn together in real-time</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow">
            <Target className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">Monitor grades, manage tasks, and achieve your academic goals</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow">
            <Sparkles className="h-12 w-12 text-warning mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Study Groups</h3>
            <p className="text-muted-foreground">Algorithm-based group sorting for optimal learning dynamics</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow">
            <BookOpen className="h-12 w-12 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Resource Sharing</h3>
            <p className="text-muted-foreground">Share notes, materials, and knowledge with your learning community</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow">
            <Trophy className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gamified Learning</h3>
            <p className="text-muted-foreground">Earn achievements, maintain streaks, and celebrate milestones together</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-primary rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning smarter, not harder.
          </p>
          <Link to="/signup">
            <Button size="xl" variant="secondary" className="shadow-xl">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
