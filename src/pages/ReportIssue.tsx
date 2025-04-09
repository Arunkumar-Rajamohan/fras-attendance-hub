
import { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, CalendarIcon, ThumbsUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock past issues for display
const pastIssues = [
  {
    id: "issue1",
    date: new Date(2024, 3, 1),
    course: "CS101",
    status: "resolved",
    reason: "Face recognition system failed to detect me at entrance",
    response: "Verified with security camera footage. Attendance corrected.",
  },
  {
    id: "issue2",
    date: new Date(2024, 2, 25),
    course: "MATH104",
    status: "pending",
    reason: "Bluetooth beacon not working during class",
    response: null,
  },
];

const ReportIssue = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [course, setCourse] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!course) {
      toast.error("Please select a course");
      return;
    }
    
    if (!time) {
      toast.error("Please enter a time");
      return;
    }
    
    if (reason.length < 10) {
      toast.error("Please provide a detailed reason for the issue");
      return;
    }
    
    // Submit form (mock)
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Issue report submitted successfully");
      // Reset form
      setDate(new Date());
      setCourse("");
      setReason("");
      setTime("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Report Attendance Issue</h1>
          <p className="text-gray-500">
            Submit a request to review attendance issues
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>New Issue Report</CardTitle>
                <CardDescription>
                  Provide details about the attendance issue you experienced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date of Issue</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time of Issue</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select value={course} onValueChange={setCourse}>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS101">CS101 - Introduction to Computer Science</SelectItem>
                        <SelectItem value="MATH104">MATH104 - Linear Algebra</SelectItem>
                        <SelectItem value="ENG202">ENG202 - Technical Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Issue</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide details about the attendance issue..."
                      rows={5}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Be specific and include any relevant details that might help in resolving the issue.
                    </p>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Important</p>
                      <p className="text-sm text-amber-700 mt-1">
                        False reports are considered a violation of academic integrity. 
                        Please ensure all information provided is accurate and truthful.
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-fras-blue hover:bg-fras-blue-light"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Previous Reports</CardTitle>
                <CardDescription>
                  Status of your past attendance issue reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastIssues.map((issue) => (
                    <div key={issue.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{issue.course}</h3>
                          <p className="text-sm text-gray-500">
                            {format(issue.date, "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge className={
                          issue.status === "resolved" 
                            ? "bg-fras-status-present" 
                            : "bg-fras-status-late"
                        }>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-sm mb-3">
                        <span className="font-medium">Reason:</span> {issue.reason}
                      </p>
                      {issue.response && (
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <div className="flex gap-2 items-center mb-1">
                            <ThumbsUp className="h-4 w-4 text-fras-blue" />
                            <span className="font-medium">Response:</span>
                          </div>
                          {issue.response}
                        </div>
                      )}
                    </div>
                  ))}

                  {pastIssues.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                      You haven't submitted any issues yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportIssue;
