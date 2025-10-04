import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Award, Plus, AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from '@/hooks/use-toast';

interface Grade {
  id: string;
  course: string;
  courseCode: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  credits: number;
  semester: string;
  date: string;
  type: 'exam' | 'assignment' | 'quiz' | 'project';
}

interface Goal {
  id: string;
  title: string;
  targetGPA: number;
  currentGPA: number;
  deadline: string;
  progress: number;
}


export default function GradesTracker() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [semesterData] = useState([
    { name: 'Fall 2022', GPA: 3.2, credits: 15 },
    { name: 'Spring 2023', GPA: 3.4, credits: 16 },
    { name: 'Fall 2023', GPA: 3.6, credits: 15 },
    { name: 'Spring 2024', GPA: 3.8, credits: 14 }
  ]);
  const [coursePerformance] = useState([
    { course: 'CS', average: 85 },
    { course: 'Math', average: 78 },
    { course: 'Physics', average: 82 },
    { course: 'English', average: 88 },
    { course: 'Lab', average: 90 }
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [newGrade, setNewGrade] = useState({
    course: '',
    courseCode: '',
    score: '',
    maxScore: '100',
    credits: '3',
    semester: 'Spring 2024',
    type: 'exam'
  });
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Achieve 3.8 GPA',
      targetGPA: 3.8,
      currentGPA: 3.6,
      deadline: '2024-05-31',
      progress: 75
    }
  ]);

  const calculateGPA = () => {
    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
    const totalPoints = grades.reduce((sum, g) => {
      const gradePoint = g.percentage >= 90 ? 4.0 :
                        g.percentage >= 80 ? 3.0 :
                        g.percentage >= 70 ? 2.0 :
                        g.percentage >= 60 ? 1.0 : 0;
      return sum + (gradePoint * g.credits);
    }, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const handleAddGrade = () => {
    const percentage = (parseFloat(newGrade.score) / parseFloat(newGrade.maxScore)) * 100;
    const gradeValue = percentage >= 90 ? 'A+' :
                      percentage >= 85 ? 'A' :
                      percentage >= 80 ? 'B+' :
                      percentage >= 75 ? 'B' :
                      percentage >= 70 ? 'C+' :
                      percentage >= 60 ? 'C' : 'F';
    
    const grade: Grade = {
      id: Date.now().toString(),
      course: newGrade.course,
      courseCode: newGrade.courseCode,
      score: parseFloat(newGrade.score),
      maxScore: parseFloat(newGrade.maxScore),
      percentage,
      grade: gradeValue,
      credits: parseInt(newGrade.credits),
      semester: newGrade.semester,
      date: new Date().toISOString().split('T')[0],
      type: newGrade.type as Grade['type']
    };
    
    setGrades(prev => [grade, ...prev]);
    setShowAddDialog(false);
    setNewGrade({
      course: '',
      courseCode: '',
      score: '',
      maxScore: '100',
      credits: '3',
      semester: 'Spring 2024',
      type: 'exam'
    });
    
    toast({
      title: "Grade added successfully!",
      description: `${grade.course} - ${grade.grade} (${grade.percentage.toFixed(1)}%)`,
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600';
    if (grade.includes('B')) return 'text-blue-600';
    if (grade.includes('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Grades Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your academic performance and set goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGoalDialog(true)}>
            <Target className="h-4 w-4 mr-2" />
            Set Goal
          </Button>
          <Button variant="gradient" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateGPA()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
              +0.2 from last semester
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60</div>
            <p className="text-xs text-muted-foreground">14 this semester</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Web Dev</div>
            <p className="text-xs text-muted-foreground">92% average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">All Grades</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Goals</CardTitle>
              <CardDescription>Track your progress towards academic targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {goal.currentGPA} | Target: {goal.targetGPA}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your latest academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grades.slice(0, 5).map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{grade.course}</p>
                      <p className="text-sm text-muted-foreground">
                        {grade.courseCode} • {grade.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {grade.score}/{grade.maxScore}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>All Grades</CardTitle>
              <CardDescription>Complete grade history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Course</th>
                      <th className="text-left p-2">Code</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Score</th>
                      <th className="text-left p-2">Grade</th>
                      <th className="text-left p-2">Credits</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade.id} className="border-b">
                        <td className="p-2">{grade.course}</td>
                        <td className="p-2">{grade.courseCode}</td>
                        <td className="p-2">
                          <Badge variant="outline">{grade.type}</Badge>
                        </td>
                        <td className="p-2">{grade.score}/{grade.maxScore}</td>
                        <td className="p-2">
                          <span className={`font-bold ${getGradeColor(grade.grade)}`}>
                            {grade.grade}
                          </span>
                        </td>
                        <td className="p-2">{grade.credits}</td>
                        <td className="p-2">{new Date(grade.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GPA Trend</CardTitle>
              <CardDescription>Your GPA progression over semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={semesterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 4]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="GPA" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject area</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coursePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Grade Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
            <DialogDescription>Enter your course grade details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course Name</Label>
                <Input
                  id="course"
                  value={newGrade.course}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, course: e.target.value }))}
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  value={newGrade.courseCode}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, courseCode: e.target.value }))}
                  placeholder="e.g., CS201"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  type="number"
                  value={newGrade.score}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, score: e.target.value }))}
                  placeholder="85"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxScore">Max Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  value={newGrade.maxScore}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, maxScore: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newGrade.type}
                  onValueChange={(value) => setNewGrade(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={newGrade.credits}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, credits: e.target.value }))}
                  min="1"
                  max="6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={newGrade.semester}
                  onValueChange={(value) => setNewGrade(prev => ({ ...prev, semester: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                    <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                    <SelectItem value="Spring 2023">Spring 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              onClick={handleAddGrade}
              disabled={!newGrade.course || !newGrade.courseCode || !newGrade.score}
            >
              Add Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}