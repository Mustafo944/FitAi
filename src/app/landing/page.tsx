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

    const testimonials = locale === 'ru'
        ? [
            { name: 'Алишер М.', role: 'Фитнес энтузиаст', text: 'За 3 месяца потерял 12 кг. AI план идеально подошёл мне!', avatar: 'А' },
            { name: 'Дилноза К.', role: 'Мама двоих детей', text: 'Наконец нашла диету, которая реально работает. Рекомендую!', avatar: 'Д' },
            { name: 'Бобур Т.', role: 'Спортсмен', text: 'Набрал мышечную массу за 2 месяца. Тренировки точно под меня.', avatar: 'Б' },
        ]
        : [
            { name: 'Alisher M.', role: 'Fitnes ishqibozi', text: '3 oyda 12 kg yo\'qotdim. AI reja menga juda mos keldi!', avatar: 'A' },
            { name: 'Dilnoza K.', role: 'Ikki farzand onasi', text: 'Nihoyat ishlaydigan dieta topdim. Tavsiya qilaman!', avatar: 'D' },
            { name: 'Bobur T.', role: 'Sportchi', text: '2 oyda mushak oldim. Mashqlar aynan menga moslashtirilgan.', avatar: 'B' },
        ]

    return (
        <div className="bg-[#0a0a0a] text-[#f0ede6] min-h-screen font-['Instrument_Sans'] overflow-x-hidden">

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 py-4 md:py-5 glass-strong border-b border-white/5">
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
                        className="bg-[#c8f55a] text-[#0a0a0a] px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-semibold hover:shadow-[0_0_25px_rgba(200,245,90,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {t('landing_start')}
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative">
                {/* BG effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(200,245,90,0.13)_0%,transparent_70%)]" />
                <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-[#c8f55a]/4 rounded-full blur-[180px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] bg-[#c8f55a]/3 rounded-full blur-[150px] pointer-events-none" />

                {/* Floating cards */}
                <div className="absolute top-32 left-8 md:left-16 hidden lg:block">
                    <div className={`bg-[#111] border border-white/8 rounded-2xl p-4 shadow-xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: '600ms' }}>
                        <div className="text-xs text-gray-500 mb-1">{locale === 'ru' ? 'Анализ тела' : 'Tana tahlili'}</div>
                        <div className="text-lg font-bold text-[#c8f55a]">BMI 22.4</div>
                        <div className="text-xs text-gray-600">{locale === 'ru' ? 'Норма ✓' : 'Normal ✓'}</div>
                    </div>
                </div>
                <div className="absolute top-44 right-8 md:right-16 hidden lg:block">
                    <div className={`bg-[#111] border border-white/8 rounded-2xl p-4 shadow-xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: '800ms' }}>
                        <div className="text-xs text-gray-500 mb-1">{locale === 'ru' ? 'Цель' : 'Maqsad'}</div>
                        <div className="text-lg font-bold text-white">-8 kg</div>
                        <div className="text-xs text-[#c8f55a]">12 {locale === 'ru' ? 'недель' : 'hafta'}</div>
                    </div>
                </div>

                <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-[#c8f55a]/10 border border-[#c8f55a]/25 text-[#c8f55a] px-4 py-1.5 rounded-full text-[13px] font-medium mb-7">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8f55a] animate-pulse" />
                        {t('landing_hero_tag')}
                    </div>

                    <h1 className="font-['Clash_Display'] text-[48px] md:text-[92px] font-bold leading-[1.05] tracking-[-0.03em] mb-6">
                        {t('landing_hero_title1')}
                        <br />
                        <span className="text-[#c8f55a] accent-glow relative">
                            {t('landing_hero_title2')}
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8" fill="none">
                                <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="#c8f55a" strokeWidth="2" strokeOpacity="0.4" fill="none" />
                            </svg>
                        </span>
                        <br />
                        {t('landing_hero_title3')}
                    </h1>

                    <p className="text-base md:text-lg text-gray-500 max-w-[520px] mx-auto mb-10 leading-relaxed">
                        {t('landing_hero_desc')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Link
                            href="/auth"
                            className="bg-[#c8f55a] text-[#0a0a0a] px-10 py-4 rounded-full text-base font-semibold hover:shadow-[0_0_50px_rgba(200,245,90,0.35)] transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            {t('landing_start')} →
                        </Link>
                        <a href="#how" className="text-gray-500 text-sm hover:text-white transition-colors px-6 py-4 flex items-center gap-2">
                            {locale === 'ru' ? 'Как это работает' : 'Qanday ishlaydi'} ↓
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mt-20 max-w-2xl w-full relative z-10 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {[
                        [t('landing_stat1_num'), t('landing_stat1_label')],
                        [t('landing_stat2_num'), t('landing_stat2_label')],
                        [t('landing_stat3_num'), t('landing_stat3_label')],
                        [t('landing_stat4_num'), t('landing_stat4_label')],
                    ].map(([n, l]) => (
                        <div key={l} className="text-center group">
                            <div className="font-['Clash_Display'] text-2xl md:text-3xl font-bold text-[#c8f55a] group-hover:scale-110 transition-transform duration-300 inline-block">
                                {n}
                            </div>
                            <div className="text-[11px] md:text-xs text-gray-600 mt-1 uppercase tracking-wider">{l}</div>
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-6 h-10 border-2 border-white/10 rounded-full flex items-start justify-center p-1.5">
                        <div className="w-1 h-2 bg-[#c8f55a] rounded-full animate-bounce" />
                    </div>
                </div>
            </div>

            {/* How it works */}
            <section id="how" className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-14">
                    <div className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-[#c8f55a] bg-[#c8f55a]/8 border border-[#c8f55a]/20 px-4 py-1.5 rounded-full mb-4">
                        {t('landing_step_badge')}
                    </div>
                    <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight">
                        {t('landing_step_title1')}
                        <span className="text-[#c8f55a]">{t('landing_step_title2')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                    {/* Connector line */}
                    <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#c8f55a]/20 to-transparent z-0" />

                    {steps.map((s, i) => (
                        <div
                            key={i}
                            className="bg-[#111] border border-white/7 p-7 flex flex-col items-start text-left rounded-2xl card-hover group relative z-10 hover:border-[#c8f55a]/20 transition-all duration-300"
                        >
                            <div className="font-['Clash_Display'] text-5xl font-bold text-[#c8f55a]/8 leading-none mb-4 group-hover:text-[#c8f55a]/15 transition-colors duration-300">
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
            <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-14">
                    <div className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-[#c8f55a] bg-[#c8f55a]/8 border border-[#c8f55a]/20 px-4 py-1.5 rounded-full mb-4">
                        {t('landing_feat_badge')}
                    </div>
                    <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight">
                        {t('landing_feat_title1')}
                        <span className="text-[#c8f55a]">{t('landing_feat_title2')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="bg-[#111] border border-white/7 rounded-2xl p-8 card-hover group hover:border-[#c8f55a]/15 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c8f55a]/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-12 h-12 bg-[#c8f55a]/8 border border-[#c8f55a]/10 rounded-xl flex items-center justify-center text-xl mb-5 group-hover:bg-[#c8f55a]/15 group-hover:scale-110 transition-all duration-300 relative z-10">
                                {f.icon}
                            </div>
                            <div className="font-['Clash_Display'] text-xl font-semibold mb-2.5 relative z-10">{f.title}</div>
                            <div className="text-sm text-gray-500 leading-relaxed relative z-10">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-14">
                    <div className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-[#c8f55a] bg-[#c8f55a]/8 border border-[#c8f55a]/20 px-4 py-1.5 rounded-full mb-4">
                        {locale === 'ru' ? 'Отзывы' : 'Fikrlar'}
                    </div>
                    <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight">
                        {locale === 'ru' ? 'Что говорят ' : 'Foydalanuvchilar '}
                        <span className="text-[#c8f55a]">{locale === 'ru' ? 'пользователи' : 'nima deydi'}</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-[#111] border border-white/7 rounded-2xl p-6 hover:border-white/12 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#c8f55a]/15 border border-[#c8f55a]/20 flex items-center justify-center text-[#c8f55a] font-bold text-sm">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.role}</div>
                                </div>
                                <div className="ml-auto text-[#c8f55a] text-sm">★★★★★</div>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-14">
                    <div className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-[#c8f55a] bg-[#c8f55a]/8 border border-[#c8f55a]/20 px-4 py-1.5 rounded-full mb-4">
                        {t('landing_price_badge')}
                    </div>
                    <h2 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold tracking-tight">
                        {t('landing_price_title1')}
                        <span className="text-[#c8f55a]">{t('landing_price_title2')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                        {
                            name: t('landing_price_free'),
                            price: '0',
                            period: t('landing_price_free_period'),
                            features: [t('landing_price_free_f1'), t('landing_price_free_f2'), t('landing_price_free_f3'), t('landing_price_free_f4')],
                            no: [t('landing_price_free_n1'), t('landing_price_free_n2'), t('landing_price_free_n3')],
                        },
                        {
                            name: t('landing_price_pro'),
                            price: '4.99',
                            period: t('landing_price_pro_period'),
                            best: true,
                            features: [t('landing_price_pro_f1'), t('landing_price_pro_f2'), t('landing_price_pro_f3'), t('landing_price_pro_f4'), t('landing_price_pro_f5'), t('landing_price_pro_f6')],
                            no: [],
                        },
                        {
                            name: t('landing_price_year'),
                            price: '39.99',
                            period: t('landing_price_year_period'),
                            features: [t('landing_price_year_f1'), t('landing_price_year_f2'), t('landing_price_year_f3'), t('landing_price_year_f4')],
                            no: [],
                        },
                    ].map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${plan.best
                                ? 'bg-gradient-to-b from-[#c8f55a]/5 to-[#c8f55a]/[0.02] border-[#c8f55a]/40 shadow-[0_0_50px_rgba(200,245,90,0.1)]'
                                : 'bg-[#111] border-white/7 hover:border-white/15'
                                }`}
                        >
                            {plan.best && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c8f55a] text-[#0a0a0a] text-[10px] font-bold px-4 py-1 rounded-full tracking-wider uppercase shadow-[0_0_20px_rgba(200,245,90,0.4)]">
                                    {t('landing_price_pro_badge')}
                                </div>
                            )}
                            <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-3">{plan.name}</div>
                            <div className="font-['Clash_Display'] text-[48px] font-bold tracking-tighter leading-none mb-1">
                                <span className="text-xl align-top mr-0.5 font-medium italic">$</span>
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
                                    <li key={fi} className="text-sm text-gray-700 flex items-center gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-white/3 flex items-center justify-center text-gray-700 text-[10px] shrink-0">✗</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/auth"
                                className={`block w-full text-center py-3.5 rounded-full text-sm font-semibold transition-all duration-300 ${plan.best
                                    ? 'bg-[#c8f55a] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(200,245,90,0.3)] hover:scale-[1.02]'
                                    : 'bg-transparent text-gray-400 border border-white/10 hover:border-white/25 hover:text-white'
                                    }`}
                            >
                                {t('landing_start')}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#c8f55a]/12 via-[#c8f55a]/5 to-transparent border border-[#c8f55a]/20 p-10 md:p-16 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(200,245,90,0.08)_0%,transparent_70%)]" />
                    <div className="relative z-10">
                        <div className="text-4xl mb-4">🚀</div>
                        <h2 className="font-['Clash_Display'] text-3xl md:text-4xl font-bold mb-4">
                            {locale === 'ru' ? 'Готовы изменить своё тело?' : 'Tanangizni o\'zgartirishga tayyormisiz?'}
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {locale === 'ru' ? 'Бесплатный анализ тела за 5 минут. Без кредитной карты.' : 'Bepul tana tahlili 5 daqiqada. Karta kerak emas.'}
                        </p>
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 bg-[#c8f55a] text-[#0a0a0a] px-10 py-4 rounded-full text-base font-semibold hover:shadow-[0_0_50px_rgba(200,245,90,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            {t('landing_start')} →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-white/7">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-['Clash_Display'] text-xl font-bold">
                        Fit<span className="text-[#c8f55a]">AI</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-gray-600">
                        <a href="#features" className="hover:text-gray-400 transition-colors">{t('landing_features')}</a>
                        <a href="#pricing" className="hover:text-gray-400 transition-colors">{t('landing_pricing')}</a>
                    </div>
                    <p className="text-[11px] text-gray-700">{t('landing_footer')}</p>
                </div>
            </footer>
        </div>
    )
}