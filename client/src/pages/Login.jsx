import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Calendar, ArrowRight, Github } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    if (success) navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="p-2 bg-primary text-white rounded-lg">
                <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">EventHive</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                
              </div>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <Button className="w-full h-11 text-base bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : (
                <>
                  Sign in <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-[#F5F3FF] relative items-center justify-center px-12">
        <div className="max-w-xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg mb-8">
                <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Amazing Events</h1>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Join thousands of event enthusiasts. Create, discover, and attend events that matter to you.
            </p>
            
            <div className="grid grid-cols-3 gap-8 border-t border-gray-200/60 pt-8">
                <div>
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-gray-500 mt-1">Events</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-gray-500 mt-1">Users</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div className="text-sm text-gray-500 mt-1">Cities</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}