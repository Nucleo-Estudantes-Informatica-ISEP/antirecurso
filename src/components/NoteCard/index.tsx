'use client';

import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import { Eye, ThumbsUp, ThumbsUpOutline } from '@/styles/Icons';
import Note from '@/types/Note';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import swal from 'sweetalert';

interface NoteCardParams {
  note: Note;
}

const NoteCard: React.FC<NoteCardParams> = ({ note }) => {
  const [likes, setLikes] = useState(note.likes);
  const [isLiked, setIsLiked] = useState(note.is_liked);

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

    setLikes((cur) => (isLiked ? cur - 1 : cur + 1));
    setIsLiked((cur) => !cur);
  }

  async function handleVisitNote(note: Note) {
    const res = await fetch(BASE_URL + '/notes/' + note.id + '/view', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) swal('Erro', 'Não foi possível registar a visita ao resumo', 'error');

    const data = await res.json();

    window.open(data.url, '_blank');
  }

  return (
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
              <span>({note.n_pages} páginas)</span>
            </span>
          )}
          <span className="flex items-center justify-center gap-x-1.5 text-base font-light">
            <button
              onClick={() => handleLikeNote(note.id)}
              className="hover:bg-gray-100 dark:hover:bg-cool-gray-700 p-2 rounded-full ">
              {isLiked ? (
                <ThumbsUp className="text-base" />
              ) : (
                <ThumbsUpOutline className="text-base" />
              )}
            </button>
            {likes}
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
  );
};

export default NoteCard;
