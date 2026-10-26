import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { SimulatedBadge } from '@/components/SimulatedBadge';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Zeycb — AICTE Student Credential Provenance & Proof Pass Registry',
  description:
    'Records that prove themselves. SIH26263 Research Platform for AICTE institutions: multi-source provenance, explicit human reconciliation, and student-authorized selective disclosure Proof Passes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink-900 antialiased flex flex-col min-h-screen">
        <StoreProvider>
          <SimulatedBadge />
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-900">Zeycb Prototype</span>
                <span>•</span>
                <span>SIH26263 Higher-Ed Research Demo</span>
                <span>•</span>
                <span className="text-slate-500">Synthetic Data Only</span>
              </div>
              <div className="text-slate-400 text-center sm:text-right">
                National Institute of Technology & Advanced Sciences (NITAS — Fictional Prototype Scope)
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
