import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building, Car, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";

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

const SearchSpaces = () => {
  const [searchParams] = useSearchParams();
  const [spaces, setSpaces] = useState<AdvertisingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
  const [selectedState, setSelectedState] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("advertising_spaces")
        .select("*")
        .eq("availability_status", "available");

      if (searchLocation) {
        query = query.ilike("location", `%${searchLocation}%`);
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
      } else {
        setSpaces(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [searchLocation, selectedState, spaceType, priceRange]);

  const getSpaceTypeIcon = (type: string) => {
    return type === "building" ? Building : Car;
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
              Discover premium advertising opportunities across India
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search location..."
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
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
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
                  
                  return (
                    <Card key={space.id} className="overflow-hidden hover:shadow-medium transition-all duration-300">
                      <div className="aspect-video bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                        {space.images && space.images.length > 0 ? (
                          <img 
                            src={space.images[0]} 
                            alt={space.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <SpaceIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-1">{space.title}</CardTitle>
                          <Badge variant="secondary">
                            <SpaceIcon className="h-3 w-3 mr-1" />
                            {space.space_type}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {space.location}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {space.description}
                          </p>
                          
                          {space.dimensions && (
                            <p className="text-sm font-medium">
                              Dimensions: {space.dimensions}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-primary">
                              ₹{space.price_per_month?.toLocaleString()}/month
                            </div>
                            <Button size="sm">
                              View Details
                            </Button>
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

export default SearchSpaces;