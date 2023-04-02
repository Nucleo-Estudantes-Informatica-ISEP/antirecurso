import Hero from '@/components/Hero';
import Topbar from '@/components/Topbar';

const Home: React.FC = () => {
  return (
    <div className="h-full">
      <Topbar />
      <Hero />
    </div>
  );
};

export default Home;
