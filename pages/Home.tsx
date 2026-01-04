import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Wallet,
  Map,
  MapPin,
  Home as HomeIcon,
  PlusCircle
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { HeroAccordion } from '@/components/ui/hero-accordion';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Keep track of your travel dates with our intuitive planning interface.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Sparkles,
      title: "AI Itineraries",
      description: "Let Gemini generate personalized daily activities for any destination.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Wallet,
      title: "Budget Analysis",
      description: "AI-powered budget insights with tips, warnings, and score tracking.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Map,
      title: "Map Preview",
      description: "Visualize your destinations on interactive maps before you go.",
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  const dockItems = [
    { title: "Home", icon: HomeIcon, href: "/" },
    { title: "My Trips", icon: MapPin, href: "/trips" },
    { title: "Create Trip", icon: PlusCircle, href: "/create" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Image Accordion */}
      <HeroAccordion
        title="Your Next Adventure Starts Here"
        subtitle="AI-Powered Travel Planning"
        description="Create stunning itineraries, analyze your budget with AI, and discover new destinations — all in one beautiful app."
        ctaText="Start Planning"
        ctaLink="/create"
      />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 young-serif-regular">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Powerful features designed to make your travel planning effortless and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="group relative bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 fugaz-one-regular">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Start planning your dream trip today with AI-powered insights and beautiful organization.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold rounded-2xl text-blue-600 bg-white hover:bg-blue-50 shadow-2xl transition-all hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              Create Your Trip Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Dock className="items-end pb-3 shadow-2xl">
          {dockItems.map((item, idx) => (
            <Link to={item.href} key={idx}>
              <DockItem className="aspect-square rounded-full bg-white hover:bg-blue-50 border border-slate-200">
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <item.icon className="h-full w-full text-slate-600" />
                </DockIcon>
              </DockItem>
            </Link>
          ))}
        </Dock>
      </div>
    </div>
  );
};

export default Home;
