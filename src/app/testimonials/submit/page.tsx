import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import TestimonialForm from "./TestimonialForm";
import { auth } from "@/auth";

export const metadata = {
  title: "Submit Testimonial | The FitHub Gym",
  description: "Share your fitness journey and review your training experience at The FitHub Gym.",
};

export default async function TestimonialSubmitPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="bg-background text-on-background min-h-screen font-sans antialiased overflow-x-hidden relative selection:bg-primary-container selection:text-on-primary-container">
      <Header isLoggedIn={isLoggedIn} />

      <main className="pt-32 pb-16 px-container-margin">
        <TestimonialForm />
      </main>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
