import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Building, 
  Car, 
  Briefcase, 
  Calendar, 
  IndianRupee,
  Eye,
  UserCheck,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
  company_name?: string;
  phone?: string;
  verification_status: string;
  created_at: string;
}

interface AdvertisingSpace {
  id: string;
  title: string;
  location: string;
  space_type: string;
  price_per_month: number;
  owner_id: string;
  availability_status: string;
  created_at: string;
}

interface Booking {
  id: string;
  space_id: string;
  advertiser_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [spaces, setSpaces] = useState<AdvertisingSpace[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Fetch all advertising spaces
      const { data: spacesData } = await supabase
        .from("advertising_spaces")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Fetch all bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      setProfiles(profilesData || []);
      setSpaces(spacesData || []);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'building_owner':
        return { icon: Building, label: 'Building Owner', color: 'bg-primary' };
      case 'vehicle_owner':
        return { icon: Car, label: 'Vehicle Owner', color: 'bg-secondary' };
      case 'brand_company':
        return { icon: Briefcase, label: 'Brand/Company', color: 'bg-accent' };
      default:
        return { icon: Users, label: 'User', color: 'bg-muted' };
    }
  };

  const stats = {
    totalUsers: profiles.length,
    buildingOwners: profiles.filter(p => p.role === 'building_owner').length,
    vehicleOwners: profiles.filter(p => p.role === 'vehicle_owner').length,
    brandCompanies: profiles.filter(p => p.role === 'brand_company').length,
    totalSpaces: spaces.length,
    activeSpaces: spaces.filter(s => s.availability_status === 'available').length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            ADora Admin Dashboard
          </h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Spaces</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSpaces}</div>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalSpaces} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b">
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users ({stats.totalUsers})
            </Button>
            <Button
              variant={activeTab === "spaces" ? "default" : "ghost"}
              onClick={() => setActiveTab("spaces")}
            >
              <Building className="h-4 w-4 mr-2" />
              Spaces ({stats.totalSpaces})
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              onClick={() => setActiveTab("bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Bookings ({stats.totalBookings})
            </Button>
          </div>

          {/* Content */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profiles.map((profile) => {
                    const roleInfo = getRoleInfo(profile.role);
                    const RoleIcon = roleInfo.icon;
                    
                    return (
                      <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {profile.first_name?.[0]}{profile.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {profile.first_name} {profile.last_name}
                            </div>
                            {profile.company_name && (
                              <div className="text-sm text-muted-foreground">
                                {profile.company_name}
                              </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              {profile.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <RoleIcon className="h-3 w-3" />
                            <span>{roleInfo.label}</span>
                          </Badge>
                          <Badge variant={profile.verification_status === 'verified' ? 'default' : 'outline'}>
                            {profile.verification_status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "spaces" && (
            <Card>
              <CardHeader>
                <CardTitle>All Advertising Spaces</CardTitle>
                <CardDescription>Manage all listed spaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spaces.map((space) => (
                    <div key={space.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                          {space.space_type === "building" ? (
                            <Building className="h-6 w-6 text-primary" />
                          ) : (
                            <Car className="h-6 w-6 text-secondary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{space.title}</div>
                          <div className="text-sm text-muted-foreground">{space.location}</div>
                          <div className="text-sm font-medium text-primary">
                            ₹{space.price_per_month?.toLocaleString()}/month
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={space.availability_status === 'available' ? 'default' : 'secondary'}>
                          {space.availability_status}
                        </Badge>
                        <Badge variant="outline">
                          {space.space_type}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "bookings" && (
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage all bookings and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Booking #{booking.id.slice(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-medium text-primary">
                            ₹{booking.total_amount?.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'outline'}>
                            {booking.booking_status}
                          </Badge>
                          <Badge variant={booking.payment_status === 'paid' ? 'default' : 'destructive'}>
                            {booking.payment_status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;