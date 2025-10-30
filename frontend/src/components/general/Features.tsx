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
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">{feature.icon}</div>
          <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
          <p className="mt-2 text-gray-500">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;