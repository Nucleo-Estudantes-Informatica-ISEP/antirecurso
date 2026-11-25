import Hero from '@/components/pages/Hero';
import { pageMetadata } from '@/lib/page-metadata';

export const generateMetadata = () => pageMetadata('/', 'seo.siteTitle', 'seo.siteDescription');

const Home: React.FC = () => {
  return <Hero />;
};

export default Home;
