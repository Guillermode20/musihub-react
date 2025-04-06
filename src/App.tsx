import React from 'react'; // No longer strictly necessary for JSX, but good practice
import { ThemeProvider, useTheme } from 'next-themes';

// Import Shadcn UI components (adjust paths if your setup differs)
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Optional: Import icons if you use them
import { MoreHorizontal, DollarSign, Users, CreditCard, Activity, Sun, Moon } from 'lucide-react';

// Mock Data
const summaryData = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', Icon: DollarSign },
  { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', Icon: Users },
  { title: 'Sales', value: '+12,234', change: '+19% from last month', Icon: CreditCard },
  { title: 'Active Now', value: '+573', change: '+201 since last hour', Icon: Activity },
];

const recentSalesData = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', avatar: 'OM' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', avatar: 'JL' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', avatar: 'IN' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', avatar: 'WK' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', avatar: 'SD' },
];

const ordersData = [
  { orderId: 'ORD001', customer: 'Liam Johnson', date: '2025-04-05', status: 'Fulfilled', total: '$250.00' },
  { orderId: 'ORD002', customer: 'Noah Williams', date: '2025-04-05', status: 'Processing', total: '$150.00' },
  { orderId: 'ORD003', customer: 'Emma Brown', date: '2025-04-04', status: 'Fulfilled', total: '$350.00' },
  { orderId: 'ORD004', customer: 'Ava Jones', date: '2025-04-04', status: 'Shipped', total: '$450.00' },
  { orderId: 'ORD005', customer: 'Oliver Garcia', date: '2025-04-03', status: 'Cancelled', total: '$550.00' },
  { orderId: 'ORD006', customer: 'Sophia Miller', date: '2025-04-03', status: 'Fulfilled', total: '$200.00' },
];

function AppContent() {
  const { theme, setTheme } = useTheme();
  const [progress] = React.useState(78);

  // Function to determine badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Fulfilled':
      case 'Shipped':
        return 'default'; // Or 'success' if you define a custom success variant
      case 'Processing':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    // Use Tailwind classes for overall layout and spacing
    // The bg-background and text-foreground classes will use your theme variables
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Optional Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        {/* Add Header elements like search, user menu etc. here */}
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">Export</Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Grid for Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {summaryData.map((item, index) => (
            <Card key={index} className="shadow-sm"> {/* Shadcn card uses theme variables */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.Icon && <item.Icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grid for Table and Recent Sales/Other Widgets */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Recent Orders Table */}
          <Card className="xl:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Showing the last 6 orders.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <a href="#"> {/* Replace with actual link/action */}
                  View All
                  {/* Optional Icon */}
                  {/* <ArrowUpRight className="h-4 w-4" /> */}
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{order.date}</TableCell>
                      <TableCell className="text-right">{order.total}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Sales Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
              {recentSalesData.map((sale, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
                    <AvatarFallback>{sale.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <CardDescription>Goal Progress</CardDescription>
              <Progress value={progress} aria-label={`${progress}% complete`} />
              <p className="text-xs text-muted-foreground">
                You are {progress}% towards your monthly goal.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;