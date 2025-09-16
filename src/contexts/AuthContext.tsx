import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'senior' | 'mentor';
  year?: number;
  field?: string;
  interests: string[];
  skills: string[];
  bio?: string;
  avatar?: string;
  connections: string[];
  groups: string[];
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'senior' | 'mentor';
  year?: number;
  field?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('eoto_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for test credentials
      if (email !== 'test@psgtech.ac.in' || password !== 'test') {
        throw new Error('Invalid credentials');
      }
      
      const mockUser: User = {
        id: '1',
        email: 'test@psgtech.ac.in',
        name: 'Test Student',
        role: 'student',
        year: 3,
        field: 'Computer Science',
        interests: ['Web Development', 'Machine Learning', 'Data Structures', 'AI'],
        skills: ['React', 'TypeScript', 'Python', 'Java', 'Node.js'],
        bio: 'Computer Science student at PSG Tech, passionate about learning and sharing knowledge',
        avatar: 'https://ui-avatars.com/api/?name=Test+Student&background=6366f1&color=fff',
        connections: ['2', '3', '4', '5'],
        groups: ['web-dev-101', 'ml-study', 'dsa-prep'],
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('eoto_user', JSON.stringify(mockUser));
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Use test@psgtech.ac.in / test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        year: data.year,
        field: data.field,
        interests: [],
        skills: [],
        connections: [],
        groups: [],
        createdAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem('eoto_user', JSON.stringify(newUser));
      toast({
        title: "Account created!",
        description: "Welcome to EOTO. Let's start learning together!",
      });
      navigate('/onboarding');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eoto_user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('eoto_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};