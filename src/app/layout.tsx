import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingElements from "@/components/landing/FloatingElements";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "The FitHub Gym - Premium Unisex Fitness Center in Narkhed",
    template: "%s | The FitHub Gym"
  },
  description: "Achieve your fitness goals at The FitHub Gym in Narkhed. Featuring modern strength and cardio equipment, expert trainer guidance, dedicated ladies batches, and premium couple memberships.",
  keywords: ["gym", "fitness center", "unisex gym", "Narkhed gym", "FitHub Gym", "ladies batch gym", "couple membership gym", "workout", "weight training", "cardio", "personal training"],
  metadataBase: new URL("https://fithubgym.in"),
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fithubgym.in",
    title: "The FitHub Gym - Premium Unisex Fitness Center in Narkhed",
    description: "Achieve your fitness goals at The FitHub Gym in Narkhed. Modern equipment, expert trainer guidance, dedicated ladies batches, and couple membership plans.",
    siteName: "The FitHub Gym",
  },
  twitter: {
    card: "summary_large_image",
    title: "The FitHub Gym - Premium Unisex Fitness Center in Narkhed",
    description: "Achieve your fitness goals at The FitHub Gym in Narkhed. Modern equipment, expert trainer guidance, dedicated ladies batches, and couple membership plans.",
  }
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        {/* Material Symbols Outlined for UI icons */}
        <meta name="apple-mobile-web-app-title" content="FitHub Gym" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ExerciseGym",
              "name": "The FitHub Gym",
              "image": "https://fithubgym.in/assets/gallery/hero.webp",
              "@id": "https://fithubgym.in/#gym",
              "url": "https://fithubgym.in",
              "telephone": "+918788849529",
              "email": "millennialcorpllp@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plot No. 6456, Ward No. 17, Opp. Govt. ITI, Kalambha Road",
                "addressLocality": "Narkhed",
                "addressRegion": "Maharashtra",
                "postalCode": "441304",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "21.4693",
                "longitude": "78.5303"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "06:00",
                  "closes": "11:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "16:00",
                  "closes": "21:00"
                }
              ],
              "sameAs": [
                "https://www.instagram.com/thefithubgym.narkhed",
                "https://wa.me/918788849529",
                "https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCTEwNTM0ajBqN6gCALACAA&um=1&ie=UTF8&fb=1&gl=in&sa=X&geocode=KY-RnQyGrdU7MaHJY1UE-nxj&daddr=Plot+no+6456,+Ward+no+17,+opp+Govt+ITI,+Kalambha+Road,+Narkhed+-+441304"
              ]
            })
          }}
        />
      </head>
      <body className="bg-background text-on-background min-h-screen font-sans antialiased">
        <Suspense fallback={null}>
          {children}
          <FloatingElements />
        </Suspense>
      </body>
    </html>
  );
}
