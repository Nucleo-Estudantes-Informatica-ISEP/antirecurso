'use client';

import { Flag } from '@/styles/Icons';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useToken from 'src/hooks/useToken';
import { BASE_URL } from 'src/services/api';
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

  async function getUserToken() {
    const t = await useToken();
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
      text: 'What is wrong? (Optional)',
      content: {
        element: 'input'
      },
      buttons: ['Cancel', 'Report']
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
        text: 'Your report has been sent to the admins!',
        icon: 'success'
      });
    else
      swal({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error'
      });
  }

  useEffect(() => {
    getUserToken();
  }, [comments]);

  return (
    <section className="ml-4 md:ml-32 my-14 w-full">
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
          <div className="w-full flex flex-col space-y-5 mb-5">
            <div className=" w-5/6 mx-auto md:w-full">
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
                className="block w-full md:mx-0 mx-auto md:w-1/2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600 resize-none"></textarea>
            </div>
            <div className="w-5/6 md:mx-0 mx-auto flex items-center gap-x-6">
              <PrimaryButton onClick={handleSubmit} className="h-10 w-full md:w-32">
                Comentar
              </PrimaryButton>
              <button onClick={handleReportQuestion}>
                <Flag
                  size={20}
                  className="hover:text-red-700 hover:fill-red-500 transition-all duration-150 ease-in-out"
                />
              </button>
            </div>
          </div>
          {comments !== undefined ? (
            <div>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="w-11/12 mx-auto md:mx-0 shadow border border-gray-100 rounded h-auto p-5 bg-white my-5">
                  <p className="font-semibold flex items-center gap-x-2">
                    {comment.user}
                    {comment.is_admin && (
                      <img className="h-5 w-5" src="/images/nei-logo.png" alt="Admin" />
                    )}
                    <span className="font-thin text-xs text-gray-500">{comment.created_at}</span>
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
