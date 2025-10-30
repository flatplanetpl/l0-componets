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
          <p className="text-3xl font-extrabold text-gray-900">{stat.number}</p>
          <p className="mt-2 text-lg font-medium text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;