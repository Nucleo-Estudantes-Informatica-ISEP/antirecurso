import Link from 'next/link';

interface TopbarLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

const TopbarLink: React.FC<TopbarLinkProps> = ({ href, children, onClick }) => {
  return (
    <>
      <Link onClick={onClick} href={href} className="hover:text-primary transition ease-in-out">
        <button>{children}</button>
      </Link>
    </>
  );
};

export default TopbarLink;
