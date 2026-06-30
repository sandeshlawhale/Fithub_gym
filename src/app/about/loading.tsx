export default function AboutLoading() {
  return (
    <div className="bg-[#0F0F0F] text-[#FFFFFF] min-h-screen font-sans antialiased overflow-x-hidden pt-20 animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative min-h-[50vh] flex items-center justify-center py-20 px-container-margin border-b border-[#323232]">
        <div className="max-w-4xl text-center flex flex-col items-center gap-md w-full">
          <div className="h-4 bg-[#262626] rounded-md w-32 mb-sm"></div>
          <div className="h-12 bg-[#262626] rounded-xl w-3/4 md:w-1/2 mb-md"></div>
          <div className="h-6 bg-[#262626] rounded-md w-5/6 md:w-2/3"></div>
        </div>
      </section>

      {/* Story & Philosophy Section Skeleton */}
      <section className="py-20 px-container-margin">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-md">
            <div className="h-8 bg-[#262626] rounded-lg w-1/3"></div>
            <div className="h-4 bg-[#262626] rounded-md w-full"></div>
            <div className="h-4 bg-[#262626] rounded-md w-full"></div>
            <div className="h-4 bg-[#262626] rounded-md w-5/6"></div>
          </div>
          <div className="h-80 bg-[#181818] border border-[#323232] rounded-2xl w-full"></div>
        </div>
      </section>

      {/* Mission & Vision Skeleton */}
      <section className="py-20 px-container-margin bg-[#131313] border-y border-[#323232]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#181818] border border-[#323232] p-xl rounded-2xl flex flex-col gap-md h-64">
            <div className="w-12 h-12 bg-[#262626] rounded-xl"></div>
            <div className="h-6 bg-[#262626] rounded-md w-1/3"></div>
            <div className="h-4 bg-[#262626] rounded-md w-full"></div>
            <div className="h-4 bg-[#262626] rounded-md w-5/6"></div>
          </div>
          <div className="bg-[#181818] border border-[#323232] p-xl rounded-2xl flex flex-col gap-md h-64">
            <div className="w-12 h-12 bg-[#262626] rounded-xl"></div>
            <div className="h-6 bg-[#262626] rounded-md w-1/3"></div>
            <div className="h-4 bg-[#262626] rounded-md w-full"></div>
            <div className="h-4 bg-[#262626] rounded-md w-5/6"></div>
          </div>
        </div>
      </section>

      {/* Team / Trainers Skeleton */}
      <section className="py-20 px-container-margin">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center gap-sm mb-16">
            <div className="h-8 bg-[#262626] rounded-lg w-48"></div>
            <div className="h-4 bg-[#262626] rounded-md w-64"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#181818] border border-[#323232] rounded-2xl overflow-hidden h-96 flex flex-col">
                <div className="flex-1 bg-[#262626]"></div>
                <div className="p-md flex flex-col gap-sm">
                  <div className="h-5 bg-[#262626] rounded-md w-2/3"></div>
                  <div className="h-4 bg-[#262626] rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
