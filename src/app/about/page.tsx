import { Metadata } from "next";
import { auth } from "@/auth";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AboutContainer from "@/components/about/AboutContainer";

export const metadata: Metadata = {
  title: "About Us | The FitHub Gym",
  description: "Learn more about The FitHub Gym, our trainers, facilities, mission, vision, and commitment to helping the Narkhed community achieve their fitness goals.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | The FitHub Gym",
    description: "Learn more about The FitHub Gym, our trainers, facilities, mission, vision, and commitment to helping the Narkhed community achieve their fitness goals.",
    url: "https://fithubgym.in/about",
    images: [
      {
        url: "/assets/gallery/hero.webp",
        width: 1200,
        height: 630,
        alt: "About The FitHub Gym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | The FitHub Gym",
    description: "Learn more about The FitHub Gym, our trainers, facilities, mission, vision, and commitment to helping the Narkhed community achieve their fitness goals.",
    images: ["/assets/gallery/hero.webp"],
  },
};

export default async function AboutPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="bg-background text-on-background min-h-screen font-sans antialiased overflow-x-hidden relative selection:bg-primary-container selection:text-on-primary-container flex flex-col justify-between">
      {/* Global Header */}
      <Header isLoggedIn={isLoggedIn} />

      {/* Main Content Area */}
      <main className="pt-20 flex-grow">
        <AboutContainer />
      </main>

      {/* Global Footer */}
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
