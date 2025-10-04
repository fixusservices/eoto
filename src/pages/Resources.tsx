import { useState } from 'react';
import { Search, Plus, Download, Star, Filter, FileText, Video, Link as LinkIcon, BookOpen, Upload, Folder, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'note' | 'video' | 'link' | 'document' | 'book';
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  size?: string;
  url?: string;
  tags: string[];
  downloads: number;
  rating: number;
  isStarred: boolean;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    category: '',
    url: '',
    tags: ''
  });

  const handleUploadResource = () => {
    if (!newResource.title) return;

    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title,
      description: newResource.description,
      type: newResource.type as Resource['type'],
      category: newResource.category,
      uploadedBy: 'You',
      uploadedAt: new Date(),
      url: newResource.url,
      tags: newResource.tags.split(',').map(t => t.trim()).filter(t => t),
      downloads: 0,
      rating: 0,
      isStarred: false
    };

    setResources(prev => [resource, ...prev]);
    setShowUploadDialog(false);
    setNewResource({
      title: '',
      description: '',
      type: 'document',
      category: '',
      url: '',
      tags: ''
    });

    toast({
      title: "Resource uploaded!",
      description: `${resource.title} has been added to resources`,
    });
  };

  const handleToggleStar = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId 
        ? { ...resource, isStarred: !resource.isStarred }
        : resource
    ));
  };

  const handleDownload = (resource: Resource) => {
    setResources(prev => prev.map(r =>
      r.id === resource.id 
        ? { ...r, downloads: r.downloads + 1 }
        : r
    ));
    
    toast({
      title: "Download started",
      description: `Downloading ${resource.title}`,
    });
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'note': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      case 'book': return <BookOpen className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch(type) {
      case 'note': return 'text-blue-500';
      case 'video': return 'text-red-500';
      case 'link': return 'text-green-500';
      case 'document': return 'text-purple-500';
      case 'book': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getFilteredResources = () => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedTab === 'starred') {
      filtered = filtered.filter(resource => resource.isStarred);
    } else if (selectedTab !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedTab);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === filterCategory);
    }

    return filtered;
  };

  const categories = Array.from(new Set(resources.map(r => r.category))).filter(c => c);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            Share and access study materials
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="gradient" onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter(r => r.type === 'document' || r.type === 'note').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter(r => r.type === 'video').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter(r => r.isStarred).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {categories.length > 0 && (
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Resources Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
          <TabsTrigger value="book">Books</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {getFilteredResources().length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredResources().map(resource => (
                <Card key={resource.id} className="hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg bg-muted ${getResourceColor(resource.type)}`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStar(resource.id)}
                      >
                        <Star className={`h-4 w-4 ${
                          resource.isStarred ? 'fill-yellow-500 text-yellow-500' : ''
                        }`} />
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-4">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {resource.uploadedBy[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{resource.uploadedBy}</span>
                      </div>
                      <span>{resource.downloads} downloads</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {resource.uploadedAt.toLocaleDateString()}
                    </div>
                  </CardContent>

                  <CardFooter className="gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {resource.url && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'starred'
                    ? "You haven't starred any resources yet"
                    : "Upload resources to share with your peers"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Resource Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
            <DialogDescription>
              Share study materials with your peers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newResource.title}
                onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Data Structures Lecture Notes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newResource.description}
                onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the resource..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value) => setNewResource(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newResource.category}
                  onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                value={newResource.url}
                onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newResource.tags}
                onChange={(e) => setNewResource(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="React, JavaScript, Tutorial"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              onClick={handleUploadResource}
              disabled={!newResource.title}
            >
              Upload Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
