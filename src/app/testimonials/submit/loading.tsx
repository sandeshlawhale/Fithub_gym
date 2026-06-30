export default function TestimonialSubmitLoading() {
  return (
    <div className="bg-[#0F0F0F] text-[#FFFFFF] min-h-screen font-sans antialiased overflow-x-hidden pt-32 pb-16 px-container-margin flex flex-col justify-center items-center animate-pulse">
      <div className="w-full max-w-xl flex flex-col gap-md">
        {/* Back Link Skeleton */}
        <div className="h-4 bg-[#262626] rounded-md w-24 mb-sm self-start"></div>

        {/* Header Skeleton */}
        <div className="flex flex-col gap-xs mb-md">
          <div className="h-8 bg-[#262626] rounded-lg w-2/3"></div>
          <div className="h-4 bg-[#262626] rounded-md w-full mt-xs"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-[#181818] border border-[#323232] rounded-2xl p-lg md:p-xl flex flex-col gap-lg shadow-2xl">
          {/* Name Field */}
          <div className="flex flex-col gap-sm">
            <div className="h-4 bg-[#262626] rounded-md w-24"></div>
            <div className="h-12 bg-[#262626] rounded-xl w-full"></div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-sm">
            <div className="h-4 bg-[#262626] rounded-md w-24"></div>
            <div className="h-12 bg-[#262626] rounded-xl w-full"></div>
          </div>

          {/* Rating Field */}
          <div className="flex flex-col gap-sm">
            <div className="h-4 bg-[#262626] rounded-md w-24"></div>
            <div className="flex gap-xs">
              {[1, 2, 3, 5, 5].map((i) => (
                <div key={i} className="w-8 h-8 bg-[#262626] rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Review Field */}
          <div className="flex flex-col gap-sm">
            <div className="h-4 bg-[#262626] rounded-md w-24"></div>
            <div className="h-32 bg-[#262626] rounded-xl w-full"></div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-sm">
            <div className="w-5 h-5 bg-[#262626] rounded-md shrink-0 mt-0.5"></div>
            <div className="flex flex-col gap-xs w-full">
              <div className="h-4 bg-[#262626] rounded-md w-3/4"></div>
              <div className="h-3 bg-[#262626] rounded-md w-1/2"></div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="h-12 bg-[#262626] rounded-xl w-full mt-md"></div>
        </div>
      </div>
    </div>
  );
}
