
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, InfoIcon, Bell } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { AttendanceStatus, ClassSchedule, Notification, getTodayClasses, getNotifications, getStudentList } from "@/services/mockData";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AttendanceCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  title,
  count,
  icon,
  color,
}) => (
  <Card className="overflow-hidden">
    <div className={`h-1 ${color}`} />
    <CardContent className="pt-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace("bg-", "bg-").replace("fras", "fras") + "/20"}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ClassCard: React.FC<{ 
  classInfo: ClassSchedule; 
  isNow: boolean;
  status?: AttendanceStatus;
}> = ({ classInfo, isNow, status }) => {
  const getStatusColor = (status?: AttendanceStatus) => {
    switch (status) {
      case "present": return "text-fras-status-present";
      case "late": return "text-fras-status-late";
      case "absent": return "text-fras-status-absent";
      case "grace": return "text-fras-status-grace";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status?: AttendanceStatus) => {
    switch (status) {
      case "present": return <CheckCircle2 className="h-5 w-5 text-fras-status-present" />;
      case "late": return <Clock className="h-5 w-5 text-fras-status-late" />;
      case "absent": return <AlertCircle className="h-5 w-5 text-fras-status-absent" />;
      case "grace": return <InfoIcon className="h-5 w-5 text-fras-status-grace" />;
      default: return null;
    }
  };

  const getStatusText = (status?: AttendanceStatus) => {
    if (!status) return "Upcoming";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className={cn(
      "transition-all",
      isNow && "border-fras-blue shadow-md"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{classInfo.courseCode}</h3>
            <p className="text-sm text-gray-600">{classInfo.courseName}</p>
          </div>
          <div className="flex flex-col items-end">
            {status && getStatusIcon(status)}
            <span className={cn("text-sm font-medium", getStatusColor(status))}>
              {getStatusText(status)}
            </span>
          </div>
        </div>
        
        <div className="space-y-1 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Instructor:</span>
            <span className="font-medium">{classInfo.instructor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time:</span>
            <span className="font-medium">
              {format(classInfo.start, "h:mm a")} - {format(classInfo.end, "h:mm a")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Location:</span>
            <span className="font-medium">{classInfo.room}, {classInfo.building}</span>
          </div>
        </div>
        
        {isNow && (
          <Button className="w-full mt-4 bg-fras-blue hover:bg-fras-blue-light">
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIconByType = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="h-5 w-5 text-fras-status-late" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-fras-status-present" />;
      case "error": return <AlertCircle className="h-5 w-5 text-fras-status-absent" />;
      case "info":
      default:
        return <InfoIcon className="h-5 w-5 text-fras-blue-light" />;
    }
  };

  return (
    <div className={cn(
      "flex gap-3 p-3 rounded-lg transition-colors",
      notification.read ? "bg-white" : "bg-blue-50"
    )}>
      <div className="mt-1">
        {getIconByType(notification.type)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <span className="text-xs text-gray-500">
            {format(notification.timestamp, "h:mm a")}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      </div>
    </div>
  );
};

const StudentList: React.FC<{ classId: string }> = ({ classId }) => {
  const students = getStudentList();
  
  const getStatusBadge = (status: AttendanceStatus) => {
    const variants: Record<AttendanceStatus, string> = {
      present: "bg-fras-status-present text-white",
      late: "bg-fras-status-late text-white",
      absent: "bg-fras-status-absent text-white",
      grace: "bg-fras-status-grace text-white",
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
      {students.map(student => (
        <div key={student.id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>{student.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(student.status)}
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // For demo purposes
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 12,
    late: 3,
    absent: 1,
    grace: 2
  });
  
  useEffect(() => {
    setClasses(getTodayClasses("student"));
    setNotifications(getNotifications().slice(0, 3));
    
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const isCurrentClass = (classInfo: ClassSchedule) => {
    const now = currentTime;
    return now >= classInfo.start && now <= classInfo.end;
  };
  
  const isPastClass = (classInfo: ClassSchedule) => {
    return currentTime > classInfo.end;
  };
  
  // Mock status assignment - in real app would come from API
  const getClassStatus = (classInfo: ClassSchedule): AttendanceStatus | undefined => {
    if (isPastClass(classInfo)) {
      // For demo purposes, let's assign statuses to past classes
      if (classInfo.courseCode === "CS101") return "present";
      if (classInfo.courseCode === "MATH104") return "late";
      return "present";
    }
    return undefined; // Upcoming classes have no status yet
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-gray-500">
          {format(currentTime, "EEEE, MMMM d, yyyy")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AttendanceCard
          title="Present"
          count={attendanceCounts.present}
          icon={<CheckCircle2 className="h-6 w-6 text-fras-status-present" />}
          color="bg-fras-status-present"
        />
        <AttendanceCard
          title="Late"
          count={attendanceCounts.late}
          icon={<Clock className="h-6 w-6 text-fras-status-late" />}
          color="bg-fras-status-late"
        />
        <AttendanceCard
          title="Absent"
          count={attendanceCounts.absent}
          icon={<AlertCircle className="h-6 w-6 text-fras-status-absent" />}
          color="bg-fras-status-absent"
        />
        <AttendanceCard
          title="Grace Applied"
          count={attendanceCounts.grace}
          icon={<InfoIcon className="h-6 w-6 text-fras-status-grace" />}
          color="bg-fras-status-grace"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((classInfo) => (
              <ClassCard 
                key={classInfo.id} 
                classInfo={classInfo} 
                isNow={isCurrentClass(classInfo)}
                status={getClassStatus(classInfo)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            <Button variant="ghost" size="sm" className="text-fras-blue">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FacultyDashboard: React.FC = () => {
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const todayClasses = getTodayClasses("faculty");
    setClasses(todayClasses);
    
    // Set first class as selected by default
    if (todayClasses.length > 0) {
      setSelectedClass(todayClasses[0].id);
    }
    
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const isCurrentClass = (classInfo: ClassSchedule) => {
    const now = currentTime;
    return now >= classInfo.start && now <= classInfo.end;
  };
  
  const attendanceStats = {
    present: 7,
    late: 2,
    absent: 2,
    total: 11
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
        <p className="text-gray-500">
          {format(currentTime, "EEEE, MMMM d, yyyy")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Overview</CardTitle>
            <CardDescription>Today's attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Present</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold">{attendanceStats.present}</span>
                  <span className="text-xs text-gray-500 ml-1">/{attendanceStats.total}</span>
                  <Badge className="ml-2 bg-fras-status-present">{Math.round(attendanceStats.present/attendanceStats.total*100)}%</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Late</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold">{attendanceStats.late}</span>
                  <span className="text-xs text-gray-500 ml-1">/{attendanceStats.total}</span>
                  <Badge className="ml-2 bg-fras-status-late">{Math.round(attendanceStats.late/attendanceStats.total*100)}%</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Absent</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold">{attendanceStats.absent}</span>
                  <span className="text-xs text-gray-500 ml-1">/{attendanceStats.total}</span>
                  <Badge className="ml-2 bg-fras-status-absent">{Math.round(attendanceStats.absent/attendanceStats.total*100)}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Classes</CardTitle>
            <CardDescription>Select a class to view attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classes.map((classInfo) => (
                <Card 
                  key={classInfo.id}
                  className={cn(
                    "cursor-pointer border-2 transition-all",
                    selectedClass === classInfo.id ? "border-fras-blue" : "border-transparent",
                    isCurrentClass(classInfo) && "bg-blue-50"
                  )}
                  onClick={() => setSelectedClass(classInfo.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{classInfo.courseCode}</h3>
                        <p className="text-xs text-gray-600 mt-1">{format(classInfo.start, "h:mm a")} - {format(classInfo.end, "h:mm a")}</p>
                      </div>
                      {isCurrentClass(classInfo) && (
                        <Badge className="bg-fras-teal">Now</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Student Attendance
            {selectedClass && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                {classes.find(c => c.id === selectedClass)?.courseCode}
              </span>
            )}
          </h2>
          <Button className="bg-fras-blue hover:bg-fras-blue-light">
            Export Report
          </Button>
        </div>
        {selectedClass ? (
          <StudentList classId={selectedClass} />
        ) : (
          <p className="text-gray-500">Please select a class to view student attendance.</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      {user?.role === "student" ? <StudentDashboard /> : <FacultyDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
