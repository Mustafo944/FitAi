'use client'
// src/app/landing/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export default function LandingPage() {
    const { t, locale } = useTranslation()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 10)
        if (locale === 'uz' || locale === 'ru') {
            document.cookie = `lang=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
        }
        return () => clearTimeout(timer)
    }, [locale])

    const features = [
        { icon: '🧬', title: t('landing_feat1_title'), desc: t('landing_feat1_desc') },
        { icon: '🍽️', title: t('landing_feat2_title'), desc: t('landing_feat2_desc') },
        { icon: '💪', title: t('landing_feat3_title'), desc: t('landing_feat3_desc') },
        { icon: '📊', title: t('landing_feat4_title'), desc: t('landing_feat4_desc') },
    ]

    const steps = [
        { n: '01', icon: '📸', title: t('landing_step1_title'), desc: t('landing_step1_desc') },
        { n: '02', icon: '📏', title: t('landing_step2_title'), desc: t('landing_step2_desc') },
        { n: '03', icon: '🤖', title: t('landing_step3_title'), desc: t('landing_step3_desc') },
        { n: '04', icon: '📋', title: t('landing_step4_title'), desc: t('landing_step4_desc') },
    ]

    return (
        <div className="bg-[#0a0a0a] text-[#f0ede6] min-h-screen font-['Instrument_Sans'] overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 py-4 md:py-5 glass-strong">
                <div className="font-['Clash_Display'] text-xl md:text-2xl font-bold">
                    Fit<span className="text-[#c8f55a] accent-glow">AI</span>
                </div>

                <div className="flex items-center gap-6 md:gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-gray-500 text-sm hover:text-white transition-colors duration-300">
                            {t('landing_features')}
                        </a>
                        <a href="#pricing" className="text-gray-500 text-sm hover:text-white transition-colors duration-300">
                            {t('landing_pricing')}
                        </a>
                    </div>

                    <Link
                        href="/auth"
                        className="bg-[#c8f55a] text-[#0a0a0a] px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-semibold hover:shadow-[0_0_25px_rgba(200,245,90,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {t('landing_start')}
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(200,245,90,0.12)_0%,transparent_70%)]" />
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#c8f55a]/5 rounded-full blur-[150px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#c8f55a]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-[#c8f55a]/8 border border-[#c8f55a]/20 text-[#c8f55a] px-3.5 py-1.5 rounded-full text-[13px] font-medium mb-7 animate-pulse-glow">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8f55a] animate-pulse" />
                        {t('landing_hero_tag')}
                    </div>

                    <h1 className="font-['Clash_Display'] text-[44px] md:text-[88px] font-bold leading-[1.1] md:leading-[1.0] tracking-[-0.03em] mb-5">
                        {t('landing_hero_title1')}
                        <br />
                        <span className="text-[#c8f55a] accent-glow">{t('landing_hero_title2')}</span>
                        <br />
                        {t('landing_hero_title3')}
                    </h1>

                    <p className="text-base md:text-lg text-gray-500 max-w-[500px] mx-auto mb-10 leading-relaxed">
                        {t('landing_hero_desc')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/auth"
                            className="bg-[#c8f55a] text-[#0a0a0a] px-9 py-4 rounded-full text-base font-semibold hover:shadow-[0_0_40px_rgba(200,245,90,0.3)] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 btn-primary"
                        >
                            {t('landing_start')} →
                        </Link>
                    </div>
                </div>

                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-16 max-w-2xl w-full relative z-10 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {[
                        [t('landing_stat1_num'), t('landing_stat1_label')],
                        [t('landing_stat2_num'), t('landing_stat2_label')],
                        [t('landing_stat3_num'), t('landing_stat3_label')],
                        [t('landing_stat4_num'), t('landing_stat4_label')],
                    ].map(([n, l], i) => (
                        <div key={l} className="text-center" style={{ transitionDelay: `${400 + i * 100}ms` }}>
                            <div className="font-['Clash_Display'] text-2xl md:text-3xl font-bold text-[#c8f55a] accent-glow">
                                {n}
                            </div>
                            <div className="text-[11px] md:text-xs text-gray-600 mt-1 uppercase tracking-wider">
                                {l}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <section id="how" className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#c8f55a] mb-3.5">
                    {t('landing_step_badge')}
                </div>

                <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight mb-12">
                    {t('landing_step_title1')}
                    <span className="text-[#c8f55a]">{t('landing_step_title2')}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            className="bg-[#111] border border-white/7 p-7 md:p-8 flex flex-col items-start text-left rounded-2xl card-hover card-glow transition-all duration-300"
                        >
                            <div className="font-['Clash_Display'] text-4xl font-bold text-[#c8f55a]/10 leading-none mb-4">
                                {s.n}
                            </div>
                            <div className="text-3xl mb-4">{s.icon}</div>
                            <div className="font-['Clash_Display'] text-lg font-semibold mb-2">{s.title}</div>
                            <div className="text-sm text-gray-500 leading-relaxed">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="max-w-6xl mx-auto px-6 py-0 pb-20">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#c8f55a] mb-3.5">
                    {t('landing_feat_badge')}
                </div>

                <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight mb-10">
                    {t('landing_feat_title1')}
                    <span className="text-[#c8f55a]">{t('landing_feat_title2')}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="bg-[#111] border border-white/7 rounded-2xl p-7 md:p-8 card-hover card-glow group"
                        >
                            <div className="w-12 h-12 bg-[#c8f55a]/8 rounded-xl flex items-center justify-center text-xl mb-5 group-hover:bg-[#c8f55a]/15 group-hover:scale-110 transition-all duration-300">
                                {f.icon}
                            </div>
                            <div className="font-['Clash_Display'] text-xl font-semibold mb-2.5">
                                {f.title}
                            </div>
                            <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="max-w-6xl mx-auto px-6 py-0 pb-20">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#c8f55a] mb-3.5">
                    {t('landing_price_badge')}
                </div>

                <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight mb-10">
                    {t('landing_price_title1')}
                    <span className="text-[#c8f55a]">{t('landing_price_title2')}</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                        {
                            name: t('landing_price_free'),
                            price: '0',
                            period: t('landing_price_free_period'),
                            features: [
                                t('landing_price_free_f1'),
                                t('landing_price_free_f2'),
                                t('landing_price_free_f3'),
                                t('landing_price_free_f4'),
                            ],
                            no: [
                                t('landing_price_free_n1'),
                                t('landing_price_free_n2'),
                                t('landing_price_free_n3'),
                            ],
                        },
                        {
                            name: t('landing_price_pro'),
                            price: '4.99',
                            period: t('landing_price_pro_period'),
                            best: true,
                            features: [
                                t('landing_price_pro_f1'),
                                t('landing_price_pro_f2'),
                                t('landing_price_pro_f3'),
                                t('landing_price_pro_f4'),
                                t('landing_price_pro_f5'),
                                t('landing_price_pro_f6'),
                            ],
                            no: [],
                        },
                        {
                            name: t('landing_price_year'),
                            price: '39.99',
                            period: t('landing_price_year_period'),
                            features: [
                                t('landing_price_year_f1'),
                                t('landing_price_year_f2'),
                                t('landing_price_year_f3'),
                                t('landing_price_year_f4'),
                            ],
                            no: [],
                        },
                    ].map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-8 rounded-2xl border transition-all duration-300 card-hover ${plan.best
                                ? 'bg-[#c8f55a]/[0.03] border-[#c8f55a] shadow-[0_0_40px_rgba(200,245,90,0.08)]'
                                : 'bg-[#111] border-white/7 hover:border-white/15'
                                }`}
                        >
                            {plan.best && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8f55a] text-[#0a0a0a] text-[10px] font-bold px-3.5 py-1 rounded-full tracking-wider uppercase shadow-[0_0_20px_rgba(200,245,90,0.3)]">
                                    {t('landing_price_pro_badge')}
                                </div>
                            )}

                            <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-3">
                                {plan.name}
                            </div>

                            <div className="font-['Clash_Display'] text-[44px] font-bold tracking-tighter leading-none mb-1">
                                <span className="text-xl align-top mr-1 font-medium italic">$</span>
                                {plan.price}
                            </div>

                            <div className="text-xs text-gray-600 mb-7">{plan.period}</div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f, fi) => (
                                    <li key={fi} className="text-sm text-gray-400 flex items-center gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-[#c8f55a]/10 flex items-center justify-center text-[#c8f55a] text-[10px] font-bold shrink-0">✓</span>
                                        {f}
                                    </li>
                                ))}

                                {plan.no.map((f, fi) => (
                                    <li
                                        key={fi}
                                        className="text-sm text-gray-800 flex items-center gap-2.5 opacity-40"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gray-700 text-[10px] shrink-0">✗</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/auth"
                                className={`block w-full text-center py-3.5 rounded-full text-sm font-semibold transition-all duration-300 ${plan.best
                                    ? 'bg-[#c8f55a] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(200,245,90,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-transparent text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {t('landing_start')}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-white/7 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="font-['Clash_Display'] text-xl font-bold">
                    Fit<span className="text-[#c8f55a]">AI</span>
                </div>
                <p className="text-[11px] md:text-xs text-gray-600">{t('landing_footer')}</p>
            </footer>
        </div>
    )
}