'use client';

import { useState } from 'react';
import { Play, BookOpen, ChevronRight } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Navigation from '@/components/general/Navigation';
import Hero from '@/components/general/Hero';
import Stats from '@/components/general/Stats';
import Features from '@/components/general/Features';
import TestimonialSlider from '@/components/general/TestimonialSlider';
import CourseCard from '@/components/general/CourseCard';
import CTA from '@/components/general/CTA';

const courses = [
  {
    id: 1,
    title: "React Fundamentals",
    instructor: "John Doe",
    rating: 4.8,
    students: 1240,
    image: "/api/placeholder/400/225",
    price: 49.99,
    category: "Programming"
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    instructor: "Jane Smith",
    rating: 4.9,
    students: 890,
    image: "/api/placeholder/400/225",
    price: 59.99,
    category: "Programming"
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    instructor: "Robert Johnson",
    rating: 4.7,
    students: 560,
    image: "/api/placeholder/400/225",
    price: 69.99,
    category: "Design"
  },
  {
    id: 4,
    title: "Python for Beginners",
    instructor: "Emily Davis",
    rating: 4.9,
    students: 2100,
    image: "/api/placeholder/400/225",
    price: 39.99,
    category: "Programming"
  },
  {
    id: 5,
    title: "Data Science Basics",
    instructor: "Michael Wilson",
    rating: 4.5,
    students: 780,
    image: "/api/placeholder/400/225",
    price: 79.99,
    category: "Data Science"
  },
  {
    id: 6,
    title: "Mobile App Development",
    instructor: "Sarah Johnson",
    rating: 4.3,
    students: 320,
    image: "/api/placeholder/400/225",
    price: 89.99,
    category: "Mobile"
  },
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

const navItems = [
  { name: "Home", href: "#" },
  { name: "Courses", href: "#" },
  { name: "Instructors", href: "#" },
  { name: "Pricing", href: "#" }
];

const Home = () => {
  const { data: session, status } = useSession();

  const handleCtaClick = () => {
    if (status === 'authenticated') {
      window.location.href = '/admin/dashboard';
    } else {
      signIn('google');
    }
  };

  const handleWatchDemo = () => {
    // Demo action
    console.log('Watch demo clicked');
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Navigation */}
      <Navigation navItems={navItems} ctaText="Sign in" />
      
      {/* Hero Section */}
      <Hero 
        title="Expand your knowledge with EduPlatform"
        subtitle="Learn from industry experts with our comprehensive courses. Access over 200 courses and grow your skills from anywhere, anytime."
        ctaText="Browse Courses"
        ctaAction={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
        secondaryCtaText="Watch Demo"
        secondaryCtaAction={handleWatchDemo}
        imageUrl="/images/hero-edu.svg"
        altText="Illustration of students learning online"
      />

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <Stats stats={stats} />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">Why choose EduPlatform</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We provide the best learning experience with our carefully crafted features
            </p>
          </div>
          <div className="mt-10">
            <Features features={features} />
          </div>
        </div>
      </div>

      {/* Testimonial Slider */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">What our students say</p>
          </div>
          <div className="mt-10">
            <TestimonialSlider testimonials={testimonials} />
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses" className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Courses</h2>
            <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">Popular courses</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explore our most popular courses taught by industry experts
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              View All Courses
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTA 
        title="Ready to start learning?" 
        subtitle="Join our community today." 
        primaryButtonText="Get started" 
        primaryButtonAction={handleCtaClick} 
        secondaryButtonText="Learn more" 
        secondaryButtonAction={() => {}} 
        bgColor="blue" 
      />

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Marketing</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Analytics</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Commerce</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Insights</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Guides</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">API Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">About</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Jobs</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Claim</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">&copy; 2023 EduPlatform, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
