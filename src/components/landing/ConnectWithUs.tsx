import { Phone, Mail, MapPin, Compass, Sun, Moon, Calendar, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ConnectWithUs() {
  return (
    <section className="pt-16" id="contact">
      <div className="max-w-7xl px-container-margin mx-auto">
        <div className="text-center mb-2xl w-fit mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
            Ready to Transform?
          </h2>
          <p className="font-body-md text-body-md text-secondary max-w-4xl">
            Whether you want to lose weight, build muscle, or improve your overall fitness, our team is here to help. Visit The FitHub Gym, explore our facility, and choose the membership plan that's right for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">

          {/* Left Side: Contact Cards */}
          <div className="flex flex-col gap-lg">
            {/* Card 1: Address */}
            <div className="bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-primary-container/40 transition-colors">
              <div>
                <div className="flex gap-2 items-center">
                  <MapPin className="w-6 h-6 text-primary-container" />
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Address</h3>
                </div>

                <div className="flex gap-4 items-end justify-between mt-2 ml-2 w-full flex-wrap">
                  <p className="font-body-md text-secondary text-sm leading-relaxed mt-2 ml-2">
                    Plot No. 6456, Ward No. 17,Opp. Govt. ITI,<br />
                    Kalambha Road, Narkhed - 441304
                  </p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCTEwNTM0ajBqN6gCALACAA&um=1&ie=UTF8&fb=1&gl=in&sa=X&geocode=KY-RnQyGrdU7MaHJY1UE-nxj&daddr=Plot+no+6456,+Ward+no+17,+opp+Govt+ITI,+Kalambha+Road,+Narkhed+-+441304"
                    className="inline-flex items-end gap-xs text-primary-container hover:text-primary transition-colors text-xs"
                  >
                    Get Directions
                  </a>
                </div>

              </div>

            </div>

            {/* Card 2: Call Us */}
            <div className="bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-primary-container/40 transition-colors">
              <div className="flex gap-2 items-center">
                <Phone className="w-6 h-6 text-primary-container" />
                <div className="flex flex-col items-start">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Call Us</h3>
                  <p className="font-body-md text-secondary text-sm">
                    Have questions about memberships or timings?
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center justify-between mt-2 ml-2 w-full flex-wrap">
                <p className="font-body-md text-white font-semibold text-lg">+91 87888 49529</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://wa.me/918788849529"
                  className="inline-flex items-end gap-xs text-primary-container hover:text-primary transition-colors text-xs"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>


            {/* Card 3: Email Us */}
            <div className="bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-primary-container/40 transition-colors">
              <div className="flex gap-2 items-center">
                <Mail className="w-6 h-6 text-primary-container" />
                <div className="flex flex-col items-start">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Email Us</h3>
                  <p className="font-body-md text-secondary text-sm">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center justify-between mt-2 ml-2 w-full flex-wrap">
                <p className="font-body-md text-white font-semibold text-sm break-all">millennialcorpllp@gmail.com</p>
                <a
                  href="mailto:millennialcorpllp@gmail.com"
                  className="inline-flex items-center gap-xs text-primary-container hover:text-primary transition-colors text-xs"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Operating Hours */}
          <div className="bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-primary-container/40 transition-colors h-full">
            <div>
              <div className="flex gap-2 items-center mb-6">
                <Calendar className="w-6 h-6 text-primary-container" />
                <div className="flex flex-col items-start">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Operating Hours</h3>
                  <p className="font-body-md text-secondary text-sm">
                    Monday – Saturday
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/30">
                      <th className="py-2 text-xs text-primary-container font-semibold uppercase tracking-wider">Session</th>
                      <th className="py-2 text-xs text-primary-container font-semibold uppercase tracking-wider text-right">Timings</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body-md text-secondary">
                    {/* Morning Session */}
                    <tr className="border-b border-outline-variant/20">
                      <td className="py-3 text-white font-semibold flex items-center gap-xs">
                        <Sun className="w-4 h-4 text-primary-container shrink-0" />
                        Morning Session
                      </td>
                      <td className="py-3 text-right text-white font-semibold">6:00 AM – 11:00 AM</td>
                    </tr>
                    <tr className="border-b border-outline-variant/20">
                      <td className="py-2 pl-6 text-xs text-secondary/80 italic">└ Ladies Batch</td>
                      <td className="py-2 text-right text-xs text-secondary/80 italic">6:00 AM – 7:00 AM</td>
                    </tr>

                    {/* Evening Session */}
                    <tr className="border-b border-outline-variant/20">
                      <td className="py-3 text-white font-semibold flex items-center gap-xs">
                        <Moon className="w-4 h-4 text-primary-container shrink-0" />
                        Evening Session
                      </td>
                      <td className="py-3 text-right text-white font-semibold">4:00 PM – 9:00 PM</td>
                    </tr>
                    <tr className="border-b border-outline-variant/20">
                      <td className="py-2 pl-6 text-xs text-secondary/80 italic">└ Ladies Batch</td>
                      <td className="py-2 text-right text-xs text-secondary/80 italic">4:00 PM – 5:00 PM</td>
                    </tr>

                    {/* Sunday */}
                    <tr>
                      <td className="py-3 text-white font-semibold flex items-center gap-xs">
                        <Calendar className="w-4 h-4 text-primary-container shrink-0" />
                        Sunday
                      </td>
                      <td className="py-3 text-right text-red-500 font-bold uppercase tracking-wider text-xs">Closed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map layout directly below contact panels - pointing to Narkher address iframe, grayscale, bounce pin removed */}
      <div className="w-full h-96 border-t border-[#323232] relative mt-16 overflow-hidden">
        <iframe
          src="https://maps.google.com/maps?q=Plot%20no%206456,%20Ward%20no%2017,%20opp%20Govt%20ITI,%20Kalambha%20Road,%20Narkhed%20-%20441304&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0 grayscale opacity-80 contrast-125"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="absolute bottom-lg left-1/2 -translate-x-1/2 bg-[#181818] border border-[#323232] px-lg py-md rounded-xl shadow-lg backdrop-blur-md flex items-center gap-md z-10">
          <Compass className="w-5 h-5 text-primary-container animate-spin" style={{ animationDuration: "6s" }} />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCTEwNTM0ajBqN6gCALACAA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KY-RnQyGrdU7MaHJY1UE-nxj&daddr=Plot+no+6456,+Ward+no+17,+opp+Govt+ITI,+Kalambha+Road,+Narkhed+-+441304"
            className="font-label-md text-xs md:text-sm font-bold text-white hover:text-primary transition-colors"
          >
            Find Us on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
