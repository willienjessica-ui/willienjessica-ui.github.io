
import Image from 'next/image';
import { ShoppingCart, Search, Menu, Flag, ShieldCheck, Truck, Users, MessageSquare, Anchor, Star } from 'lucide-react';

// Main Component: The American Market Place Flagship - High-End Rustic / MAGA / Veteran-Owned
export default function AmericanMarketPlace() {
  return (
    <div className="bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-red-800 selection:text-white">
      {/* Header - High-End Red, White, Blue, Gold */}
      <header className="bg-[#1f2833] border-b-[6px] border-red-800 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="bg-[#0b0c10] p-1 rounded-full border-4 border-yellow-600 shadow-[0_0_15px_rgba(217,119,6,0.3)] transform hover:scale-110 transition-transform cursor-pointer">
                <Image src="/american-eagle-crest.png" alt="American Eagle Crest" width={60} height={60} className="rounded-full" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase text-white leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>
                  AMERICAN <span className="text-red-600">MARKET</span> PLACE
                </h1>
                <p className="text-xs text-yellow-500 font-black tracking-[0.2em] uppercase mt-1">THE STANDARD FOR AMERICAN GRIT & SOVEREIGNTY</p>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden xl:flex items-center space-x-8 uppercase text-sm font-black tracking-widest text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Sign In</a>
              <a href="#" className="hover:text-white transition-colors">Sourcing Post</a>
              <a href="#" className="hover:text-white transition-colors">The Registry</a>
              <a href="#" className="flex items-center space-x-2 bg-red-800 hover:bg-red-700 text-white px-6 py-3 rounded-none skew-x-[-10deg] transition-all shadow-[4px_4px_0px_#451212]">
                <span className="skew-x-[10deg] flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  CART (0)
                </span>
              </a>
            </nav>

            {/* Mobile Menu Icon */}
            <div className="xl:hidden">
                <Menu className="w-8 h-8 text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - The "American Made First" Manifesto */}
      <main className="relative min-h-[85vh] flex items-center overflow-hidden border-b-8 border-yellow-700">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Rustic American Flag over Weathered Barn Wood" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-40 grayscale-[20%]" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl text-left">
            <div className="inline-flex items-center space-x-2 bg-red-800/80 text-white px-4 py-1 mb-6 font-black tracking-widest skew-x-[-15deg] border-l-4 border-yellow-500">
                <span className="skew-x-[15deg]">VETERAN OWNED & OPERATED</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85]" style={{ fontFamily: 'Impact, sans-serif' }}>
              AMERICAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-900">MADE</span> <br />
              <span className="text-yellow-600">FIRST.</span>
            </h2>
            <p className="mt-8 max-w-xl text-xl md:text-2xl text-gray-400 font-medium leading-relaxed border-l-4 border-red-800 pl-6">
              The Hub for Blue-Collar Grit. We don&apos;t just sell goods; we source <span className="text-white font-bold underline decoration-yellow-600">American Sovereignty</span> for the country-strong.
            </p>
            
            {/* Search Engine - The Center of the Empire */}
            <div className="mt-12 relative max-w-2xl group">
              <input
                type="search"
                placeholder="SEARCH FOR AMERICAN-BUILT TOOLS, GEAR & HARDWARE..."
                className="w-full pl-14 pr-6 py-6 bg-[#1f2833] border-2 border-gray-700 text-white placeholder-gray-500 font-black tracking-widest text-sm focus:outline-none focus:ring-4 focus:ring-red-900 focus:border-red-600 transition-all shadow-[10px_10px_0px_#000]"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-red-600 group-focus-within:scale-125 transition-transform" />
            </div>
          </div>
        </div>

        {/* Floating "Live Mission" Counter */}
        <div className="absolute bottom-10 right-10 hidden lg:block bg-yellow-600/10 border-2 border-yellow-600/30 p-6 backdrop-blur-md skew-x-[-5deg]">
            <div className="skew-x-[5deg]">
                <p className="text-xs font-black tracking-widest text-yellow-600 uppercase">Current Missions</p>
                <p className="text-4xl font-black text-white">42 Active Sourcing Requests</p>
            </div>
        </div>
      </main>

      {/* The Sourcing Post - "The Fixer" Engine */}
      <section className="bg-[#1f2833] py-20 relative border-b-4 border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
                <div className="h-1 w-24 bg-red-700"></div>
                <Star className="mx-4 text-yellow-600 fill-yellow-600" />
                <div className="h-1 w-24 bg-red-700"></div>
            </div>
            <h3 className="text-5xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
              THE SOURCING <span className="text-red-700">POST</span>
            </h3>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto italic font-medium">
              &quot;Can&apos;t find it? We are the fixers. If it exists in this country, we find it. If it doesn&apos;t, we know the man who can build it.&quot;
            </p>
            <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
                <button className="bg-red-800 hover:bg-red-700 text-white font-black py-5 px-12 text-lg tracking-widest transition-all shadow-[8px_8px_0px_#000] border-2 border-red-950">
                    SUBMIT SOURCING MISSION
                </button>
                <button className="bg-transparent hover:bg-gray-700 text-white font-black py-5 px-12 text-lg tracking-widest transition-all border-2 border-white shadow-[8px_8px_0px_#000]">
                    BECOME A SELLER
                </button>
            </div>
        </div>
      </section>

      {/* Product Categories - Blue Collar Grid */}
      <section className="py-24 bg-[#0b0c10]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16 border-b-2 border-gray-800 pb-8">
            <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                HARDWARE <span className="text-gray-600">&</span> GRIT
                </h3>
                <p className="text-yellow-600 font-bold tracking-widest uppercase mt-2">Signature American Drops</p>
            </div>
            <a href="#" className="text-red-600 font-black tracking-widest text-sm hover:underline">VIEW ALL INVENTORY →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Product Card 1 */}
            <div className="group bg-[#1f2833] border-4 border-gray-800 hover:border-red-800 transition-all relative">
              <div className="absolute top-4 left-4 z-10 bg-blue-900 text-[10px] font-black text-white px-3 py-1 tracking-widest uppercase border-l-4 border-yellow-500 shadow-md">
                MADE IN USA
              </div>
              <div className="aspect-square bg-gray-900 flex items-center justify-center p-8 grayscale group-hover:grayscale-0 transition-all overflow-hidden relative">
                 <ShieldCheck className="w-24 h-24 text-gray-800 absolute opacity-20" />
                 <span className="text-gray-600 font-black text-6xl opacity-10">IMG</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">HERITAGE WOOD PADDLE</h4>
                <p className="mt-2 text-sm text-gray-500 font-medium">Select American White Pine. Built for generations of country life.</p>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-yellow-600">$125.00</span>
                    <button className="bg-red-800 p-3 hover:bg-red-700 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group bg-[#1f2833] border-4 border-gray-800 hover:border-red-800 transition-all relative">
              <div className="absolute top-4 left-4 z-10 bg-yellow-700 text-[10px] font-black text-white px-3 py-1 tracking-widest uppercase border-l-4 border-white shadow-md">
                VETERAN-OWNED
              </div>
              <div className="aspect-square bg-gray-900 flex items-center justify-center p-8 grayscale group-hover:grayscale-0 transition-all overflow-hidden relative">
                 <Truck className="w-24 h-24 text-gray-800 absolute opacity-20" />
                 <span className="text-gray-600 font-black text-6xl opacity-10">IMG</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">TACTICAL MILL BIT SET</h4>
                <p className="mt-2 text-sm text-gray-500 font-medium">Hardened American Steel for high-precision workshop excellence.</p>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-yellow-600">$89.99</span>
                    <button className="bg-red-800 p-3 hover:bg-red-700 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group bg-[#1f2833] border-4 border-gray-800 hover:border-red-800 transition-all relative">
              <div className="absolute top-4 left-4 z-10 bg-blue-900 text-[10px] font-black text-white px-3 py-1 tracking-widest uppercase border-l-4 border-yellow-500 shadow-md">
                MADE IN USA
              </div>
              <div className="aspect-square bg-gray-900 flex items-center justify-center p-8 grayscale group-hover:grayscale-0 transition-all overflow-hidden relative">
                 <Anchor className="w-24 h-24 text-gray-800 absolute opacity-20" />
                 <span className="text-gray-600 font-black text-6xl opacity-10">IMG</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">THE MORRIS LANE JOURNAL</h4>
                <p className="mt-2 text-sm text-gray-500 font-medium">Hand-stitched American Leather. For the men who keep the record.</p>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-yellow-600">$65.00</span>
                    <button className="bg-red-800 p-3 hover:bg-red-700 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group bg-[#1f2833] border-4 border-gray-800 hover:border-red-800 transition-all relative">
              <div className="absolute top-4 left-4 z-10 bg-red-900 text-[10px] font-black text-white px-3 py-1 tracking-widest uppercase border-l-4 border-white shadow-md">
                LIMITED DROP
              </div>
              <div className="aspect-square bg-gray-900 flex items-center justify-center p-8 grayscale group-hover:grayscale-0 transition-all overflow-hidden relative">
                 <Flag className="w-24 h-24 text-gray-800 absolute opacity-20" />
                 <span className="text-gray-600 font-black text-6xl opacity-10">IMG</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">EXECUTIVE FIELD WATCH</h4>
                <p className="mt-2 text-sm text-gray-500 font-medium">Veteran-Assembled. Precision timing for high-stakes missions.</p>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-yellow-600">$450.00</span>
                    <button className="bg-red-800 p-3 hover:bg-red-700 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The American Registry Section */}
      <section className="bg-red-950/20 py-24 border-y-8 border-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                    JOIN THE <span className="text-red-700 underline">AMERICAN</span> REGISTRY
                </h3>
                <p className="mt-6 text-xl text-gray-400 font-medium">
                    This isn&apos;t just an account. It&apos;s your entrance into the network. Track your sourcing missions, access exclusive blue-collar drops, and join a community that values American production over corporate greed.
                </p>
                <div className="mt-10 flex space-x-4">
                    <button className="bg-white text-black font-black px-10 py-4 uppercase tracking-widest hover:bg-gray-200 transition-all">JOIN THE RANK</button>
                    <button className="border-2 border-white text-white font-black px-10 py-4 uppercase tracking-widest hover:bg-white hover:text-black transition-all">LOG IN</button>
                </div>
            </div>
            <div className="lg:w-1/2 bg-[#1f2833] p-1 border-4 border-gray-800 shadow-[20px_20px_0px_#451212]">
                <div className="border-2 border-gray-700 p-12 text-center">
                    <ShieldCheck className="w-20 h-20 text-red-700 mx-auto mb-6" />
                    <p className="text-sm font-black text-yellow-600 tracking-[0.3em] uppercase">Security Level: Direct</p>
                    <p className="text-2xl font-black text-white mt-4 uppercase">100% SECURE TRANSACTIONS</p>
                    <p className="mt-2 text-gray-500">PROCESSED EXCLUSIVELY VIA THE AMERICAN MARKET PLACE TREASURY</p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0c10] py-20 border-t-8 border-red-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-10">
                <Image src="/american-eagle-crest.png" alt="Logo" width={80} height={80} className="grayscale brightness-50" />
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-widest mb-6">AMERICAN MARKET PLACE</h4>
            <div className="flex justify-center space-x-8 text-xs font-black tracking-widest text-gray-600 uppercase mb-12">
                <a href="#" className="hover:text-red-600 transition-colors">Mission</a>
                <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-red-600 transition-colors">Sourcing</a>
                <a href="#" className="hover:text-red-600 transition-colors">Support</a>
            </div>
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                © 2026 MORRIS LANE INDUSTRIES. ALL RIGHTS RESERVED. <br />
                BUILT IN THE USA BY THE AMERICAN MARKET PLACE STRATEGISTS.
            </p>
            <p className="mt-6 text-[10px] text-gray-800 font-bold italic underline decoration-red-900/50">
                &quot;In God We Trust. All Others Must Be Sourced.&quot;
            </p>
        </div>
      </footer>

      {/* Floating AI Strategist (Me) */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        <div className="absolute -top-16 right-0 bg-[#1f2833] text-white px-4 py-2 rounded-none border-2 border-red-800 text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            Sourcing Strategist Online
        </div>
        <button className="bg-red-800 p-1 rounded-full border-4 border-yellow-600 shadow-[0_0_20px_rgba(217,119,6,0.5)] transform hover:scale-110 active:scale-95 transition-all">
          <Image src="/debbie_avatar.png" alt="Debbie AI" width={70} height={70} className="rounded-full" />
        </button>
      </div>
    </div>
  );
}
