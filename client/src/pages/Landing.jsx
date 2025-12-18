import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Check, Users, Zap, Shield, Sparkles, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <div className="p-1.5 bg-primary rounded-lg text-white shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <span>
              Event<span className="text-primary">Hive</span>
            </span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button className="font-medium shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto max-w-4xl">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Now with AI-powered event descriptions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gray-900 leading-[1.1]">
            Create & Discover <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Amazing Events</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The modern event platform for creating, managing, and attending events. 
            Built with powerful RSVP management and real-time capacity tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-105">
                Start for Free <ArrowRight className="ml-2 w-5 h-5"/>
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:text-gray-900 transition-all">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Free to start</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> No credit card</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100/50">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-gray-500 font-medium">Events Created</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-gray-500 font-medium">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-sm text-gray-500 font-medium">Uptime</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-sm text-gray-500 font-medium">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to <span className="text-primary">host events</span>
            </h2>
            <p className="text-lg text-gray-500">
              From creation to management, we've got you covered with powerful features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Layout, 
                title: "Easy Event Creation", 
                desc: "Create stunning events in minutes with our intuitive interface and AI-powered descriptions." 
              },
              { 
                icon: Users, 
                title: "Smart RSVP System", 
                desc: "Real-time capacity tracking prevents overbooking and ensures smooth event management." 
              },
              { 
                icon: Zap, 
                title: "Lightning Fast", 
                desc: "Built for speed with instant updates, real-time notifications, and seamless interactions." 
              },
              { 
                icon: Shield, 
                title: "Secure & Reliable", 
                desc: "Enterprise-grade security with JWT authentication and data protection." 
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <f.icon className="w-6 h-6"/>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to host your first event?</h2>
              <p className="text-gray-300 text-lg mb-10">
                Join thousands of event organizers who trust EventHive for their events.
              </p>
              <Link to="/signup">
                <Button size="lg" className="h-14 px-8 text-lg bg-white text-gray-900 hover:bg-gray-100 hover:text-primary transition-colors font-bold rounded-full">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-gray-100 text-center text-gray-400 text-sm bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <div className="p-1 bg-primary rounded text-white">
              <Calendar className="w-3 h-3" />
            </div>
            EventHive
          </div>
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}