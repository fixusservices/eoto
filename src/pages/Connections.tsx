import { useState } from 'react';
import { Search, UserPlus, Users, GraduationCap, Star, Filter, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Connection {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'senior' | 'mentor';
  year?: number;
  field: string;
  interests: string[];
  skills: string[];
  matchScore: number;
  status: 'connected' | 'pending' | 'suggested';
  bio: string;
  avatar?: string;
}


export default function Connections() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('discover');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Connection | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === 'all' || conn.role === filterRole;
    const matchesTab = selectedTab === 'discover' ? conn.status === 'suggested' :
                      selectedTab === 'connected' ? conn.status === 'connected' :
                      selectedTab === 'pending' ? conn.status === 'pending' :
                      selectedTab === 'mentors' ? conn.role === 'mentor' || conn.role === 'senior' : true;
    
    return matchesSearch && matchesRole && matchesTab;
  });

  const handleConnect = (connection: Connection) => {
    setSelectedUser(connection);
    setShowRequestDialog(true);
    setRequestMessage(`Hi ${connection.name}, I'd love to connect and learn from your experience in ${connection.field}.`);
  };

  const sendConnectionRequest = () => {
    if (!selectedUser) return;
    
    setConnections(prev => prev.map(conn => 
      conn.id === selectedUser.id ? { ...conn, status: 'pending' } : conn
    ));
    
    toast({
      title: "Connection request sent!",
      description: `Your request has been sent to ${selectedUser.name}`,
    });
    
    setShowRequestDialog(false);
    setSelectedUser(null);
    setRequestMessage('');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'mentor': return 'default';
      case 'senior': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Connections
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with peers, seniors, and mentors who share your interests
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, field, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-md border bg-background"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="senior">Seniors</option>
            <option value="mentor">Mentors</option>
          </select>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="discover">
            <Users className="h-4 w-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="connected">
            <UserPlus className="h-4 w-4 mr-2" />
            Connected
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
          </TabsTrigger>
          <TabsTrigger value="mentors">
            <GraduationCap className="h-4 w-4 mr-2" />
            Mentors
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredConnections.map((connection) => (
              <Card key={connection.id} className="hover:shadow-card transition-all">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={connection.avatar} />
                        <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{connection.name}</h3>
                        <p className="text-sm text-muted-foreground">{connection.field}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(connection.role)}>
                      {connection.role}
                    </Badge>
                  </div>
                  
                  {connection.status === 'suggested' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Match Score</span>
                        <span className="font-medium">{connection.matchScore}%</span>
                      </div>
                      <Progress value={connection.matchScore} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{connection.bio}</p>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {connection.interests.slice(0, 3).map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {connection.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{connection.interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {connection.status === 'suggested' && (
                      <Button 
                        className="flex-1" 
                        variant="gradient"
                        onClick={() => handleConnect(connection)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    {connection.status === 'connected' && (
                      <Button className="flex-1" variant="outline">
                        Message
                      </Button>
                    )}
                    {connection.status === 'pending' && (
                      <Button className="flex-1" variant="outline" disabled>
                        Request Pending
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredConnections.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No connections found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or explore different categories
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
            <DialogDescription>
              Send a personalized message to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
                placeholder="Introduce yourself and explain why you'd like to connect..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={sendConnectionRequest}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}