
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Camera, Mail, Phone, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "123-456-7890",
    studentId: "STU12345",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    missedCheckin: true,
    upcomingClass: true,
    attendanceUpdate: true,
    academicAnnouncements: false,
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    });
  };
  
  const handleProfileUpdate = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsUpdating(false);
    }, 1000);
  };
  
  const handleNotificationUpdate = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Notification preferences saved");
      setIsUpdating(false);
    }, 1000);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center space-y-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.profilePicture} />
                          <AvatarFallback className="text-lg">{user?.name ? getInitials(user.name) : "US"}</AvatarFallback>
                        </Avatar>
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          <Camera className="h-3.5 w-3.5" />
                          Change Photo
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input
                              id="studentId"
                              name="studentId"
                              value={profileData.studentId}
                              onChange={handleProfileChange}
                              disabled={user?.role === "student"}
                            />
                            {user?.role === "student" && (
                              <p className="text-xs text-gray-500">Student ID cannot be changed</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={isUpdating}
                    className="bg-fras-blue hover:bg-fras-blue-light"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Details about your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Type</p>
                    <p className="font-medium">{user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || "")}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <div className="flex items-center mt-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p className="font-medium">Active</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="font-medium">April 9, 2025 at 9:32 AM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <Label htmlFor="emailNotifications" className="font-normal">
                        Email Notifications
                      </Label>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(value) => handleNotificationChange("emailNotifications", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <Label htmlFor="pushNotifications" className="font-normal">
                        Push Notifications
                      </Label>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(value) => handleNotificationChange("pushNotifications", value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="missedCheckin" className="font-normal">
                        Missed Check-in Alerts
                      </Label>
                      <Switch
                        id="missedCheckin"
                        checked={notificationSettings.missedCheckin}
                        onCheckedChange={(value) => handleNotificationChange("missedCheckin", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="upcomingClass" className="font-normal">
                        Upcoming Class Reminders
                      </Label>
                      <Switch
                        id="upcomingClass"
                        checked={notificationSettings.upcomingClass}
                        onCheckedChange={(value) => handleNotificationChange("upcomingClass", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="attendanceUpdate" className="font-normal">
                        Attendance Status Updates
                      </Label>
                      <Switch
                        id="attendanceUpdate"
                        checked={notificationSettings.attendanceUpdate}
                        onCheckedChange={(value) => handleNotificationChange("attendanceUpdate", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="academicAnnouncements" className="font-normal">
                        Academic Announcements
                      </Label>
                      <Switch
                        id="academicAnnouncements"
                        checked={notificationSettings.academicAnnouncements}
                        onCheckedChange={(value) => handleNotificationChange("academicAnnouncements", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button 
                  onClick={handleNotificationUpdate} 
                  disabled={isUpdating}
                  className="bg-fras-blue hover:bg-fras-blue-light"
                >
                  {isUpdating ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Shield className="h-6 w-6 text-fras-blue mt-1" />
                    <div>
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        It's a good idea to use a strong password that you're not using elsewhere
                      </p>
                      <Button className="mt-3" size="sm" variant="outline">
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-6 w-6 text-fras-blue mt-1" />
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Add an extra layer of security to your account
                      </p>
                      <Button className="mt-3" size="sm" variant="outline">
                        Setup 2FA
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-6 w-6 text-fras-blue mt-1" />
                    <div>
                      <h3 className="font-medium">Connected Devices</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage devices where you're currently logged in
                      </p>
                      <Button className="mt-3" size="sm" variant="outline">
                        Manage Devices
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
