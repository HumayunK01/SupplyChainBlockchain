import React from 'react'

const SkeletonLoader = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 font-manrope relative overflow-hidden text-slate-900">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="container mx-auto px-6 pt-24 max-w-6xl relative z-10 w-full">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 w-full">
                    <div className="w-full max-w-md animate-pulse">
                        <div className="h-12 bg-slate-200/80 rounded-xl mb-4 w-3/4"></div>
                        <div className="h-5 bg-slate-200/60 rounded-lg w-full"></div>
                    </div>
                    <div className="animate-pulse hidden md:block">
                        <div className="w-48 h-[76px] bg-white rounded-2xl border border-slate-100 shadow-sm"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-12 w-full">
                    {/* Top Row Skeletons (Stats or Control Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-36 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                                    <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="w-1/2 h-6 bg-slate-200/80 rounded-lg"></div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Area Skeleton (Table or Form) */}
                    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-pulse" style={{ animationDelay: '400ms' }}>
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex items-center justify-between">
                            <div className="h-8 bg-slate-200/80 rounded-lg w-48"></div>
                            <div className="h-10 bg-slate-200/60 rounded-xl w-24"></div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Table header skeleton */}
                            <div className="flex gap-4 mb-2 px-2">
                                <div className="h-4 bg-slate-200/50 rounded flex-1"></div>
                                <div className="h-4 bg-slate-200/50 rounded flex-[2]"></div>
                                <div className="h-4 bg-slate-200/50 rounded flex-[1]"></div>
                            </div>

                            {/* Table rows skeleton */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="h-14 bg-slate-100 rounded-2xl w-20"></div>
                                    <div className="h-14 bg-slate-100 rounded-2xl flex-1"></div>
                                    <div className="h-10 bg-slate-100 rounded-xl w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonLoader
