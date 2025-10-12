import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const featureSections = [
  {
    title: 'Routine Services',
    paragraphs: [
      'Car routine services are essential to keep your car running smoothly and efficiently. If you neglect these routine services, your vehicle will likely break down and require repairs.',
      'Many drivers are not aware of the importance of car routine services. They think that as long as they change the engine oil, that is enough for their vehicle. But this is not true—there are many other important factors to keep your car running smoothly and efficiently.'
    ],
    highlight:
      'At Car Service Wale, we offer a range of routine car service solutions such as oil changes, brake pads replacement, engine tune-up, and more.',
    bullets: ['Oil changes', 'Tire rotation / Alignment & Balancing', 'Brake check', 'Air filter replacement', 'Fuel filter replacement']
  },
  {
    title: 'Wheel Care Services',
    paragraphs: [
      'Car wheel services are vital because they ensure perfect drivability for the car. The wheels are one of the essential components of a vehicle; when they are not well maintained, it can lead to substantial problems for the car.',
      'The wheels also have a significant impact on vehicle performance. If you want to get maximum mileage from your car, you should consider getting these services done on time. Car wheel services can be expensive, but if you want to keep your car in good condition and save money in the long run, it is worth investing in these services.'
    ],
    highlight:
      'If you want to keep your wheels in pristine condition, our wheel care service is the best option. We provide wheel balancing, cleaning, and detailing services to get rid of dirt and debris from your tyres.'
  },
  {
    title: 'Battery Care Services',
    paragraphs: [
      'We should take care of our car battery to make sure it is in good condition. To get the best out of your car battery, you need to ensure regular maintenance and checking for corrosion, loose cables, and other problems.',
      'It is important to know the difference between a normal and a dead battery. When your battery is running low on power, it usually starts vibrating or making a whirring sound. If you do not charge it soon enough, the engine will stop working and will not start up again.'
    ],
    highlight:
      'Do you want to keep your car battery going strong? We have the perfect solution for you with our battery care service, including battery check-ups and battery replacements.'
  },
  {
    title: 'AC Care & Repair',
    paragraphs: [
      'A car AC is one of the most critical components in a vehicle. It ensures that the car has a comfortable temperature and helps keep it clean and dust-free. A car AC service is required when there are problems with the cooling system or any other issues with the AC.',
      'Car AC services can be expensive if not done correctly. However, if you know what to do and where to go for help, it can be more affordable. Regular AC inspections help you avoid sudden breakdowns in the summer months.'
    ],
    highlight:
      'Our AC care service covers leak detection, refrigerant top-ups, cleaning of vents, and compressor performance checks to keep your cabin cool.'
  }
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | About Us</title>
        <meta
          name="description"
          content="Learn how Car Service Wale transforms automobile care with transparent pricing, trained technicians, and genuine spare parts."
        />
      </Helmet>
      <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/backgrounds/banner-bg.jpg)' }}>
        <div className="absolute inset-0 bg-indigo-950/75" />
        <div className="container-cs relative z-10 flex flex-col gap-10 py-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200/80">Our Story</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Redefining car care in India</h1>
            <p className="text-lg text-white/80">
              Car Service Wale is your one-stop shop for routine servicing, wheel care, battery care, AC repair, detailing,
              and cleaning—powered by genuine spares and expert technicians.
            </p>
          </div>
          <img src="/images/hero/service-banner.svg" alt="Service" className="w-full max-w-md drop-shadow-2xl" loading="lazy" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-cs">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-indigo-950">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-indigo-950">About Us</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-cs grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-600">Car Service Wale</span>
            <p className="text-slate-600">
              Car Service Wale is your one-stop-shop for all your car care and maintenance needs. We provide routine
              servicing, wheel care, battery care, AC care, repair, detailing, and cleaning services at the best prices with
              unmatched quality!
            </p>
            <p className="text-slate-600">
              We ensure that our customers get the best quality services at the most competitive prices. Our experts are
              well-trained in their respective fields, with years of experience delivering quality work. We have service
              centers all over Kolkata, so hiring a mechanic near you will never be an issue.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img src="/images/backgrounds/benefit-bg.jpg" alt="Workshop" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-cs space-y-10">
          <h2 className="text-3xl font-bold text-indigo-950">Features &amp; Services</h2>
          <div className="grid gap-10 lg:grid-cols-2">
            {featureSections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
                <h3 className="text-2xl font-semibold text-indigo-950">{section.title}</h3>
                <div className="mt-4 space-y-4 text-sm text-slate-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-5 space-y-2 text-sm text-slate-600">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-brand-600">*</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-indigo-950">{section.highlight}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
