import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of property owners and brands who trust Adora for their advertising needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Property Owners */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Property Owners
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              List your building or vehicle space and start earning from advertisements. 
              Set your own rates and connect with premium brands.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 w-full"
              onClick={() => navigate('/register?type=owner')}
            >
              List Your Space
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Brands/Companies */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Brands & Companies
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Find premium advertising spaces that match your brand requirements. 
              Advanced search and verified listings for your campaigns.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary w-full"
              onClick={() => navigate('/register?type=brand')}
            >
              Find Ad Spaces
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Verified Listings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;