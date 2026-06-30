export default function GalleryLoading() {
  return (
    <div className="bg-[#0F0F0F] text-[#FFFFFF] min-h-screen font-sans antialiased overflow-x-hidden pt-20 animate-pulse">
      {/* Header Skeleton */}
      <section className="py-16 px-container-margin border-b border-[#323232]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-sm">
          <div className="h-4 bg-[#262626] rounded-md w-24"></div>
          <div className="h-10 bg-[#262626] rounded-xl w-64 mt-sm"></div>
          <div className="h-5 bg-[#262626] rounded-md w-96 mt-xs"></div>
        </div>
      </section>

      {/* Categories Toolbar Skeleton */}
      <section className="py-8 px-container-margin bg-[#131313] border-b border-[#323232]">
        <div className="max-w-7xl mx-auto flex justify-center flex-wrap gap-sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[#262626] border border-[#323232] rounded-lg w-24"></div>
          ))}
        </div>
      </section>

      {/* Masonry Grid Skeleton */}
      <section className="py-12 px-container-margin">
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-md space-y-md">
          {/* Simulated varying heights for masonry look */}
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-80 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-96 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-64 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-96 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-72 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-80 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-64 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-80 w-full break-inside-avoid"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl h-96 w-full break-inside-avoid"></div>
        </div>
      </section>
    </div>
  );
}
