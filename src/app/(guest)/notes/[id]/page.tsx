'use client';

import Custom403 from '@/components/Custom403';
import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import fetchNotes from '@/services/fetchNotes';
import { Eye, ThumbsUp, ThumbsUpOutline } from '@/styles/Icons';
import Note from '@/types/Note';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';

interface SubjectNotesProps {
  params: {
    id: string;
  };
}

const SubjectNotes: React.FC<SubjectNotesProps> = ({ params }) => {
  const [notes, setNotes] = useState<Note[] | null>([]);
  const { token, user } = useSession();

  async function handleLikeNote(id: number) {
    const res = await fetch(BASE_URL + '/notes/' + id + '/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) swal('Erro', 'Não foi possível gostar do resumo', 'error');

    const newNotes = notes?.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          is_liked: !note.is_liked,
          likes: note.is_liked ? note.likes - 1 : note.likes + 1
        };
      }
      return note;
    });

    setNotes(newNotes ?? null);
  }

  async function handleVisitNote(note: Note) {
    const res = await fetch(BASE_URL + '/notes/' + note.id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) swal('Erro', 'Não foi possível registar a visita ao resumo', 'error');

    window.open(note.url, '_blank');
  }

  useEffect(() => {
    async function getNotes() {
      if (!token) {
        setNotes(null);
        return;
      }

      try {
        const n = await fetchNotes(params.id, token);
        setNotes(n);
      } catch (e) {
        setNotes(null);
      }
    }

    getNotes();
  }, [params.id, token]);

  if (notes === null) return <Custom403 />;

  const subject = notes[0]?.subject.name;

  return (
    <section className="flex flex-col items-center gap-y-8 py-8 w-full text-center px-6 md:px-16 relative">
      {subject && (
        <p className="w-5/6 px-4 text-2xl font-bold text-center uppercase md:text-3xl my-5">
          Resumos de <span className="text-primary"> {subject}</span>
        </p>
      )}

      {notes.length === 0 ? (
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
          {notes.map((note) => (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              className="text-lg border border-slate-800 w-full max-w-[520px] p-4 md:p-8 h-full rounded-md shadow-sm md:text-xl font-bold transition-colors duration-200 flex items-center justify-between flex-col ease-in-out"
              key={note.id}>
              <div className="flex items-center flex-col md:flex-row md:items-center justify-between w-full my-2">
                <h2 className="whitespace-nowrap text-left text-primary text-xl">{note.title}</h2>
                <span className="font-bold text-sm md:text-base">
                  {new Date(note.created_at).toLocaleDateString('pt-PT', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
              <p className="text-left w-full mt-2 mb-4 text-base font-thin">{note.description}</p>
              <div className="flex md:items-center w-full justify-between">
                <div className="flex items-center gap-x-3">
                  <Image
                    className="w-6 md:w-8 rounded-full aspect-square"
                    src={`https://gravatar.com/avatar/${note.user.avatar}?s=64&d=identicon`}
                    alt={note.user.name}
                    loading="lazy"
                    width={32}
                    height={32}
                  />
                  <span className="text-base md:text-lg leading-5">
                    {note.user.name} {note.user.email === user?.email ? '(Tu)' : ''}
                  </span>
                </div>
                <div className="flex md:items-center items-end justify-end gap-x-6 flex-col md:flex-row">
                  {note.n_pages && (
                    <span className="flex items-center justify-center gap-x-1.5 text-base font-light">
                      ({note.n_pages} <span>páginas</span>)
                    </span>
                  )}
                  <span className="flex items-center justify-center gap-x-1.5 text-base font-light">
                    <button
                      onClick={() => handleLikeNote(note.id)}
                      className="hover:bg-gray-100 dark:hover:bg-cool-gray-700 p-2 rounded-full ">
                      {note.is_liked ? (
                        <ThumbsUp className="text-base" />
                      ) : (
                        <ThumbsUpOutline className="text-base" />
                      )}
                    </button>
                    {note.likes}
                  </span>
                  <span className="flex items-center justify-center gap-x-1.5 font-light text-base">
                    <Eye className="text-base mr-2" />
                    {note.views}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleVisitNote(note)}
                className="bg-primary border-slate-200 md:py-1.5 py-1 text-base rounded-sm text-white w-full mt-4">
                Ver resumo
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SubjectNotes;
