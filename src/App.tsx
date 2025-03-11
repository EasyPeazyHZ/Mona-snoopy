import React, { useState, useEffect } from 'react';
import { Twitter, Wallet, ArrowDown, Check } from 'lucide-react';
import { supabase } from './lib/supabase';

interface Submission {
  id: string;
  twitter_handle: string;
  wallet_address: string;
  created_at: string;
}

function App() {
  const [formData, setFormData] = useState({
    twitter_handle: '',
    wallet_address: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Remove @ symbol if present
      const cleanTwitterHandle = formData.twitter_handle.startsWith('@') 
        ? formData.twitter_handle.substring(1) 
        : formData.twitter_handle;

      const { error: insertError } = await supabase
        .from('submissions')
        .insert([{
          twitter_handle: cleanTwitterHandle,
          wallet_address: formData.wallet_address
        }]);

      if (insertError) {
        throw insertError;
      }

      setShowSuccess(true);
      setFormData({ twitter_handle: '', wallet_address: '' });
      await fetchSubmissions();

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    document.querySelector('#waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2070"
          alt="Abstract Art Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-black/90" />
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideDown">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 shadow-lg flex items-center gap-3 pr-6">
            <div className="bg-white rounded-full p-1">
              <Check className="w-5 h-5 text-green-500 animate-checkmark" />
            </div>
            <p className="font-medium">Successfully submitted! Welcome to Mona Snoopy.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slideDown">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 shadow-lg flex items-center gap-3 pr-6">
            <div className="bg-white rounded-full p-1">
              <Check className="w-5 h-5 text-red-500 animate-checkmark" />
            </div>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 animate-glow" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-rotate" />
              <img 
                src="/snoopy.png"
                alt="Mona Snoopy"
                className="w-48 h-48 relative rounded-full object-cover animate-float transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="space-y-6 max-w-3xl mx-auto">
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-text relative">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-600/20 blur-xl animate-pulse"></span>
                Mona Snoopy NFT Collection
              </h1>
              <div className="space-y-4 transform transition-all duration-300 hover:scale-105">
                <p className="text-xl max-w-2xl mx-auto text-gray-300">
                  Mona Snoopy brings back the nostalgia of the old days, blending classic art with modern creativity. Built on the Monad blockchain, Snoopy takes a trip down memory lane, reimagined for the digital age.
                </p>
                <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 blur-lg animate-shimmer"></span>
                  Minting soon. Stay tuned!
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <div className="px-6 py-3 bg-purple-600/20 backdrop-blur-sm rounded-xl border border-purple-500/30 animate-float transform transition-all duration-300 hover:scale-110 hover:bg-purple-600/30">
                  <p className="text-2xl font-bold">TBA</p>
                  <p className="text-sm text-gray-400">Total Supply</p>
                </div>
                <div className="px-6 py-3 bg-pink-600/20 backdrop-blur-sm rounded-xl border border-pink-500/30 animate-float-delayed transform transition-all duration-300 hover:scale-110 hover:bg-pink-600/30">
                  <p className="text-2xl font-bold">TBA</p>
                  <p className="text-sm text-gray-400">Launch Date</p>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex justify-center gap-6 mt-8">
                <a
                  href="https://x.com/Mona_Snoopy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative transform transition-all duration-300 hover:scale-110"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
                  <div className="relative px-6 py-3 bg-black rounded-lg leading-none flex items-center">
                    <Twitter className="w-6 h-6 text-purple-400 group-hover:text-pink-400 transition-colors duration-200" />
                  </div>
                </a>
                <button
                  onClick={scrollToForm}
                  className="group relative transform transition-all duration-300 hover:scale-110"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
                  <div className="relative px-6 py-3 bg-black rounded-lg leading-none flex items-center">
                    <ArrowDown className="w-6 h-6 text-pink-400 group-hover:text-purple-400 transition-colors duration-200 animate-bounce" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div id="waitlist-form" className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto transform transition-all duration-500 hover:scale-105">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 animate-glow"></div>
              <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-text">Join the Waitlist</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="transform transition-all duration-300 hover:translate-x-2">
                    <label className="flex items-center text-sm font-medium mb-2 text-purple-300">
                      <Twitter className="w-4 h-4 mr-2 animate-pulse" />
                      Twitter Handle
                    </label>
                    <input
                      type="text"
                      value={formData.twitter_handle}
                      onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                      placeholder="@username"
                      className="w-full px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-300/50 transition-all duration-300 focus:scale-105"
                      required
                    />
                  </div>
                  
                  <div className="transform transition-all duration-300 hover:translate-x-2">
                    <label className="flex items-center text-sm font-medium mb-2 text-purple-300">
                      <Wallet className="w-4 h-4 mr-2 animate-pulse" />
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={formData.wallet_address}
                      onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-300/50 transition-all duration-300 focus:scale-105"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium 
                      relative group overflow-hidden transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-shimmer"></span>
                    <span className="relative">{isLoading ? 'Submitting...' : 'Submit'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 pb-8">
          <div className="relative max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-lg opacity-30"></div>
            <div className="relative py-2 px-4 bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/20">
              <p className="text-center text-gray-300">
                © 2025 Mona Snoopy NFT Collection. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;