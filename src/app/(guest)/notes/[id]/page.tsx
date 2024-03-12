import Custom403 from '@/components/Custom403';
import NoteCard from '@/components/NoteCard';
import config from '@/config';
import fetchNotes from '@/services/fetchNotes';
import { cookies } from 'next/headers';

interface SubjectNotesProps {
  params: {
    id: string;
  };
}

// @ts-expect-error Server Component
const SubjectNotes: React.FC<SubjectNotesProps> = async ({ params }) => {
  const token = cookies().get(config.cookies.token)?.value;

  if (!token) {
    return <Custom403 />;
  }

  const notes = await fetchNotes(params.id, token);
  const subject = notes.data[0]?.subject.name;

  return (
    <section className="flex flex-col items-center gap-y-8 py-8 w-full text-center px-6 md:px-16 relative">
      {subject && (
        <p className="w-5/6 px-4 text-2xl font-bold text-center uppercase md:text-3xl my-5">
          Resumos de <span className="text-primary"> {subject}</span>
        </p>
      )}

      {notes.data.length === 0 ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-y-4 flex flex-col">
          <p className="text-xl font-bold">
            Parece que ainda não há nenhum <span className="font-bold text-primary">resumo</span>{' '}
            aqui...
          </p>
          <p className="md:text-lg w-full">
            Queres ajudar os teus colegas a prepararem-se para os exames? Envia-nos o teus
            <span className="text-primary font-bold"> resumos</span> para{' '}
            <a className="underline text-primary" href="mailto:support.antirecurso@nei-isep.org">
              support.antirecurso@nei-isep.org
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center w-full items-center gap-16">
          {notes.data.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SubjectNotes;
