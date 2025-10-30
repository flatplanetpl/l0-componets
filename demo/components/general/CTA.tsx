interface CTAProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonAction: () => void;
  secondaryButtonText?: string;
  secondaryButtonAction?: () => void;
  bgColor?: 'blue' | 'gray' | 'indigo';
}

const CTA = ({ 
  title, 
  subtitle, 
  primaryButtonText, 
  primaryButtonAction, 
  secondaryButtonText, 
  secondaryButtonAction,
  bgColor = 'blue'
}: CTAProps) => {
  const bgClasses = {
    blue: 'bg-blue-700 dark:bg-blue-600',
    gray: 'bg-gray-700 dark:bg-slate-800',
    indigo: 'bg-indigo-700 dark:bg-indigo-600'
  };

  const hoverClasses = {
    blue: 'bg-blue-800 dark:bg-blue-700',
    gray: 'bg-gray-800 dark:bg-slate-700',
    indigo: 'bg-indigo-800 dark:bg-indigo-700'
  };

  return (
    <div className={bgClasses[bgColor]}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">{title}</span>
          <span className="block text-blue-200 dark:text-blue-100/80">{subtitle}</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <button
              onClick={primaryButtonAction}
              className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-${bgColor}-600 bg-card hover:bg-${bgColor}-50 dark:text-foreground dark:bg-card/90 dark:hover:bg-card`}
            >
              {primaryButtonText}
            </button>
          </div>
          {secondaryButtonText && (
            <div className="ml-3 inline-flex rounded-md shadow">
              <button
                onClick={secondaryButtonAction}
                className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-${bgColor}-800 hover:${hoverClasses[bgColor]}`}
              >
                {secondaryButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTA;
