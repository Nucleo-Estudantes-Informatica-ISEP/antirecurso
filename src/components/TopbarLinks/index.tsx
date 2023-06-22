import Link from 'next/link';

const TopbarLinks = () => {
  return (
    <>
      <Link href="/" className="hover:text-primary transition ease-in-out">
        <button>Home</button>
      </Link>
      <Link href="/exams" className="hover:text-primary transition ease-in-out">
        <button>Exames</button>
      </Link>
      <Link href="/scoreboard" className="hover:text-primary transition ease-in-out">
        <button>Scoreboard</button>
      </Link>
      <Link href="/about" className="hover:text-primary transition ease-in-out">
        <button>About</button>
      </Link>
    </>
  );
};

export default TopbarLinks;
