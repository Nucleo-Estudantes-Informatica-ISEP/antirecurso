'use client';

import { Flag } from '@/styles/Icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { BASE_URL } from 'src/services/api';
import getToken from 'src/services/getToken';
import swal from 'sweetalert';
import Comment from '../../types/Comment';
import InputLabel from '../InputLabel';
import PrimaryButton from '../PrimaryButton';

interface CommentSectionProps {
  comments: Comment[] | undefined;
  submitComment: (comment: string) => void;
  removeEventListener: () => void;
  addListener: () => void;
  questionId: number | undefined;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  submitComment,
  removeEventListener,
  addListener,
  questionId
}) => {
  const [token, setToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { theme } = useTheme();

  async function getUserToken() {
    const t = await getToken();
    setToken(t);
  }

  function handleSubmit() {
    const comment = document.getElementById('comment') as HTMLInputElement;
    if (!comment) return;
    const commentValue = comment.value;

    submitComment(commentValue);

    if (!inputRef.current) return;
    inputRef.current.value = '';
  }

  async function handleReportQuestion() {
    if (!questionId) return;

    const result = await swal({
      text: 'O que está errado com esta pergunta?',
      content: {
        element: 'input'
      },
      buttons: ['Cancelar', 'Reportar'],
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (result === null) return;

    const res = await fetch(BASE_URL + '/question-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        question_id: questionId,
        reason: result
      })
    });

    if (res.status === 201)
      swal({
        title: 'Reported!',
        text: 'A tua denúncia foi enviada com sucesso!',
        icon: 'success',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    else
      swal({
        title: 'Erro!',
        text: 'Algo correu mal ao enviar a tua denúncia. Por favor, tenta novamente.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
  }

  useEffect(() => {
    getUserToken();
  }, [comments]);

  return (
    <section className="w-full ml-0 md:ml-32 my-14">
      {!token ? (
        <p className="w-5/6 text-center md:text-start">
          <Link href="/register" target="_blank" className="font-semibold text-primary">
            Cria
          </Link>{' '}
          ou{' '}
          <Link href="/login" target="_blank" className="font-semibold text-primary">
            entra numa conta
          </Link>{' '}
          para poderes comentar e reportar possíveis erros!
        </p>
      ) : (
        <>
          <div className="flex flex-col w-full mb-5 space-y-5">
            <div className="w-5/6 mx-auto md:w-full">
              <InputLabel value="Comentário" />
              <textarea
                ref={inputRef}
                rows={3}
                id="comment"
                name="comment"
                onFocus={() => {
                  document.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSubmit();
                    }
                  });
                  removeEventListener();
                }}
                onBlur={addListener}
                className="block w-full mx-auto mt-1 border-gray-300 rounded-md shadow-sm resize-none dark:text-white dark:bg-primary-dark dark:shadow-secondary-dark md:mx-0 md:w-1/2 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600"></textarea>
            </div>
            <div className="flex items-center w-5/6 mx-auto md:mx-0 gap-x-6">
              <PrimaryButton onClick={handleSubmit} className="w-full h-10 md:w-32">
                Comentar
              </PrimaryButton>
              <button onClick={handleReportQuestion}>
                <Flag
                  size={20}
                  className="transition-all duration-150 ease-in-out hover:text-red-700 hover:fill-red-500"
                />
              </button>
            </div>
          </div>
          {comments !== undefined ? (
            <div>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="w-11/12 h-auto p-5 mx-auto my-5 bg-white border border-gray-100 rounded shadow dark:shadow-secondary-dark md:mx-0 dark:bg-primary-dark">
                  <p className="flex items-center font-semibold gap-x-2">
                    {comment.user}
                    {comment.is_admin && (
                      <img className="w-5 h-5" src="/images/nei-logo.png" alt="Admin" />
                    )}
                    <span className="text-xs font-thin text-gray-500">{comment.created_at}</span>
                  </p>
                  <p className="mt-2 text-sm md:text-md">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <Skeleton className="w-1/2 max-w-[480px] h-10 mb-3" count={4} />
          )}
        </>
      )}
    </section>
  );
};

export default CommentSection;
