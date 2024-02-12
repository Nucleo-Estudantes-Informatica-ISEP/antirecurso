const Custom403: React.FC = () => {
  return (
    <div className="flex h-full w-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">
        <span className="text-primary">Oops...</span> Something went{' '}
        <span className="text-primary">wrong!</span>
      </h1>
    </div>
  );
};

export default Custom403;
