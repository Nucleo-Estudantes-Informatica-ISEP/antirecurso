import Hero from '@/components/Hero';
import Topbar from '@/components/Topbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen h-screen">
      <Topbar />
      <Hero />
    </div>
  );
};

export default Home;
