import Hero from '@/components/Hero';
import Topbar from '@/components/Topbar';

const Home: React.FC = () => {
  return (
    <div className="h-screen">
      <Topbar />
      <Hero />
    </div>
  );
};

export default Home;
