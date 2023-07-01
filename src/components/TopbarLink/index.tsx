import Link from 'next/link';

interface TopbarLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const TopbarLink: React.FC<TopbarLinkProps> = ({ href, children, onClick }) => {
  return (
    <>
      <Link
        onClick={onClick}
        href={href}
        className="transition ease-in-out hover:text-primary dark:text-white">
        <button>{children}</button>
      </Link>
    </>
  );
};

export default TopbarLink;
