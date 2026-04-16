import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function HoldingPage() {
  return (
    <main className="min-h-screen bg-navy text-white flex items-center">
      <div className="max-w-3xl mx-auto w-full px-[5%] py-16">
        <div className="bg-navy-light border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
          <p className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            Cabbie Training
          </p>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-tight mb-3">
            Website update in progress
          </h1>
          <p className="text-text-muted text-sm md:text-base leading-relaxed mb-4">
            We&apos;re currently updating the website. For bookings and enquiries,
            please contact Wendy directly using the details below.
          </p>
          <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8">
            Book your Passenger Assistance Training (PAT) course—professionally
            accredited training for taxi and private hire drivers covering disability
            awareness and wheelchair assistance.
          </p>

          <div className="space-y-3 mb-8">
            <a
              href="tel:07739320050"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy px-4 py-3 text-sm text-text-primary no-underline hover:border-accent-blue/50 transition-colors"
            >
              <Phone className="w-4 h-4 text-accent-blue" />
              07739 320050
            </a>
            <a
              href="mailto:info@cabbietraining.co.uk"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy px-4 py-3 text-sm text-text-primary no-underline hover:border-accent-blue/50 transition-colors"
            >
              <Mail className="w-4 h-4 text-accent-blue" />
              info@cabbietraining.co.uk
            </a>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy px-4 py-3 text-sm text-text-primary">
              <MapPin className="w-4 h-4 text-accent-blue" />
              Cottis House, Locks Hills, South Street, Rochford, Essex, SS4 1BB
            </div>
          </div>

          <div className="bg-navy border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/total training uk.svg"
                  alt="Total Training UK"
                  width={120}
                  height={40}
                  className="brightness-0 invert opacity-70"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-text-muted leading-relaxed">
                  Training delivered in partnership with <span className="text-white font-semibold">Total Training UK</span>.
                  Fully accredited programme with RoSPA assured driver training element,
                  ensuring quality and recognition across the UK.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-text-muted">
            Admin access: <Link href="/login" className="text-accent-blue hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
