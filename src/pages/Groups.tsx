import { useState } from 'react';
import { Search, Plus, Users, Calendar, MessageSquare, BookOpen, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  description: string;
  category: 'study' | 'project' | 'extracurricular' | 'research';
  members: number;
  maxMembers: number;
  leader: string;
  topics: string[];
  meetingSchedule: string;
  isPublic: boolean;
  joined: boolean;
  createdAt: Date;
  nextMeeting?: Date;
  avatar?: string;
}

const mockGroups: Group[] = [
  {
    id: 'web-dev-101',
    name: 'Web Development Mastery',
    description: 'Learn modern web development with React, TypeScript, and Node.js',
    category: 'study',
    members: 12,
    maxMembers: 20,
    leader: 'Sarah Johnson',
    topics: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    meetingSchedule: 'Every Tuesday & Thursday, 6 PM',
    isPublic: true,
    joined: true,
    createdAt: new Date('2024-01-15'),
    nextMeeting: new Date('2024-03-19T18:00:00'),
    avatar: 'https://ui-avatars.com/api/?name=Web+Dev&background=6366f1&color=fff'
  },
  {
    id: 'ml-study',
    name: 'Machine Learning Study Group',
    description: 'Deep dive into ML algorithms and practical applications',
    category: 'study',
    members: 8,
    maxMembers: 15,
    leader: 'Dr. Priya Sharma',
    topics: ['Python', 'TensorFlow', 'Neural Networks', 'Deep Learning'],
    meetingSchedule: 'Wednesdays, 5 PM',
    isPublic: true,
    joined: true,
    createdAt: new Date('2024-02-01'),
    nextMeeting: new Date('2024-03-20T17:00:00'),
    avatar: 'https://ui-avatars.com/api/?name=ML+Study&background=10b981&color=fff'
  },
  {
    id: 'dsa-prep',
    name: 'DSA Interview Prep',
    description: 'Master data structures and algorithms for technical interviews',
    category: 'study',
    members: 25,
    maxMembers: 30,
    leader: 'Raj Kumar',
    topics: ['Algorithms', 'Data Structures', 'Competitive Programming', 'Interview Prep'],
    meetingSchedule: 'Daily practice sessions at 8 PM',
    isPublic: true,
    joined: true,
    createdAt: new Date('2024-01-20'),
    avatar: 'https://ui-avatars.com/api/?name=DSA&background=ec4899&color=fff'
  },
  {
    id: 'robotics-club',
    name: 'Robotics & IoT Club',
    description: 'Build robots and IoT projects together',
    category: 'extracurricular',
    members: 15,
    maxMembers: 25,
    leader: 'Alex Chen',
    topics: ['Arduino', 'Raspberry Pi', 'IoT', 'Robotics'],
    meetingSchedule: 'Saturdays, 2 PM',
    isPublic: true,
    joined: false,
    createdAt: new Date('2024-02-10'),
    avatar: 'https://ui-avatars.com/api/?name=Robotics&background=f59e0b&color=fff'
  }
];

export default function Groups() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('my-groups');
  const [groups, setGroups] = useState(mockGroups);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'study',
    topics: '',
    meetingSchedule: '',
    maxMembers: '20',
    isPublic: true
  });

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = selectedTab === 'my-groups' ? group.joined :
                      selectedTab === 'discover' ? !group.joined :
                      selectedTab === 'suggested' ? !group.joined : true;
    
    return matchesSearch && matchesTab;
  });

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, joined: true, members: group.members + 1 } : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    toast({
      title: "Successfully joined group!",
      description: `You are now a member of ${group?.name}`,
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, joined: false, members: group.members - 1 } : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    toast({
      title: "Left group",
      description: `You have left ${group?.name}`,
    });
  };

  const handleCreateGroup = () => {
    const id = Date.now().toString();
    const group: Group = {
      id,
      name: newGroup.name,
      description: newGroup.description,
      category: newGroup.category as Group['category'],
      members: 1,
      maxMembers: parseInt(newGroup.maxMembers),
      leader: user?.name || 'You',
      topics: newGroup.topics.split(',').map(t => t.trim()),
      meetingSchedule: newGroup.meetingSchedule,
      isPublic: newGroup.isPublic,
      joined: true,
      createdAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${newGroup.name}&background=6366f1&color=fff`
    };
    
    setGroups(prev => [group, ...prev]);
    setShowCreateDialog(false);
    setNewGroup({
      name: '',
      description: '',
      category: 'study',
      topics: '',
      meetingSchedule: '',
      maxMembers: '20',
      isPublic: true
    });
    
    toast({
      title: "Group created successfully!",
      description: `${group.name} is now live`,
    });
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch(category) {
      case 'research': return 'default';
      case 'project': return 'secondary';
      case 'extracurricular': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Study Groups
          </h1>
          <p className="text-muted-foreground mt-1">
            Join groups to collaborate, learn, and grow together
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="gradient" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-card transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Badge variant={getCategoryBadgeVariant(group.category)}>
                      {group.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{group.members}/{group.maxMembers} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Active</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {group.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {group.meetingSchedule}
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="gap-2">
                  {group.joined ? (
                    <>
                      <Button className="flex-1" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="flex-1" 
                      variant="gradient"
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={group.members >= group.maxMembers}
                    >
                      {group.members >= group.maxMembers ? 'Group Full' : 'Join Group'}
                      {group.members < group.maxMembers && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'my-groups' 
                    ? 'Join some groups to start collaborating'
                    : 'Try adjusting your search or create a new group'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Study Group</DialogTitle>
            <DialogDescription>
              Set up a new group for collaborative learning
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Advanced Web Development"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGroup.category}
                  onValueChange={(value) => setNewGroup(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">Study Group</SelectItem>
                    <SelectItem value="project">Project Team</SelectItem>
                    <SelectItem value="extracurricular">Extracurricular</SelectItem>
                    <SelectItem value="research">Research Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the group's purpose and goals..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topics">Topics (comma-separated)</Label>
                <Input
                  id="topics"
                  value={newGroup.topics}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, topics: e.target.value }))}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={newGroup.maxMembers}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, maxMembers: e.target.value }))}
                  min="2"
                  max="100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schedule">Meeting Schedule</Label>
              <Input
                id="schedule"
                value={newGroup.meetingSchedule}
                onChange={(e) => setNewGroup(prev => ({ ...prev, meetingSchedule: e.target.value }))}
                placeholder="e.g., Every Tuesday & Thursday, 6 PM"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              onClick={handleCreateGroup}
              disabled={!newGroup.name || !newGroup.description}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}