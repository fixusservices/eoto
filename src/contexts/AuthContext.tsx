import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  major?: string;
  year?: string;
  createdAt?: string;
  updatedAt?: string;
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
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("eoto_token");
      if (token) {
        try {
          const response = await apiClient.getProfile();
          if (response.success && response.data) {
            const userData = response.data as Partial<User> & { _id?: string };
            setUser({
              id: userData._id || userData.id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              bio: userData.bio,
              avatar: userData.avatar,
              major: userData.major,
              year: userData.year,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
            });
          } else {
            localStorage.removeItem("eoto_token");
          }
        } catch (error) {
          console.error("[v0] Auth check failed:", error);
          localStorage.removeItem("eoto_token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed");
      }

      const { user: userData, token } = response.data as {
        user: Partial<User> & { _id?: string };
        token: string;
      };
      localStorage.setItem("eoto_token", token);

      setUser({
        id: userData._id || userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      const response = await apiClient.signup(data);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Signup failed");
      }

      const { user: userData, token } = response.data as {
        user: Partial<User> & { _id?: string };
        token: string;
      };
      localStorage.setItem("eoto_token", token);

      setUser({
        id: userData._id || userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      toast({
        title: "Account created!",
        description: "Welcome to EOTO. Let's start learning together!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Signup failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("[v0] Logout error:", error);
    }

    setUser(null);
    localStorage.removeItem("eoto_token");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await apiClient.updateProfile(data);

      if (!response.success || !response.data) {
        const updatedData = response.data as Partial<User> & { _id?: string };
        setUser({
          ...user,
          id: updatedData._id || updatedData.id,
          email: updatedData.email,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          bio: updatedData.bio,
          avatar: updatedData.avatar,
          major: updatedData.major,
          year: updatedData.year,
        });

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
