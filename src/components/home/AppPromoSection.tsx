import type { HomeContent } from '@/hooks/useHomeContent';

interface AppPromoSectionProps {
  data: HomeContent['appPromo'];
}

const AppPromoSection = ({ data }: AppPromoSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-brand-600 py-20 text-white">
      <div className="container-cs grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold leading-tight text-white">{data.title}</h2>
          <p className="text-white/80">{data.description}</p>
          <div className="flex flex-wrap items-center gap-4">
            <img src="/images/playStore.svg" alt="Get it on Google Play" className="h-14 w-auto" loading="lazy" />
            <img src="/images/app-store.svg" alt="Download on the App Store" className="h-14 w-auto" loading="lazy" />
          </div>
          <form className="mt-6 grid gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <label className="text-sm font-medium text-white">Get the download link</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="tel"
                placeholder="+91 Enter your mobile number"
                className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:border-brand-200 focus:outline-none"
              />
              <button type="submit" className="btn-primary flex w-full justify-center bg-white text-indigo-950 hover:bg-brand-100 sm:w-auto">
                Send Link
              </button>
            </div>
          </form>
        </div>
        <div className="relative">
          <div className="absolute -left-10 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <img src={data.image} alt="Mobile preview" className="relative z-10 mx-auto max-w-md" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
