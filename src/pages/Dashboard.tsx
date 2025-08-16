import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Building, Car, Briefcase, Settings, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "See you next time!",
    });
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
        return { icon: User, label: 'User', color: 'bg-muted' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const roleInfo = getRoleInfo(profile.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Adora Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-bold">
              Welcome back, {profile.first_name}!
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <RoleIcon className="h-3 w-3" />
                <span>{roleInfo.label}</span>
              </Badge>
              <Badge variant={profile.verification_status === 'verified' ? 'default' : 'outline'}>
                {profile.verification_status}
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Profile Settings</span>
                </CardTitle>
                <CardDescription>
                  Update your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {(profile.role === 'building_owner' || profile.role === 'vehicle_owner') && (
              <Card className="gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add Space</span>
                  </CardTitle>
                  <CardDescription>
                    List a new advertising space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Create Listing
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RoleIcon className="h-5 w-5" />
                  <span>
                    {profile.role === 'brand_company' ? 'Browse Spaces' : 'My Listings'}
                  </span>
                </CardTitle>
                <CardDescription>
                  {profile.role === 'brand_company' 
                    ? 'Find advertising opportunities' 
                    : 'Manage your advertising spaces'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity to display.</p>
                <p className="text-sm mt-2">
                  Start by creating your first listing or browsing available spaces.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;