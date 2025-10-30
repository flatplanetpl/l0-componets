interface Stat {
  number: string;
  label: string;
}

interface StatsProps {
  stats: Stat[];
}

const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <p className="text-3xl font-extrabold text-foreground transition-colors dark:text-slate-100">{stat.number}</p>
          <p className="mt-2 text-lg font-medium text-muted-foreground transition-colors dark:text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
