import Link from "next/link";
import { Dumbbell, Eye, Bolt, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const trainers = [
    {
      name: "Marcus Vance",
      role: "Strength & Biomechanics",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMBvI_hikfJs2L0qR1WRsZplHteH2BJj7o8jPZkLSfdsDHhDYfY5SypJaGDZqDAR-tubRGHLvewAC0R5oIM8J-2iM5UfaxlI-A293mf8gxItpGcRWmLjoAGBnCm-O0A8NFyqR1r5XkGd88wDMqB4TWCqU2AHhqG5nZfEl1b0HaibnC3TXmAYoMU6VB7KYc04rpzW36_SusAXWYt3UHpVQTMlJN66Lw6UWBv9gSTtpvvgcqODCBKk4HVqCGreARAeURCDdiCCRMcSw"
    },
    {
      name: "Elena Rostova",
      role: "Functional Kinetics",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLeYRqpSmXlDE-fau7msHg-l4ziYgzgdfArc9aWNNIt81eiGh21SSaYp6ff4_ZYh3Pix6PDCXZqatfMGeRWBdbnDzs1iVdOUP3gJVoVp8fCFCKa7XDtxGmdKETLXYoMLQ8jy6EJIkqwBzlZaz77VpIjzsG33RIITCqQH9Un1dHcAP4sKYrNmLNskEKrXoZuK0hBYbiuRhgFFfxXnT6vnHor8p-VvKA3Dy0gF7696BFj1a3wa3q5C58QKgX633tg7BO0T0UNsmc1wc"
    },
    {
      name: "Julian Thorne",
      role: "Combat Conditioning",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTj5hB4uNqrQ5z8fOWnbKfTDrsZJHC69h6Rms7K95HpG5xBqf8NW5iQdkMfKalHp7VeV-xPkmPR7FzNZ5F7bLqgiIiLPCMwvBXl-kJh6ThXGMyiyUKDuMi50hQSW4WEK6VsLoR0JHsuYb_z9HuAH26o8QjaXF2ImcDaMk_vPX2pWe4U9QL-QHtFuMaA1YV7yDLxt8Lw6Nb7Q7U5JapKJp6niY0dcjBW_qmc0zCkUXEhxLGjJpnZwyHfLfC2ocj6hDX9yuJXJLb5OU"
    },
    {
      name: "Sarah Jenkins",
      role: "Olympic Lifting",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9nCDhrEzJ29WUxYGwjpnnwJTgKPTYDoYu0l5HhYILfuNxecFLnzQhBt0AHgjYY5g6n6LgeUyfDsdm5DhudRDdTAhhQwIRz2breBp9r9qLgSqwZJ1DqS9iwFh0IxSDWeB5SIP7NafPQAms8uTwcpLoFUKLpgJWyeSeXKXv6nHBq4KRBdS68kyGFELqfjbDHsJINg5ylfxEWBsPp4Za81P4PPUriWJ_b_f4mjVGA4WYmMGRzyt6mawQf5BFGOJMgJaKXyse47x7R8U"
    }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      {/* Navigation Header */}
      <header className="w-full h-20 border-b border-outline-variant bg-surface/90 backdrop-blur-md sticky top-0 z-50 px-lg md:px-container-margin flex justify-between items-center">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-container" />
          </div>
          <span className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">THE FITHUB</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-xl font-label-md text-label-md text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/about" className="hover:text-primary transition-colors text-primary font-bold">About Us</Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-md">
          <Link 
            href="/auth/login" 
            className="border border-[#323232] text-white hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold px-lg py-sm rounded-xl"
          >
            Admin Portal
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col w-full max-w-full">
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3xl px-lg md:px-container-margin py-2xl md:py-3xl max-w-7xl mx-auto items-center">
          <div className="flex flex-col gap-lg">
            <h1 className="font-display text-5xl font-extrabold text-white uppercase tracking-tight leading-tight">
              Our Obsession with Performance
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              We don&apos;t just build gyms; we engineer environments for peak human output. The FitHub Gym was born from a singular, uncompromising vision: to fuse the precision of elite sports science with the sophisticated aesthetics of modern high-contrast design.
            </p>
            <p className="font-body-md text-body-md text-secondary">
              Every piece of equipment, every lighting choice, and every structural space in our facility serves a purpose. We strip away the unnecessary, leaving only the raw, functional elements required to elevate your physical capabilities. This is a sanctuary for the dedicated, engineered for zero distractions.
            </p>
          </div>
          <div className="relative w-full h-[450px] lg:h-[550px] rounded-xl overflow-hidden border border-outline-variant bg-surface-container flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center grayscale opacity-65" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJBJSowq-lFfuTyySW4g1P171wqu3TbRlFssLU0dA0ikV0unctQBydzxky0I5-FtNi8SChedCgMc6_VEUQenjfXW7jWPJp32KhQSp85QV2cgnej_XqrMf8brYLfoFSVkPR0fxMdyitR9q1WkQ00J4MM7fIGVGLqAHk5g404vKJNeXFqAwjgey4TK2xIThoZyXo3wTbQWI1dLYBXuMge6t7jePy5EwZ3PH0h1NnK1A_b8CB2n3qVAd15AifZbTHpJuDTgBTigGXBb0')" }}></div>
            <div className="z-10 text-center p-lg">
              <Dumbbell className="w-12 h-12 text-primary-container mx-auto mb-md" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Uncompromising Standards</h3>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-surface border-y border-outline-variant py-2xl">
          <div className="max-w-7xl mx-auto px-lg md:px-container-margin grid grid-cols-1 md:grid-cols-2 gap-xl">
            {/* Vision */}
            <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md group hover:border-primary-container transition-all">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-white">The Vision</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                To redefine the standard of physical conditioning by creating an architectural space dedicated solely to elite performance. We envision a space where the environment itself acts as a catalyst for breaking personal barriers, devoid of compromise.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md group hover:border-primary-container transition-all">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                <Bolt className="w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-white">The Mission</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                To equip driven individuals with the absolute pinnacle of functional machinery, clean tracking logic, and an atmosphere of relentless focus. We provide the tools; you provide the effort. We manage the space so you can build your strength.
              </p>
            </div>
          </div>
        </section>

        {/* Trainers Showcase */}
        <section className="max-w-7xl mx-auto px-lg md:px-container-margin py-2xl md:py-3xl">
          <div className="flex flex-col gap-sm mb-xl text-center md:text-left">
            <h2 className="font-display text-4xl font-extrabold text-white uppercase tracking-tight">The Architects of Performance</h2>
            <p className="font-body-md text-body-md text-secondary max-w-2xl">
              Our professional staff represents the elite tier of conditioning, sports biomechanics, and technical fitness coordination.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {trainers.map((trainer) => (
              <div key={trainer.name} className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col gap-md group hover:border-primary-container transition-all">
                <div className="w-full h-64 overflow-hidden rounded-lg relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    alt={trainer.name} 
                    src={trainer.image} 
                  />
                </div>
                <div>
                  <h4 className="font-headline-md text-xl font-bold text-white">{trainer.name}</h4>
                  <p className="font-label-md text-xs text-primary-container uppercase tracking-widest mt-xs">{trainer.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant py-xl">
        <div className="max-w-7xl mx-auto px-lg md:px-container-margin flex flex-col md:flex-row justify-between items-center gap-lg text-center md:text-left">
          <div>
            <span className="font-extrabold text-primary text-lg">THE FITHUB GYM</span>
            <p className="text-secondary text-xs mt-xs">© 2026 The FitHub Gym. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-xl text-sm text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="hover:text-primary transition-colors text-primary font-bold">About Us</Link>
            <Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/auth/login" className="hover:text-primary transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
