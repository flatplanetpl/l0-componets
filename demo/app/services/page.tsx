'use client';

import { BookOpen, Users, Video, Calendar, Star, Award } from 'lucide-react';
import Hero from '@/components/general/Hero';
import CTA from '@/components/general/CTA';

const ServicesPage = () => {
  const services = [
    {
      title: "Online Courses",
      description: "Access our comprehensive library of courses taught by industry experts.",
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      features: ["400+ Hours of Content", "Expert Instructors", "Lifetime Access"]
    },
    {
      title: "Mentorship Programs",
      description: "Get personalized guidance from experienced professionals in your field.",
      icon: <Users className="h-10 w-10 text-green-500" />,
      features: ["1-on-1 Sessions", "Career Guidance", "Project Reviews"]
    },
    {
      title: "Live Workshops",
      description: "Join interactive sessions with real-time Q&A and hands-on practice.",
      icon: <Video className="h-10 w-10 text-purple-500" />,
      features: ["Weekly Workshops", "Live Q&A", "Recorded Sessions"]
    },
    {
      title: "Certification Programs",
      description: "Earn recognized certificates to boost your career prospects.",
      icon: <Award className="h-10 w-10 text-yellow-500" />,
      features: ["Industry Recognized", "Career Support", "Portfolio Review"]
    }
  ];

  const benefits = [
    {
      title: "Expert-Led Instruction",
      description: "Learn from industry professionals with years of real-world experience."
    },
    {
      title: "Flexible Learning Schedule",
      description: "Study at your own pace, anytime, anywhere on any device."
    },
    {
      title: "Hands-On Projects",
      description: "Apply your knowledge with practical projects and real-world examples."
    },
    {
      title: "Career Support",
      description: "Get guidance and resources to help advance your career."
    }
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      <Hero 
        title="Our Services"
        subtitle="Comprehensive learning solutions tailored to your needs and career goals."
        ctaText="View Courses"
        ctaAction={() => window.location.href = '/courses'}
        secondaryCtaText="Contact Us"
        secondaryCtaAction={() => window.location.href = '/contact'}
        imageUrl="/api/placeholder/600/400"
        altText="Students learning online"
      />
      
      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Services</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">How We Help You Succeed</p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              We offer a range of educational services designed to help you achieve your learning and career goals.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <div key={index} className="bg-muted/50 p-6 rounded-lg shadow-sm border border-border">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-medium text-foreground">{service.title}</h3>
                    <p className="mt-2 text-muted-foreground">{service.description}</p>
                    <ul className="mt-4 space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-400 mr-2" fill="currentColor" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">Why Our Services Work</p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Star className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">{benefit.title}</h3>
                    <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Success Stories</h2>
              <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">Join Thousands of Successful Alumni</p>
              <p className="mt-4 max-w-3xl text-xl text-muted-foreground">
                Our students have gone on to work at leading companies and start their own successful ventures.
                We're proud to have contributed to their journeys.
              </p>
              <div className="mt-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-lg text-foreground">94% of our students report career benefits</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-lg text-foreground">Average salary increase of 30% after course completion</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-lg text-foreground">Industry-recognized certificates upon completion</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-muted border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center text-muted-foreground">
                Success Stories Image
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTA 
        title="Ready to start learning?" 
        subtitle="Join our community today." 
        primaryButtonText="Get started" 
        primaryButtonAction={() => window.location.href = '/signup'} 
        secondaryButtonText="Contact sales" 
        secondaryButtonAction={() => window.location.href = '/contact'} 
        bgColor="blue" 
      />
    </div>
  );
};

export default ServicesPage;