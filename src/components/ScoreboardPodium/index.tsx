import Image from 'next/image';

// interface ScoreboardPodiumProps {}

const ScoreboardPodium: React.FC = () => {
  return (
    <div className="flex flex-row justify-center items-start mb-6">
      <div className="flex flex-col items-center px-14 pt-24">
        <Image
          className="w-32 rounded-full aspect-square"
          src="/images/podium/silver.svg"
          alt="User 1"
          width={80}
          height={80}
        />
        <div className="flex flex-col items-center py-4">
          <p className="text-2xl font-bold">Nome 2</p>
          <p className="text-2xl font-bold bg-orange-200 px-4 rounded-full">93.83</p>
        </div>
      </div>
      <div className="flex flex-col items-center bg-gradient-to-b from-primary to-transparent rounded-t-2xl px-14 py-12">
        <div className="relative">
          <Image
            className="w-32 rounded-full aspect-square"
            src="/images/default-avatar.svg"
            alt="User 2"
            width={80}
            height={80}
          />
          <Image
            className="w-8 rounded-full aspect-square absolute right-0 top-0"
            src="/images/podium/gold-small.svg"
            alt="User 2"
            width={80}
            height={80}
          />
        </div>
        <div className="flex flex-col items-center py-4">
          <p className="text-2xl font-bold">Nome 1</p>
          <p className="text-2xl font-bold">97.60</p>
        </div>
      </div>
      <div className="flex flex-col items-center px-14 pt-24">
        <Image
          className="w-32 rounded-full aspect-square"
          src="/images/podium/bronze.svg"
          alt="User 3"
          width={80}
          height={80}
        />
        <div className="flex flex-col items-center py-4">
          <p className="text-2xl font-bold">Nome 3</p>
          <p className="text-2xl font-bold">93.14</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardPodium;
