-- Create user profile types
CREATE TYPE public.user_role AS ENUM ('building_owner', 'vehicle_owner', 'brand_company', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'building_owner',
  avatar_url TEXT,
  bio TEXT,
  company_name TEXT,
  website TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create advertising spaces table
CREATE TABLE public.advertising_spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  space_type TEXT NOT NULL CHECK (space_type IN ('building_wall', 'building_lobby', 'building_exterior', 'vehicle_exterior', 'vehicle_interior')),
  location TEXT NOT NULL,
  coordinates POINT,
  dimensions TEXT, -- e.g., "10x5 meters"
  price_per_month DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'booked', 'maintenance')),
  images TEXT[], -- Array of image URLs
  amenities TEXT[], -- Array of amenities
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for advertising spaces
ALTER TABLE public.advertising_spaces ENABLE ROW LEVEL SECURITY;

-- Create policies for advertising spaces
CREATE POLICY "Anyone can view available advertising spaces" 
ON public.advertising_spaces 
FOR SELECT 
USING (true);

CREATE POLICY "Owners can insert their own spaces" 
ON public.advertising_spaces 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own spaces" 
ON public.advertising_spaces 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own spaces" 
ON public.advertising_spaces 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID NOT NULL REFERENCES public.advertising_spaces(id) ON DELETE CASCADE,
  advertiser_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  campaign_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = advertiser_id OR auth.uid() IN (
  SELECT owner_id FROM public.advertising_spaces WHERE id = space_id
));

CREATE POLICY "Advertisers can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = advertiser_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = advertiser_id OR auth.uid() IN (
  SELECT owner_id FROM public.advertising_spaces WHERE id = space_id
));

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'building_owner')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advertising_spaces_updated_at
  BEFORE UPDATE ON public.advertising_spaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('advertising-images', 'advertising-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view advertising images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'advertising-images');

CREATE POLICY "Authenticated users can upload advertising images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'advertising-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'advertising-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'advertising-images' AND auth.uid()::text = (storage.foldername(name))[1]);