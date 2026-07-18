const steps = [
  { title: "Pick a country", desc: "Germany, Norway, Italy — wherever you want to study." },
  { title: "Browse universities", desc: "English names, field tags, search by city." },
  { title: "Save your picks", desc: "Heart unis you like and compare them." },
];

export function HowItWorks() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">How it works</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="card p-4">
            <span className="text-sm font-medium text-blue-600">{i + 1}</span>
            <h3 className="mt-1 font-medium text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
