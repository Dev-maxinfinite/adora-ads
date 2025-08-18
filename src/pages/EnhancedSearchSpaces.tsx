import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Building, 
  Car, 
  Filter, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  IndianRupee,
  Eye,
  Heart,
  Share2,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";

interface AdvertisingSpace {
  id: string;
  title: string;
  location: string;
  space_type: string;
  price_per_month: number;
  description: string;
  dimensions: string;
  images: string[];
  availability_status: string;
  amenities: string[];
  owner_id: string;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
    company_name: string;
    avatar_url: string;
    verification_status: string;
  };
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
];

const EnhancedSearchSpaces = () => {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [spaces, setSpaces] = useState<AdvertisingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
  const [selectedState, setSelectedState] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Enhanced search with owner details
  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("advertising_spaces")
        .select(`
          *,
          profiles!advertising_spaces_owner_id_fkey (
            first_name,
            last_name,
            phone,
            company_name,
            avatar_url,
            verification_status
          )
        `)
        .eq("availability_status", "available");

      if (searchLocation.trim()) {
        query = query.or(`location.ilike.%${searchLocation}%,title.ilike.%${searchLocation}%`);
      }

      if (selectedState) {
        query = query.ilike("location", `%${selectedState}%`);
      }

      if (spaceType) {
        query = query.eq("space_type", spaceType);
      }

      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          query = query.gte("price_per_month", min).lte("price_per_month", max);
        } else {
          query = query.gte("price_per_month", min);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching spaces:", error);
        toast({
          title: "Error",
          description: "Failed to load spaces",
          variant: "destructive",
        });
      } else {
        setSpaces(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error", 
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchLocation, selectedState, spaceType, priceRange, toast]);

  // Debounced search for better performance
  const debouncedFetchSpaces = useMemo(
    () => debounce(fetchSpaces, 300),
    [fetchSpaces]
  );

  useEffect(() => {
    debouncedFetchSpaces();
    return () => {
      debouncedFetchSpaces.cancel();
    };
  }, [debouncedFetchSpaces]);

  const getSpaceTypeIcon = (type: string) => {
    return type === "building" ? Building : Car;
  };

  const isOwner = profile?.role === 'building_owner' || profile?.role === 'vehicle_owner';
  const isCustomer = profile?.role === 'brand_company';

  const handleContactOwner = (space: AdvertisingSpace) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to contact space owners",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Contact Owner",
      description: `Contacting ${space.profiles?.first_name} ${space.profiles?.last_name}`,
    });
  };

  const toggleFavorite = (spaceId: string) => {
    if (!user) {
      toast({
        title: "Login Required", 
        description: "Please login to save favorites",
        variant: "destructive",
      });
      return;
    }

    setFavorites(prev => 
      prev.includes(spaceId) 
        ? prev.filter(id => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Perfect <span className="bg-gradient-primary bg-clip-text text-transparent">ADora</span> Spaces
            </h1>
            <p className="text-muted-foreground text-lg">
              {isOwner ? "Explore competitor spaces and market rates" : 
               isCustomer ? "Discover premium advertising opportunities" :
               "Discover premium advertising opportunities across India"}
            </p>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Smart Search & Filter
              </CardTitle>
              <CardDescription>
                {loading ? "Searching..." : `Found ${spaces.length} space${spaces.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search location, title..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedState && (
                      <SelectItem value="" onSelect={() => setSelectedState("")}>
                        All States
                      </SelectItem>
                    )}
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={spaceType} onValueChange={setSpaceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Space Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaceType && (
                      <SelectItem value="" onSelect={() => setSpaceType("")}>
                        All Types
                      </SelectItem>
                    )}
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRange && (
                      <SelectItem value="" onSelect={() => setPriceRange("")}>
                        Any Price
                      </SelectItem>
                    )}
                    <SelectItem value="0-10000">₹0 - ₹10,000</SelectItem>
                    <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                    <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="50000">₹50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Finding perfect spaces for you...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No spaces found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              ) : (
                spaces.map((space) => {
                  const SpaceIcon = getSpaceTypeIcon(space.space_type);
                  const isFavorite = favorites.includes(space.id);
                  const isMySpace = user?.id === space.owner_id;
                  
                  return (
                    <Card key={space.id} className={`overflow-hidden hover:shadow-medium transition-all duration-300 ${isMySpace ? 'ring-2 ring-primary/20' : ''}`}>
                      <div className="aspect-video bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center relative">
                        {space.images && space.images.length > 0 ? (
                          <img 
                            src={space.images[0]} 
                            alt={space.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <SpaceIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                        
                        {/* Action buttons */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {user && !isMySpace && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0"
                              onClick={() => toggleFavorite(space.id)}
                            >
                              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                          )}
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {isMySpace && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="default">Your Space</Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-1 text-lg">{space.title}</CardTitle>
                          <Badge variant="secondary" className="ml-2">
                            <SpaceIcon className="h-3 w-3 mr-1" />
                            {space.space_type}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{space.location}</span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {space.description}
                        </p>
                        
                        {space.dimensions && (
                          <p className="text-sm font-medium">
                            <strong>Dimensions:</strong> {space.dimensions}
                          </p>
                        )}

                        {/* Owner Info - Show based on user type */}
                        {space.profiles && !isMySpace && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={space.profiles.avatar_url} />
                              <AvatarFallback>
                                {space.profiles.first_name?.[0]}{space.profiles.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">
                                  {space.profiles.first_name} {space.profiles.last_name}
                                </p>
                                {space.profiles.verification_status === 'verified' && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                )}
                              </div>
                              {space.profiles.company_name && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {space.profiles.company_name}
                                </p>
                              )}
                              {isCustomer && space.profiles.phone && (
                                <p className="text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3 inline mr-1" />
                                  {space.profiles.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-primary flex items-center">
                              <IndianRupee className="h-5 w-5" />
                              {space.price_per_month?.toLocaleString()}
                              <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
                            </div>
                            {isOwner && (
                              <p className="text-xs text-muted-foreground">
                                Market rate analysis available
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!isMySpace && user && (
                              <Button 
                                size="sm"
                                onClick={() => handleContactOwner(space)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {space.amenities && space.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {space.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {space.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{space.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Listed {new Date(space.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EnhancedSearchSpaces;