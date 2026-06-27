"use client";

import { Printer, X } from "lucide-react";

interface ReceiptControlsProps {
  whatsappUrl: string;
}

export default function ReceiptControls({ whatsappUrl }: ReceiptControlsProps) {
  return (
    <div className="no-print flex items-center justify-center gap-md mb-lg bg-surface border border-outline-variant p-sm rounded-xl max-w-[148mm] mx-auto w-full">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-xs px-md py-sm bg-primary-container text-on-primary-container hover:bg-primary font-bold text-sm rounded-xl cursor-pointer transition-all active:scale-[0.98]"
      >
        <Printer className="w-4 h-4" />
        Print / Download
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-xs px-md py-sm bg-green-600 text-white hover:bg-green-500 font-bold text-sm rounded-xl cursor-pointer transition-all active:scale-[0.98] text-center"
      >
        {/* WhatsApp Icon */}
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.858.002-2.636-1.023-5.112-2.887-6.978C16.577 1.903 14.1 .88 11.465.88c-5.44 0-9.861 4.417-9.865 9.86-.001 1.762.464 3.483 1.347 5.013l-.995 3.637 3.737-.981zm11.387-5.464c-.307-.154-1.817-.897-2.097-.999-.28-.102-.484-.154-.688.154-.204.307-.79.999-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.298-.479-2.472-1.526-.913-.815-1.53-1.821-1.709-2.128-.178-.307-.019-.473.135-.626.139-.138.307-.359.461-.538.154-.179.204-.307.307-.512.102-.205.051-.384-.026-.538-.077-.154-.688-1.664-.943-2.277-.249-.597-.502-.516-.688-.526-.179-.01-.383-.012-.587-.012-.204 0-.537.077-.818.384-.28.307-1.073 1.049-1.073 2.559 0 1.51 1.1 2.97 1.253 3.175.154.205 2.164 3.306 5.242 4.638.732.316 1.302.505 1.748.647.734.233 1.402.2 1.93.121.587-.087 1.817-.742 2.072-1.459.255-.717.255-1.332.179-1.459-.076-.128-.28-.205-.587-.359z" />
        </svg>
        Share on WhatsApp
      </a>

      <button
        onClick={() => window.close()}
        className="flex items-center gap-xs px-md py-sm border border-outline-variant text-on-surface-variant hover:bg-surface-container-high font-bold text-sm rounded-xl cursor-pointer transition-all active:scale-[0.98]"
      >
        <X className="w-4 h-4" />
        Close
      </button>
    </div>
  );
}
