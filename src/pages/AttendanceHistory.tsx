
import { useState, useEffect } from "react";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceStatus, AttendanceRecord, getMonthlyAttendance } from "@/services/mockData";
import { Filter, CheckCircle2, Clock, AlertCircle, InfoIcon, FileDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: AttendanceStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<AttendanceStatus, { color: string, icon: React.ReactNode }> = {
    present: { color: "bg-fras-status-present text-white", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    absent: { color: "bg-fras-status-absent text-white", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
    late: { color: "bg-fras-status-late text-white", icon: <Clock className="h-3 w-3 mr-1" /> },
    grace: { color: "bg-fras-status-grace text-white", icon: <InfoIcon className="h-3 w-3 mr-1" /> },
  };

  return (
    <Badge className={cn("flex items-center", variants[status].color)}>
      {variants[status].icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCoureFilter] = useState<string>("all");

  useEffect(() => {
    // Fetch attendance records
    const records = getMonthlyAttendance();
    setAttendanceRecords(records);

    // Initial filter
    filterRecords(records, date, statusFilter, courseFilter);
  }, []);

  // When date, status filter, or course filter changes
  useEffect(() => {
    filterRecords(attendanceRecords, date, statusFilter, courseFilter);
  }, [date, statusFilter, courseFilter]);

  const filterRecords = (
    records: AttendanceRecord[],
    selectedDate: Date,
    status: string,
    course: string
  ) => {
    let filtered = records;

    // Filter by date - show only for selected day
    filtered = filtered.filter((record) => {
      return isSameDay(record.date, selectedDate);
    });

    // Filter by status if not "all"
    if (status !== "all") {
      filtered = filtered.filter((record) => record.status === status);
    }

    // Filter by course if not "all"
    if (course !== "all") {
      filtered = filtered.filter((record) => record.courseCode === course);
    }

    setFilteredRecords(filtered);
  };

  // Get unique course codes for the filter
  const uniqueCourses = Array.from(
    new Set(attendanceRecords.map((record) => record.courseCode))
  );

  // Get days with attendance data for the calendar
  const daysWithData = attendanceRecords.map((record) => record.date);

  // Stats for the current date
  const todayStats = {
    present: attendanceRecords.filter(
      r => isSameDay(r.date, date) && r.status === "present"
    ).length,
    late: attendanceRecords.filter(
      r => isSameDay(r.date, date) && r.status === "late"
    ).length,
    absent: attendanceRecords.filter(
      r => isSameDay(r.date, date) && r.status === "absent"
    ).length,
    grace: attendanceRecords.filter(
      r => isSameDay(r.date, date) && r.status === "grace"
    ).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance History</h1>
          <p className="text-gray-500">
            View and filter your attendance records
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar View</CardTitle>
                <CardDescription>Select a date to view attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border"
                  modifiers={{
                    present: daysWithData.filter(d => 
                      attendanceRecords.some(r => 
                        isSameDay(r.date, d) && r.status === "present"
                      )
                    ),
                    late: daysWithData.filter(d => 
                      attendanceRecords.some(r => 
                        isSameDay(r.date, d) && r.status === "late"
                      )
                    ),
                    absent: daysWithData.filter(d => 
                      attendanceRecords.some(r => 
                        isSameDay(r.date, d) && r.status === "absent"
                      )
                    ),
                    grace: daysWithData.filter(d => 
                      attendanceRecords.some(r => 
                        isSameDay(r.date, d) && r.status === "grace"
                      )
                    ),
                  }}
                  modifiersStyles={{
                    present: { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                    late: { backgroundColor: "rgba(245, 158, 11, 0.1)" },
                    absent: { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                    grace: { backgroundColor: "rgba(139, 92, 246, 0.1)" },
                  }}
                />

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Legend:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-fras-status-present"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-fras-status-late"></div>
                      <span>Late</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-fras-status-absent"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-fras-status-grace"></div>
                      <span>Grace</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Day Summary</CardTitle>
                <CardDescription>{format(date, "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Present</span>
                    <Badge className="bg-fras-status-present">
                      {todayStats.present}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Late</span>
                    <Badge className="bg-fras-status-late">
                      {todayStats.late}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Absent</span>
                    <Badge className="bg-fras-status-absent">
                      {todayStats.absent}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Grace</span>
                    <Badge className="bg-fras-status-grace">
                      {todayStats.grace}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Total Classes</span>
                    <span className="font-bold">
                      {todayStats.present + todayStats.late + todayStats.absent + todayStats.grace}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Attendance Records</CardTitle>
                    <CardDescription>
                      {format(date, "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileDown className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="grace">Grace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={courseFilter} onValueChange={setCoureFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {uniqueCourses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Entry Time</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{record.courseCode}</p>
                                <p className="text-sm text-gray-500">
                                  {record.courseName}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(record.date, "h:mm a")}
                            </TableCell>
                            <TableCell>
                              {record.entryTime
                                ? format(record.entryTime, "h:mm a")
                                : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <StatusBadge status={record.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500">
                    <p>No attendance records found for this date.</p>
                    <p className="text-sm mt-1">
                      Try selecting a different date or adjusting the filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceHistory;
