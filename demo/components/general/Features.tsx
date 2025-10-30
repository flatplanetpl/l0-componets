interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  features: Feature[];
}

const Features = ({ features }: FeaturesProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="rounded-lg border border-border bg-card p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="text-3xl mb-4">{feature.icon}</div>
          <h3 className="text-lg font-medium text-foreground transition-colors dark:text-slate-100">{feature.title}</h3>
          <p className="mt-2 text-muted-foreground transition-colors dark:text-slate-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
