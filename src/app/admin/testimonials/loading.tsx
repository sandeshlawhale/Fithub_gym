export default function TestimonialsLoading() {
  return (
    <div className="flex flex-col gap-lg w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <div className="h-10 bg-[#181818] border border-[#323232] rounded-xl w-64 mb-sm"></div>
          <div className="h-5 bg-[#181818] border border-[#323232] rounded-lg w-80"></div>
        </div>
      </div>

      {/* Table Card Container skeleton */}
      <div className="bg-[#181818] border border-[#323232] rounded-xl flex flex-col shadow-sm mt-md w-full">
        {/* Table Toolbar controls skeleton */}
        <div className="p-lg border-b border-[#323232] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-md">
          <div className="w-full md:w-80 h-[48px] bg-[#262626] rounded-xl"></div>
          <div className="flex gap-sm">
            <div className="w-20 h-[40px] bg-[#262626] rounded-lg"></div>
            <div className="w-24 h-[40px] bg-[#262626] rounded-lg"></div>
            <div className="w-24 h-[40px] bg-[#262626] rounded-lg"></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#131313]/50 border-b border-[#323232]">
              <tr>
                <th className="py-md px-lg w-1/6"></th>
                <th className="py-md px-lg w-1/6"></th>
                <th className="py-md px-lg w-1/12"></th>
                <th className="py-md px-lg w-1/3"></th>
                <th className="py-md px-lg w-1/8"></th>
                <th className="py-md px-lg w-1/12"></th>
                <th className="py-md px-lg text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#323232]/50 bg-[#181818]">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-[#323232]/30">
                  <td className="py-md px-lg">
                    <div className="h-4 bg-[#262626] rounded-md w-28"></div>
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 bg-[#262626] rounded-md w-36"></div>
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 bg-[#262626] rounded-md w-12"></div>
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 bg-[#262626] rounded-md w-5/6"></div>
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 bg-[#262626] rounded-md w-20"></div>
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-6 bg-[#262626] rounded-full w-16"></div>
                  </td>
                  <td className="py-md px-lg text-right">
                    <div className="flex justify-end gap-sm">
                      <div className="w-8 h-8 rounded-lg bg-[#262626]"></div>
                      <div className="w-8 h-8 rounded-lg bg-[#262626]"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
