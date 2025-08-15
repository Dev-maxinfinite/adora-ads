import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Target, Shield, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize secure transactions and verified listings to build lasting trust between all parties."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where property owners and brands can thrive together."
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "Curated selection of premium advertising spaces that deliver real value for brands."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing exceptional service and continuous platform improvements."
    }
  ];

  const stats = [
    { number: "1000+", label: "Active Listings" },
    { number: "500+", label: "Happy Users" },
    { number: "50+", label: "Cities" },
    { number: "98%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              About Adora
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're revolutionizing the advertising industry by creating seamless connections 
              between property owners and brands, making outdoor advertising accessible, 
              transparent, and profitable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Adora, we believe that every building and vehicle has the potential to become 
                a valuable advertising space. Our mission is to democratize outdoor advertising 
                by providing a professional platform where property owners can monetize their assets 
                and brands can find the perfect spaces for their campaigns.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We're committed to creating win-win situations that benefit both property owners 
                looking to generate additional income and businesses seeking cost-effective, 
                high-impact advertising solutions.
              </p>
            </div>
            <div className="relative animate-scale-in">
              <div className="aspect-square rounded-2xl gradient-primary p-8 flex items-center justify-center">
                <Building className="w-32 h-32 text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">Growing Together</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Adora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-primary flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Platform Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Numbers that reflect our growing community
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Whether you're a property owner looking to monetize your space or a brand 
              seeking premium advertising opportunities, Adora is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/register')}
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;