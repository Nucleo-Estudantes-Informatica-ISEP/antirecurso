'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import { Comment } from '@/types/Comment';
import { Flag, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import swal from 'sweetalert';

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
  const session = useSession();
  const { theme } = useTheme();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const comment = document.getElementById('comment') as HTMLInputElement;
    if (!comment) return;
    const commentValue = comment.value;
    if (!commentValue?.trim()) return;
    submitComment(commentValue);
    if (!inputRef.current) return;
    inputRef.current.value = '';
  }

  async function handleReportQuestion() {
    if (!questionId || !session.user) return;

    const result = await swal({
      text: 'O que está errado com esta pergunta? Tenta ser o mais explicito possível.',
      content: { element: 'input' },
      buttons: ['Cancelar', 'Reportar'],
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (result === null) return;

    const res = await fetch(PROTECTED_API_BASE_URL + '/question-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`
      },
      body: JSON.stringify({ question_id: questionId, reason: result })
    });

    if (res.status === 201)
      swal({
        title: 'Reportado!',
        text: 'A tua denúncia foi enviada com sucesso!',
        icon: 'success',
        className: theme === 'dark' ? 'swal-dark' : '',
        timer: 2000
      });
    else
      swal({
        title: 'Erro!',
        text: 'Algo correu mal ao enviar a tua denúncia. Por favor, tenta novamente.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">Discussão</h2>
      </div>

      {!session.user ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Cria
            </Link>{' '}
            ou{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              entra na tua conta
            </Link>{' '}
            para poderes comentar e reportar possíveis erros.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <Textarea
            ref={inputRef}
            rows={3}
            id="comment"
            name="comment"
            placeholder="Escreve aqui o teu comentário..."
            onFocus={() => {
              document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
              });
              removeEventListener();
            }}
            onBlur={addListener}
          />
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReportQuestion}
              className="text-muted-foreground hover:text-destructive"
            >
              <Flag className="size-4" />
              Reportar pergunta
            </Button>
            <Button onClick={handleSubmit}>Comentar</Button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {comments !== undefined ? (
          comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ainda não há comentários para esta pergunta.
            </p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4 md:p-5 flex items-start gap-3">
                  <Avatar className="size-9 md:size-10">
                    <AvatarImage
                      src={`https://gravatar.com/avatar/${comment.user_avatar}?s=64&d=identicon`}
                      alt={comment.user}
                    />
                    <AvatarFallback>{comment.user?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {comment.user}
                      {comment.is_admin && (
                        <Image
                          className="size-4 rounded-full"
                          src="/images/nei-logo.png"
                          alt="Admin"
                          width={16}
                          height={16}
                        />
                      )}
                      <span className="text-xs font-normal text-muted-foreground">
                        {comment.created_at}
                      </span>
                    </p>
                    <p className="mt-1.5 text-sm text-foreground/90 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )
        ) : (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
