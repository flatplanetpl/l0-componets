import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaAction?: () => void;
  secondaryCtaText?: string;
  secondaryCtaAction?: () => void;
  showImage?: boolean;
  imageUrl?: string;
  altText?: string;
}

const Hero = ({ 
  title, 
  subtitle, 
  ctaText = "Get Started", 
  ctaAction, 
  secondaryCtaText, 
  secondaryCtaAction,
  showImage = true,
  imageUrl = "/api/placeholder/600/400",
  altText = "Hero image"
}: HeroProps) => {
  return (
    <div className="relative overflow-hidden bg-card transition-colors dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-card transition-colors dark:bg-slate-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{title}</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground transition-colors dark:text-slate-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {subtitle}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={ctaAction}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    {ctaText}
                  </button>
                </div>
                {secondaryCtaText && (
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={secondaryCtaAction}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 dark:text-blue-300 dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
                    >
                      {secondaryCtaText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {showImage && (
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-muted transition-colors dark:bg-slate-800 sm:h-72 md:h-96 lg:w-full lg:h-full">
            <Image
              src={imageUrl}
              alt={altText}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
