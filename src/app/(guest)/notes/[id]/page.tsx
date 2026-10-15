import { getMessages } from '@/i18n/server';
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
  const t = await getMessages();

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
          {t('nav.notes')}
        </Badge>
        {subject ? (
          <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
            {t('copy.study_notes_for')} <span className="gradient-text capitalize">{subject}</span>
          </h1>
        ) : (
          <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
            {t('copy.study_notes_for_2')} <span className="gradient-text">{t('copy.subject')}</span>
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
              {t('copy.it_looks_like_there_are_no')}{' '}
              <span className="font-bold text-primary">{t('copy.study_notes')}</span>{' '}
              {t('copy.here_yet')}
            </p>
            <p className="mt-3 max-w-lg mx-auto text-sm text-muted-foreground">
              {t('copy.want_to_help_your_classmates_prepare_for_exams_send_us_your_study_notes')}
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
