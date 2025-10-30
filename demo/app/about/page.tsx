'use client';

import { Play, Users, BookOpen, Star } from 'lucide-react';
import Hero from '@/components/general/Hero';
import Stats from '@/components/general/Stats';
import Features from '@/components/general/Features';
import TestimonialSlider from '@/components/general/TestimonialSlider';

const AboutPage = () => {
  const stats = [
    { number: "50K+", label: "Students" },
    { number: "200+", label: "Courses" },
    { number: "98%", label: "Satisfaction" },
    { number: "24/7", label: "Support" }
  ];

  const features = [
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience.",
      icon: "👨‍🏫"
    },
    {
      title: "Interactive Content",
      description: "Engage with hands-on projects and real-world examples.",
      icon: "💻"
    },
    {
      title: "Lifetime Access",
      description: "Access your courses anytime, anywhere on any device.",
      icon: "🔓"
    },
    {
      title: "Community Support",
      description: "Connect with other learners and get help when needed.",
      icon: "💬"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Frontend Developer",
      content: "The React course helped me land my dream job. The instructor explained complex concepts in a simple way.",
      rating: 5
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "UI Designer",
      content: "The UI/UX course completely transformed my approach to design. Highly recommend it!",
      rating: 5
    },
    {
      id: 3,
      name: "David Chen",
      role: "Software Engineer",
      content: "The JavaScript course was challenging but rewarding. I feel much more confident in my skills now.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      <Hero 
        title="About EduPlatform"
        subtitle="We're on a mission to make high-quality education accessible to everyone, everywhere."
        ctaText="Explore Courses"
        ctaAction={() => window.location.href = '/courses'}
        secondaryCtaText="Watch Demo"
        secondaryCtaAction={() => console.log('Watch demo clicked')}
        imageUrl="/api/placeholder/600/400"
        altText="EduPlatform team working together"
      />
      
      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Story</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              Transforming Education Through Technology
            </p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              Founded in 2020, EduPlatform has been at the forefront of online learning, helping over 50,000 students advance their careers.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-foreground">Our Mission</h3>
                <p className="mt-2 text-muted-foreground">
                  To democratize education by providing high-quality, affordable, and accessible learning opportunities to people around the world.
                </p>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-foreground">Our Vision</h3>
                <p className="mt-2 text-muted-foreground">
                  To create a world where everyone has equal access to education and can achieve their full potential regardless of their background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">Our Numbers Speak for Themselves</p>
          </div>
          <div className="mt-10">
            <Stats stats={stats} />
          </div>
        </div>
      </div>

      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">What Makes Us Different</p>
          </div>
          <div className="mt-10">
            <Features features={features} />
          </div>
        </div>
      </div>

      <div className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">What Our Students Say</p>
          </div>
          <div className="mt-10">
            <TestimonialSlider testimonials={testimonials} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;