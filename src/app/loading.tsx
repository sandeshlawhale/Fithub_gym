export default function RootLoading() {
  return (
    <div className="bg-[#0F0F0F] text-[#FFFFFF] min-h-screen font-sans antialiased overflow-x-hidden pt-20 animate-pulse">
      {/* 1. HERO SECTION SKELETON */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-container-margin border-b border-[#323232]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#ffc174]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-[#f59e0b]/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-md relative z-10 w-full">
          {/* Badge Skeleton */}
          <div className="h-8 bg-[#262626] border border-[#534434]/30 rounded-full w-64 mb-sm"></div>
          
          {/* Headline Skeletons */}
          <div className="h-14 bg-[#262626] rounded-xl w-11/12 md:w-3/4 mb-xs"></div>
          <div className="h-14 bg-[#262626] rounded-xl w-3/4 md:w-1/2 mb-md"></div>
          
          {/* Description Skeletons */}
          <div className="h-5 bg-[#262626] rounded-md w-11/12 md:w-2/3"></div>
          <div className="h-5 bg-[#262626] rounded-md w-9/12 md:w-1/2 mb-lg"></div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-md w-full sm:w-auto">
            <div className="h-12 bg-[#262626] rounded-xl w-full sm:w-44"></div>
            <div className="h-12 bg-[#262626] border border-[#323232] rounded-xl w-full sm:w-44"></div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION SKELETON */}
      <section className="py-12 bg-[#131313] border-b border-[#323232] px-container-margin">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#181818] border border-[#323232] p-lg rounded-xl flex items-center justify-between h-24">
              <div className="flex flex-col gap-xs">
                <div className="h-4 bg-[#262626] rounded-md w-24"></div>
                <div className="h-8 bg-[#262626] rounded-md w-16"></div>
              </div>
              <div className="w-10 h-10 bg-[#262626] rounded-full"></div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ACCESS TIERS / PRICING CARDS SKELETON */}
      <section className="py-20 px-container-margin">
        <div className="max-w-7xl mx-auto space-y-xl">
          <div className="text-center flex flex-col items-center gap-xs">
            <div className="h-4 bg-[#262626] rounded-md w-20"></div>
            <div className="h-8 bg-[#262626] rounded-lg w-64 mt-xs"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg pt-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#181818] border border-[#323232] rounded-2xl p-xl flex flex-col gap-lg h-[450px]">
                <div className="flex flex-col gap-sm">
                  <div className="h-6 bg-[#262626] rounded-md w-1/3"></div>
                  <div className="h-10 bg-[#262626] rounded-lg w-1/2"></div>
                </div>
                <div className="flex-1 flex flex-col gap-sm mt-md">
                  <div className="h-4 bg-[#262626] rounded-md w-full"></div>
                  <div className="h-4 bg-[#262626] rounded-md w-5/6"></div>
                  <div className="h-4 bg-[#262626] rounded-md w-4/5"></div>
                  <div className="h-4 bg-[#262626] rounded-md w-full"></div>
                </div>
                <div className="h-12 bg-[#262626] rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
