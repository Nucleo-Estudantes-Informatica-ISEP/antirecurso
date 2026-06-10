import NoteCard from '@/components/notes/NoteCard';
import Custom403 from '@/components/pages/Custom403';
import { Badge } from '@/components/ui/badge';
import { getApiAccessToken } from '@/lib/server-auth';
import fetchNotes from '@/services/fetchNotes';
import { BookOpen, Mail } from 'lucide-react';

interface SubjectNotesProps {
  params: Promise<{
    id: string;
  }>;
}

const SubjectNotes: React.FC<SubjectNotesProps> = async ({ params }) => {
  const { id } = await params;
  const token = await getApiAccessToken();

  if (!token) {
    return <Custom403 />;
  }

  const notes = await fetchNotes(id, token);
  const subject = notes.data[0]?.subject.name;

  return (
    <section className="container py-10 md:py-14 w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          Resumos
        </Badge>
        {subject ? (
          <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
            Resumos de <span className="gradient-text capitalize">{subject}</span>
          </h1>
        ) : (
          <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
            Resumos da <span className="gradient-text">disciplina</span>
          </h1>
        )}
      </div>

      {notes.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-7" />
          </div>
          <div>
            <p className="text-xl font-semibold">
              Parece que ainda não há nenhum{' '}
              <span className="font-bold text-primary">resumo</span> aqui...
            </p>
            <p className="mt-3 max-w-lg mx-auto text-sm text-muted-foreground">
              Queres ajudar os teus colegas a prepararem-se para os exames? Envia-nos os teus
              resumos.
            </p>
          </div>
          <a
            href="mailto:support.antirecurso@nei-isep.org"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <Mail className="size-4" />
            support.antirecurso@nei-isep.org
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {notes.data.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SubjectNotes;
