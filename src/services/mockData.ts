
import { format, subDays, addDays, addHours, setHours, setMinutes } from "date-fns";

export type AttendanceStatus = "present" | "absent" | "late" | "grace";

export interface ClassSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  start: Date;
  end: Date;
  room: string;
  building: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: Date;
  status: AttendanceStatus;
  entryTime?: Date;
  courseCode: string;
  courseName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "warning" | "error" | "success";
}

// Generate today's date with specific hours
const generateTimeToday = (hours: number, minutes: number = 0) => {
  const today = new Date();
  return setMinutes(setHours(today, hours), minutes);
};

// Mock class schedule data
export const getTodayClasses = (role: "student" | "faculty"): ClassSchedule[] => {
  const now = new Date();
  
  return [
    {
      id: "class1",
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      instructor: "Dr. Morgan Faculty",
      start: generateTimeToday(9, 0),
      end: generateTimeToday(10, 30),
      room: "Room 201",
      building: "Science Building"
    },
    {
      id: "class2",
      courseCode: "MATH104",
      courseName: "Linear Algebra",
      instructor: "Dr. Sarah Johnson",
      start: generateTimeToday(11, 0),
      end: generateTimeToday(12, 30),
      room: "Room 105",
      building: "Mathematics Building"
    },
    {
      id: "class3",
      courseCode: "ENG202",
      courseName: "Technical Writing",
      instructor: "Prof. James Wilson",
      start: generateTimeToday(14, 0),
      end: generateTimeToday(15, 30),
      room: "Room 303",
      building: "Arts Building"
    }
  ];
};

// Generate mock attendance records for a month
export const getMonthlyAttendance = (): AttendanceRecord[] => {
  const attendance: AttendanceRecord[] = [];
  const today = new Date();
  const courses = [
    { code: "CS101", name: "Introduction to Computer Science" },
    { code: "MATH104", name: "Linear Algebra" },
    { code: "ENG202", name: "Technical Writing" }
  ];
  
  // Generate one record per day for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // For each course on this day
    courses.forEach((course, index) => {
      // Randomly assign status with more present than others
      const statuses: AttendanceStatus[] = ["present", "present", "present", "late", "absent", "grace"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // If it's today, make most recent classes not yet attended
      let status = randomStatus;
      if (i === 0 && index > 1) {
        status = "absent";
      }
      
      // For demo, make some patterns
      if (i % 7 === 0 && course.code === "MATH104") {
        status = "late";
      }
      
      const entryTime = status !== "absent" 
        ? addHours(setHours(date, 9 + index * 2), Math.random() * 0.5) 
        : undefined;
      
      attendance.push({
        id: `att-${i}-${index}`,
        classId: `class${index+1}`,
        date: setHours(date, 9 + index * 2),
        status,
        entryTime,
        courseCode: course.code,
        courseName: course.name
      });
    });
  }
  
  return attendance;
};

// Notifications
export const getNotifications = (): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: "notif1",
      title: "Missed Check-in",
      message: "You missed the periodic check-in for CS101 at 9:45 AM.",
      timestamp: subDays(now, 0.2),
      read: false,
      type: "warning"
    },
    {
      id: "notif2",
      title: "Attendance Marked",
      message: "You have been marked present for MATH104 today.",
      timestamp: subDays(now, 0.3),
      read: true,
      type: "success"
    },
    {
      id: "notif3",
      title: "Class Reminder",
      message: "Your ENG202 class will start in 15 minutes.",
      timestamp: subDays(now, 0.5),
      read: false,
      type: "info"
    },
    {
      id: "notif4",
      title: "Grace Applied",
      message: "Your attendance for last Wednesday's CS101 has been updated to 'Grace'.",
      timestamp: subDays(now, 1),
      read: true,
      type: "info"
    },
    {
      id: "notif5",
      title: "Issue Report Resolved",
      message: "Your issue report for MATH104 on April 2nd has been resolved.",
      timestamp: subDays(now, 2),
      read: true,
      type: "success"
    }
  ];
};

// Student list for faculty view
export const getStudentList = (): {id: string, name: string, status: AttendanceStatus}[] => {
  return [
    { id: "std1", name: "Alex Johnson", status: "present" },
    { id: "std2", name: "Taylor Smith", status: "present" },
    { id: "std3", name: "Jordan Williams", status: "late" },
    { id: "std4", name: "Casey Brown", status: "absent" },
    { id: "std5", name: "Riley Davis", status: "present" },
    { id: "std6", name: "Avery Miller", status: "grace" },
    { id: "std7", name: "Quinn Wilson", status: "present" },
    { id: "std8", name: "Morgan Taylor", status: "present" },
    { id: "std9", name: "Jamie Rodriguez", status: "late" },
    { id: "std10", name: "Blake Martinez", status: "absent" }
  ];
};
