import { Card, CardContent } from "@/components/ui/card";
import { Building, Car, Shield, Users, DollarSign, Search, Star, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Building,
      title: "Building Advertisements",
      description: "List your building's exterior walls, rooftops, and prime locations for brand advertising with competitive pricing."
    },
    {
      icon: Car,
      title: "Vehicle Ad Spaces",
      description: "Monetize your vehicle fleet with mobile advertising opportunities. Perfect for taxis, trucks, and commercial vehicles."
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Safe payment processing with 50% advance and 50% completion model. All transactions are protected and verified."
    },
    {
      icon: Users,
      title: "Easy Management",
      description: "User-friendly dashboard for both owners and brands. Manage listings, bookings, and communications effortlessly."
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Set your own rates and negotiate deals. Our platform ensures fair pricing for both property owners and advertisers."
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Advanced filtering by location, size, price, and type. Find the perfect advertising space that matches your requirements."
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Transparent review and rating system builds trust between owners and brands for long-term partnerships."
    },
    {
      icon: Clock,
      title: "Quick Approval",
      description: "Fast approval process with instant notifications. Start your advertising campaign within days, not weeks."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why Choose Adora?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional platform designed for seamless advertisement space rental with advanced features and secure transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-primary flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;