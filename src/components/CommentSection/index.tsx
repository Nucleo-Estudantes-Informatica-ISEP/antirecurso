'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useToken from 'src/hooks/useToken';
import { BASE_URL } from 'src/services/api';
import Comment from '../../types/Comment';
import InputLabel from '../InputLabel';
import PrimaryButton from '../PrimaryButton';

interface CommentSectionProps {
  comments: Comment[] | undefined;
  questionId: number | undefined;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, questionId }) => {
  const [token, setToken] = useState<string | null>(null);
  //  const [c, setComments] = useState<Comment[] | undefined>(comments);
  const [c, setComments] = useState<Comment[] | undefined>([
    {
      id: 1,
      comment: 'sample',
      user_id: 1,
      question_id: 2,
      created_at: new Date('2023-06-14T08:11:21.000000Z')
    },
    {
      id: 2,
      comment: 'sample2',
      user_id: 1,
      question_id: 2,
      created_at: new Date('2023-06-14T08:11:21.000000Z')
    }
  ]);

  async function getUserToken() {
    const t = await useToken();
    setToken(t);
  }

  async function submitComment() {
    const comment = document.getElementById('comment') as HTMLInputElement;
    const commentValue = comment.value;

    await fetch(BASE_URL + '/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        comment: commentValue,
        question_id: questionId
      })
    });

    //TODO set comments
  }

  useEffect(() => {
    getUserToken();
  }, []);

  return (
    <section className="ml-32 my-16">
      {token ? (
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
                rows={3}
                id="comment"
                name="comment"
                className="block w-full md:w-1/2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600 resize-none"></textarea>
            </div>
            <PrimaryButton onClick={submitComment} className="h-10 w-full md:w-32">
              Comentar
            </PrimaryButton>
          </div>
          {c ? (
            <div>
              {c.map((comment) => (
                <div
                  key={comment.id}
                  className="w-11/12 shadow border border-gray-100 rounded h-auto p-5 bg-white my-5">
                  <p className="font-semibold">
                    {comment.user_id}{' '}
                    <span className="font-thin text-xs text-gray-500 ml-3">
                      {comment.created_at.toLocaleString()}
                    </span>
                  </p>
                  <p className="mt-2 text-sm md:text-md">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <Skeleton />
          )}
        </>
      )}
    </section>
  );
};

export default CommentSection;
