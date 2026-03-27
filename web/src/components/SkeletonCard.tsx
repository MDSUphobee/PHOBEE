export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-[1.25rem] shadow-sm border border-gray-100 p-6 flex flex-col h-full animate-pulse">
            <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0"></div>
                <div className="w-24 h-6 bg-gray-200 rounded-full shrink-0"></div>
            </div>

            <div className="w-3/4 h-6 bg-gray-200 rounded-md mb-3"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded-md mb-6"></div>

            <div className="space-y-2 mb-6 flex-1">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
