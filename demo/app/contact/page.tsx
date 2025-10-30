'use client';

import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import Hero from '@/components/general/Hero';

const ContactPage = () => {
  const contactMethods = [
    {
      icon: 'Mail',
      title: "Email",
      value: "support@eduplatform.example.com",
      description: "Send us an email and we'll respond as soon as possible",
      color: "text-blue-500"
    },
    {
      icon: 'Phone',
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 5pm EST",
      color: "text-green-500"
    },
    {
      icon: 'MapPin',
      title: "Office",
      value: "123 Education St, Learning City, LC 12345",
      description: "Visit us during business hours",
      color: "text-red-500"
    },
    {
      icon: 'Clock',
      title: "Support Hours",
      value: "24/7 Online Support",
      description: "Chat with our support team anytime",
      color: "text-yellow-500"
    }
  ];

  const renderIcon = (iconName: string, color: string) => {
    const className = `h-6 w-6 ${color}`;
    switch (iconName) {
      case 'Mail': return <Mail className={className} />;
      case 'Phone': return <Phone className={className} />;
      case 'MapPin': return <MapPin className={className} />;
      case 'Clock': return <Clock className={className} />;
      default: return <div className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <Hero 
        title="Contact Us"
        subtitle="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        ctaText="Send Message"
        ctaAction={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
        secondaryCtaText="View FAQ"
        secondaryCtaAction={() => {}}
        imageUrl="/api/placeholder/600/400"
        altText="Contact us image"
      />
      
      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              <p className="mt-4 text-muted-foreground">
                We're here to answer any questions you may have about our courses, services, or how to get started with online learning. 
                Our team is available around the clock to assist you.
              </p>
              
              <div className="mt-8 space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      {renderIcon(method.icon, method.color)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-foreground">{method.title}</h3>
                      <p className="text-muted-foreground">{method.value}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
              <form id="contact-form" className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              Can't find the answer you're looking for? Reach out to our customer success team.
            </p>
          </div>

          <div className="mt-12">
            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              <div className="py-6">
                <h3 className="text-lg leading-6 font-medium text-foreground">How do I access my courses after purchase?</h3>
                <div className="mt-2">
                  <p className="text-base text-muted-foreground">
                    After purchase, all courses are immediately available in your dashboard. You can access them anytime, anywhere on any device.
                  </p>
                </div>
              </div>
              <div className="py-6">
                <h3 className="text-lg leading-6 font-medium text-foreground">Can I get a refund if I'm not satisfied?</h3>
                <div className="mt-2">
                  <p className="text-base text-muted-foreground">
                    Yes, we offer a 30-day money-back guarantee on all courses. If you're not satisfied with your purchase, contact our support team for a full refund.
                  </p>
                </div>
              </div>
              <div className="py-6">
                <h3 className="text-lg leading-6 font-medium text-foreground">Do you offer corporate training programs?</h3>
                <div className="mt-2">
                  <p className="text-base text-muted-foreground">
                    Absolutely! We offer customized corporate training programs for businesses of all sizes. Contact our sales team to discuss your specific needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;