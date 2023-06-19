'use client';

import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useToken from 'src/hooks/useToken';
import Comment from '../../types/Comment';
import InputLabel from '../InputLabel';
import PrimaryButton from '../PrimaryButton';

interface CommentSectionProps {
  comments: Comment[] | undefined;
  submitComment: (comment: string) => void;
  removeEventListener: () => void;
  addListener: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  submitComment,
  removeEventListener,
  addListener
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
    inputRef.current!.value = '';
  }

  useEffect(() => {
    getUserToken();
  }, [comments]);

  return (
    <section className="ml-32 my-16">
      {!token ? (
        <p>
          <span className="font-semibold text-primary">Cria</span> ou{' '}
          <span className="font-semibold text-primary">entra numa conta</span> para poderes
          comentar!
        </p>
      ) : (
        <>
          <div className="w-full flex flex-col space-y-5 mb-5">
            <div className="w-full">
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
                className="block w-full md:w-1/2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600 resize-none"></textarea>
            </div>
            <PrimaryButton onClick={handleSubmit} className="h-10 w-full md:w-32">
              Comentar
            </PrimaryButton>
          </div>
          {comments !== undefined ? (
            <div>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="w-11/12 shadow border border-gray-100 rounded h-auto p-5 bg-white my-5">
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
