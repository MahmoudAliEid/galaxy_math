'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult } from '@/lib/calculate';
import { Trophy, FileText, BarChart3, Calculator, ChevronRight, Sparkles } from 'lucide-react';

interface ResultViewProps {
    result: CalculationResult | null;
}

export default function ResultView({ result }: ResultViewProps) {
    if (!result) {
        return null;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Hero Result Card */}
            <Card className="glass overflow-hidden border-sky-500/20 shadow-[0_0_50px_rgba(56,189,248,0.15)] relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-transparent blur-2xl" />
                <CardHeader className="text-center pb-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">النتيجة النهائية الختامية</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">القوة المختزلة</CardTitle>
                </CardHeader>
                <CardContent className="pb-10 pt-4">
                    <div className="relative flex justify-center items-center px-4">
                        <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000" />
                        <span className="text-[12rem] font-black leading-none bg-gradient-to-b from-white via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-in zoom-in duration-1000">
                            {result.finalReduced}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Scientific Reduction Walkthrough */}
            {result.reductionSteps && result.reductionSteps.length > 1 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold tracking-tight">مسار الاختزال النهائي (جمع الأرقام)</h3>
                    </div>
                    
                    <Card className="glass border-white/5 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6 relative">
                                {result.reductionSteps.map((step, i) => {
                                    const isLast = i === result.reductionSteps.length - 1;

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-4 group w-full">
                                            <div className="relative w-full overflow-x-auto py-4 scrollbar-hide flex justify-center">
                                                <div className={`text-4xl font-black tracking-widest break-all text-center px-4 ${isLast ? 'text-sky-400 scale-125' : 'text-slate-200'}`}>
                                                    {step}
                                                </div>
                                            </div>

                                            {!isLast && (
                                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                                    <ChevronRight className="w-5 h-5 rotate-90" />
                                                    <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-50">
                                                        جمع المكونات
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Character Value Analysis */}
                <Card className="glass border-white/5 md:col-span-2 overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-emerald-400" />
                            قيم كل حرف (المرحلة الثانية)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6 border-b border-white/5">
                        <div className="flex flex-wrap justify-center gap-4">
                            {result.charAnalysis.map((analysis, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/5 p-2 px-4 rounded-xl border border-white/5">
                                    <span className="text-2xl font-black text-white">{analysis.char}</span>
                                    <span className="text-xs text-slate-500">=</span>
                                    <span className="text-xl font-black text-sky-400 break-all">{analysis.charValue}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardHeader className="pb-2 pt-6">
                        <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-emerald-400" />
                            تفكيك متسلسلة الجمع (المرحلة الثالثة)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5 min-h-[100px] relative">
                            {result.sequence.map((step, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center gap-1 group">
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-sky-500 transition-colors">{step.char}</span>
                                        <div className="px-3 h-10 min-w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm shadow-inner group-hover:scale-110 transition-transform">
                                            {step.value}
                                        </div>
                                    </div>
                                    {i < result.sequence.length - 1 && (
                                        <div className="text-slate-700 font-black text-lg self-end pb-2">+</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-col items-center gap-2 w-full">
                            <span className="text-[0.6rem] font-black text-slate-600 uppercase tracking-widest">المجموع الكلي</span>
                            <div className="text-xl font-black text-white bg-white/5 px-6 py-2 rounded-2xl border border-white/5 max-w-full break-all text-center">
                                {result.totalSum}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Normalized Text Detail */}
                <Card className="glass border-white/5 glass-hover transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                النص الموحد
                            </CardTitle>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                            <p className="text-3xl font-bold text-center text-sky-200 tracking-[0.3em] break-all" dir="rtl">
                                {result.normalized.trim().replace(/\s+/g, ' ').split('').join(' ')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Calculation Summary */}
                <Card className="glass border-white/5 glass-hover transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-purple-400" />
                                ملخص الأرقام
                            </CardTitle>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { label: 'النص الأصلي', value: result.original, color: 'text-slate-300', rtl: true },
                            { label: 'إجمالي عدد الحروف', value: result.normalized.length, color: 'text-sky-400', rtl: false },
                            { label: 'القيمة النهائية', value: result.finalReduced, color: 'text-white font-black text-xl', rtl: false },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-slate-500">{item.label}</span>
                                <span className={`${item.color} break-all text-right ml-4`} dir={item.rtl ? 'rtl' : 'ltr'}>{item.value}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Character Analysis */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <BarChart3 className="w-5 h-5 text-teal-500" />
                    <h3 className="text-lg font-bold tracking-tight">تحليل الحروف (الخوارزمية المحددة)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.charAnalysis.map((analysis, idx) => (
                        <Card key={idx} className="glass border-white/5 hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-right">
                                <div className="text-[0.65rem] font-black text-slate-600 group-hover:text-emerald-500/50 transition-colors uppercase">حرف #{idx + 1}</div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-end justify-between">
                                    <span className="text-5xl font-black text-white group-hover:scale-110 group-hover:text-sky-300 transition-all duration-500">
                                        {analysis.char}
                                    </span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-black text-sky-400 break-all">{analysis.charValue}</span>
                                        <span className="text-[0.6rem] font-bold text-slate-600 uppercase">قيمة الحرف</span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex justify-between text-[0.65rem] font-bold">
                                        <span className="text-slate-500">المواضع (الأرقام التسلسلية)</span>
                                        <span className="text-teal-400 font-mono italic">{analysis.positions.join(' × ')}</span>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[0.6rem] text-slate-500 leading-relaxed italic">
                                            تم حساب القيمة بضرب جميع الأرقام التسلسلية للمواضع التي ظهر فيها الحرف.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
