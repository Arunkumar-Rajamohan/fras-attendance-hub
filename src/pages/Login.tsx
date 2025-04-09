
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth, Role } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (role: Role) => {
    if (!loginData.email || !loginData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      await login(loginData.email, loginData.password, role);
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled in the AuthContext with toast
    }
  };

  // For demo purposes, let's add instructions for the mock accounts
  const demoInstructions = [
    {
      role: "student",
      email: "student@example.com",
      password: "password",
    },
    {
      role: "faculty",
      email: "faculty@example.com",
      password: "password",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-fras-blue to-fras-blue-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white">FRAS</h1>
          <p className="text-white/90 mt-2">Face Recognition Attendance System</p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Sign in to your account to access the FRAS system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin("student");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@university.edu"
                      value={loginData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="text-sm text-fras-blue hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fras-blue hover:bg-fras-blue-light"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="faculty">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin("faculty");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="faculty-email">Email</Label>
                    <Input
                      id="faculty-email"
                      name="email"
                      type="email"
                      placeholder="faculty.email@university.edu"
                      value={loginData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="faculty-password">Password</Label>
                      <a
                        href="#"
                        className="text-sm text-fras-blue hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="faculty-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fras-blue hover:bg-fras-blue-light"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Faculty"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo instructions */}
            <div className="mt-8 border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Demo Accounts:</p>
              <div className="space-y-2">
                {demoInstructions.map((account) => (
                  <div
                    key={account.role}
                    className="text-xs bg-gray-50 p-2 rounded"
                  >
                    <p className="font-medium">
                      {account.role.charAt(0).toUpperCase() + account.role.slice(1)} Account:
                    </p>
                    <p>Email: {account.email}</p>
                    <p>Password: {account.password}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
