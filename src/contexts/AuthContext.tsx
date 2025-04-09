
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Role = "student" | "faculty";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const MOCK_USERS = [
  {
    id: "student1",
    email: "student@example.com",
    password: "password",
    name: "Alex Student",
    role: "student" as Role,
    profilePicture: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: "faculty1",
    email: "faculty@example.com",
    password: "password",
    name: "Dr. Morgan Faculty",
    role: "faculty" as Role,
    profilePicture: "https://i.pravatar.cc/150?img=32"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('frasUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    setIsLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = MOCK_USERS.find(
        u => u.email === email && u.password === password && u.role === role
      );
      
      if (!mockUser) {
        throw new Error("Invalid credentials");
      }
      
      // Create user without the password
      const { password: _, ...userWithoutPassword } = mockUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('frasUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
    } catch (error) {
      toast.error((error as Error).message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('frasUser');
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
