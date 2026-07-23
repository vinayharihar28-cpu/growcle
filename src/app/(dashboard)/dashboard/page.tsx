"use client";

import { Users, UserPlus, Percent, Calendar as CalendarIcon, ChevronDown, CheckCircle2, XCircle, TrendingUp, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const attendanceData = [
  { date: "07 Jun", value: 30 },
  { date: "14 Jun", value: 45 },
  { date: "21 Jun", value: 65 },
  { date: "28 Jun", value: 50 },
  { date: "05 Jul", value: 20 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm">Real-time performance and engagement metrics for the Arjuna Chapter.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-background">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today, 26 Jul 2026
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Members</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">81</div>
            <p className="text-xs text-green-500 font-medium mt-1">
              +4% vs LW
            </p>
            <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[70%]"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Visitors</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md">
              <UserPlus className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">120</div>
            <p className="text-xs text-green-500 font-medium mt-1">
              +12% vs LM
            </p>
            <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 w-[50%]"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Attendance %</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md">
              <Percent className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">92%</div>
            <p className="text-xs text-red-500 font-medium mt-1">
              -2% vs LM
            </p>
            <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-green-600 w-[92%]"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Upcoming Meetings</CardTitle>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
              <CalendarIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold">04</div>
              <span className="text-xs text-muted-foreground font-medium">Next: Aug 02</span>
            </div>
            <div className="flex items-center gap-[-8px] mt-4">
              {['JD', 'AS', 'RK'].map((init, i) => (
                <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background ${i===0 ? 'bg-blue-500' : i===1 ? 'bg-purple-500' : 'bg-green-500'} ${i > 0 ? '-ml-2' : ''}`}>
                  {init}
                </div>
              ))}
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border-2 border-background -ml-2">
                +5
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Members Present Per Week</CardTitle>
            <div className="flex bg-secondary rounded-md p-1">
              <button className="px-3 py-1 text-xs font-medium bg-background shadow-sm rounded">Weekly</button>
              <button className="px-3 py-1 text-xs font-medium text-muted-foreground rounded hover:text-foreground">Monthly</button>
            </div>
          </CardHeader>
          <CardContent className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Payment Trend</CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>UPI</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Cash</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Advance</div>
            </div>
          </CardHeader>
          <CardContent className="h-[250px] mt-4 flex items-end justify-center pb-8 text-sm text-muted-foreground">
            {/* Chart placeholder */}
            Chart visualization goes here
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-secondary/50 rounded-t-xl pb-4 pt-4 border-b">
          <div>
            <CardTitle className="text-base font-bold">Meeting Session Overview</CardTitle>
            <CardDescription className="text-xs">Current active session: Meeting 1 of 8</CardDescription>
          </div>
          <div className="flex items-center bg-background rounded-md border">
            <button className="px-3 py-1.5 hover:bg-secondary border-r">&lt;</button>
            <span className="px-4 py-1.5 text-sm font-medium">Sun, 26 Jul 2026</span>
            <button className="px-3 py-1.5 hover:bg-secondary border-l">&gt;</button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Present</p>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">0 Members | 0 Visitors</p>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Absent</p>
                <p className="text-3xl font-bold">201</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Active tracking enabled</p>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Yield</p>
                <p className="text-3xl font-bold">0%</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Overall completion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold">Recent Member Activities</CardTitle>
          <Button variant="link" className="text-primary text-sm font-medium pr-0">View All Activities</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="text-left font-medium p-3 rounded-tl-lg">Member</th>
                  <th className="text-left font-medium p-3">Action</th>
                  <th className="text-left font-medium p-3">Date & Time</th>
                  <th className="text-left font-medium p-3">Status</th>
                  <th className="text-right font-medium p-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">RK</div>
                    <div>
                      <p className="font-semibold text-foreground">Rahul Kapoor</p>
                      <p className="text-xs text-muted-foreground">Membership Renewal</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">Paid Annual Fee</td>
                  <td className="p-3 text-muted-foreground">Today, 10:45 AM</td>
                  <td className="p-3">
                    <Badge variant="success" className="rounded-full bg-green-100 text-green-700 font-bold px-3 uppercase text-[10px]">Completed</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">AM</div>
                    <div>
                      <p className="font-semibold text-foreground">Ananya Mishra</p>
                      <p className="text-xs text-muted-foreground">Visitor Entry</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">Joined Arjuna Chapter</td>
                  <td className="p-3 text-muted-foreground">Yesterday, 04:20 PM</td>
                  <td className="p-3">
                    <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-700 font-bold px-3 uppercase text-[10px]">Pending Approval</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">VS</div>
                    <div>
                      <p className="font-semibold text-foreground">Vikram Singh</p>
                      <p className="text-xs text-muted-foreground">Profile Update</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">Changed Contact Details</td>
                  <td className="p-3 text-muted-foreground">24 Jul, 11:30 AM</td>
                  <td className="p-3">
                    <Badge variant="success" className="rounded-full bg-green-100 text-green-700 font-bold px-3 uppercase text-[10px]">Verified</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
