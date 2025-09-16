import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, Calendar, CheckSquare, TrendingUp, Award, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Connections', value: '24', icon: Users, color: 'text-primary' },
    { label: 'Study Groups', value: '5', icon: BookOpen, color: 'text-secondary' },
    { label: 'Tasks Completed', value: '18/25', icon: CheckSquare, color: 'text-success' },
    { label: 'Current GPA', value: '3.8', icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your learning overview for today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your tasks for this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Complete React Assignment</p>
                      <p className="text-sm text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                  <Progress value={60} className="w-24" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Study for Data Structures Quiz</p>
                      <p className="text-sm text-muted-foreground">Due tomorrow</p>
                    </div>
                  </div>
                  <Progress value={30} className="w-24" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>What's happening in your network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">New message in "Web Dev Study Group"</p>
                    <p className="text-sm text-muted-foreground">Sarah shared a resource • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <p className="font-medium">John accepted your connection request</p>
                    <p className="text-sm text-muted-foreground">You can now message each other • 5 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Streak</CardTitle>
                <CardDescription>Keep up the momentum!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-accent mx-auto mb-2" />
                    <p className="text-3xl font-bold">12 Days</p>
                    <p className="text-sm text-muted-foreground">Current streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss out</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-sm">ML Study Session</p>
                    <p className="text-xs text-muted-foreground">Today, 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <p className="font-medium text-sm">Career Workshop</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 5:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}