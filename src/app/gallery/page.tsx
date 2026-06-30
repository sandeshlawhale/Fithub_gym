import { Metadata } from "next";
import { auth } from "@/auth";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FAQSection from "@/components/common/FAQSection";
import GalleryContainer from "@/components/gallery/GalleryContainer";
import { galleryItems } from "@/data/galleryData";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore The FitHub Gym through our photo gallery. Discover modern gym equipment, training spaces, cardio zone, strength area, and the motivating fitness environment in Narkhed.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Gallery | The FitHub Gym",
    description: "Explore The FitHub Gym through our photo gallery. Discover modern gym equipment, training spaces, cardio zone, strength area, and the motivating fitness environment in Narkhed.",
    url: "https://fithubgym.in/gallery",
    images: [
      {
        url: "/assets/gallery/hero.webp",
        width: 1200,
        height: 630,
        alt: "The FitHub Gym Gallery Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | The FitHub Gym",
    description: "Explore The FitHub Gym through our photo gallery. Discover modern gym equipment, training spaces, cardio zone, strength area, and the motivating fitness environment in Narkhed.",
    images: ["/assets/gallery/hero.webp"],
  },
};

export default async function GalleryPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="bg-background text-on-background min-h-screen font-sans antialiased overflow-x-hidden relative selection:bg-primary-container selection:text-on-primary-container flex flex-col justify-between">
      {/* Global Header */}
      <Header isLoggedIn={isLoggedIn} />

      {/* Main Content Area */}
      <main className="pt-20 flex-grow">
        {/* Core Gallery Component */}
        <GalleryContainer initialItems={galleryItems} />

        {/* Reusable FAQ Section */}
        <FAQSection />
      </main>

      {/* Global Footer */}
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
