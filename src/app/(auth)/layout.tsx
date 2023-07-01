import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-full px-6 sm:p-0">
      <div className="flex flex-col items-center justify-center flex-1 h-full max-w-4xl bg-white rounded-lg shadow-xl dark:shadow-secondary-dark lg:flex-row dark:bg-primary-dark">
        <div className="relative w-full h-32 md:h-full md:w-1/2">
          <Image
            aria-hidden="true"
            fill
            className="object-cover"
            src="/images/isep.jpg"
            alt="Office"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
