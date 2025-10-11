import { FormEvent, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import type { HomeContent } from '@/hooks/useHomeContent';

interface HeroSectionProps {
  data: HomeContent['hero'];
}

const HeroSection = ({ data }: HeroSectionProps) => {
  const { currentCity } = useAppStore();
  const [brand, setBrand] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!brand || !phone) {
      setMessage('Please share your car brand and contact number so we can call back.');
      return;
    }
    setMessage('Thanks! Our service advisor will call you within 15 minutes.');
    setBrand('');
    setPhone('');
  };

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/banner-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-indigo-950/60" />
      <div className="container-cs relative z-10 grid items-center gap-12 py-24 lg:grid-cols-2">
        <div className="space-y-6 text-white">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-white/80">
            Serving {currentCity.name}
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {data.headline} <span className="text-brand-200 block text-3xl font-light sm:text-4xl">{data.subheadline}</span>
          </h1>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">{data.description}</p>
          <div className="mt-10 grid gap-6 rounded-3xl bg-white/10 p-8 backdrop-blur">
            <div>
              <h3 className="text-xl font-semibold">Get instant quotes</h3>
              <p className="text-sm text-white/70">Share a few details and our advisors will reach out shortly.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-white">Select Brand</span>
                  <input
                    type="text"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    placeholder="Your car brand"
                    className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:border-brand-200 focus:outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-white">Mobile Number</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:border-brand-200 focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {data.brands.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setBrand(item.name)}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-500/70"
                  >
                    <img src={item.logo} alt={item.name} className="h-6 w-6" loading="lazy" />
                    {item.name}
                  </button>
                ))}
              </div>
              <button type="submit" className="btn-primary w-full justify-center bg-brand-500 text-white hover:bg-brand-600">
                {data.ctaText}
              </button>
              {message && <p className="text-sm text-brand-50">{message}</p>}
            </form>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
          <img
            src="/images/banner-image.svg"
            alt="Mechanic service"
            className="relative z-10 mx-auto max-w-xl drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
