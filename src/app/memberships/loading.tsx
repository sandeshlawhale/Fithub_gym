export default function MembershipsLoading() {
  return (
    <div className="bg-[#0F0F0F] text-[#FFFFFF] min-h-screen font-sans antialiased overflow-x-hidden pt-20 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="py-16 px-container-margin border-b border-[#323232]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-sm">
          <div className="h-4 bg-[#262626] rounded-md w-24"></div>
          <div className="h-10 bg-[#262626] rounded-xl w-80 mt-sm"></div>
          <div className="h-5 bg-[#262626] rounded-md w-96 mt-xs"></div>
        </div>
      </section>

      {/* Toggle Tab Skeleton */}
      <section className="py-8 px-container-margin bg-[#131313] border-b border-[#323232]">
        <div className="max-w-md mx-auto h-12 bg-[#181818] border border-[#323232] rounded-xl flex items-center justify-between p-1">
          <div className="h-full bg-[#262626] rounded-lg w-1/2"></div>
          <div className="h-full rounded-lg w-1/2"></div>
        </div>
      </section>

      {/* Plan Tables Skeleton */}
      <section className="py-16 px-container-margin">
        <div className="max-w-7xl mx-auto flex flex-col gap-lg">
          <div className="h-8 bg-[#262626] rounded-lg w-48 mb-md"></div>
          <div className="bg-[#181818] border border-[#323232] rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#131313] border-b border-[#323232] grid grid-cols-5 p-md gap-md">
              <div className="h-4 bg-[#262626] rounded-md w-2/3"></div>
              <div className="h-4 bg-[#262626] rounded-md w-1/2"></div>
              <div className="h-4 bg-[#262626] rounded-md w-1/2"></div>
              <div className="h-4 bg-[#262626] rounded-md w-2/3"></div>
              <div className="h-4 bg-[#262626] rounded-md w-1/3 justify-self-end"></div>
            </div>
            {/* Table Rows */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-5 p-md gap-md border-b border-[#323232]/50 last:border-0 items-center">
                <div className="h-6 bg-[#262626] rounded-md w-4/5"></div>
                <div className="h-4 bg-[#262626] rounded-md w-1/3"></div>
                <div className="h-4 bg-[#262626] rounded-md w-1/2 font-bold text-primary"></div>
                <div className="h-4 bg-[#262626] rounded-md w-3/4"></div>
                <div className="h-10 bg-[#262626] rounded-lg w-20 justify-self-end"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
