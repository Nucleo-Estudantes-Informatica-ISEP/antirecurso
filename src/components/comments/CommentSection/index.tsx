'use client';

import { useMessages } from '@/i18n/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import useSession from '@/hooks/useSession';
import { apiRequest } from '@/services/apiClient';
import { Comment } from '@/types/Comment';
import { Flag, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from '@/i18n/navigation';
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
  const t = useMessages();

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
      text: t('copy.what_is_wrong_with_this_question_please_be_as_specific_as_possible'),
      content: { element: 'input' },
      buttons: [t('copy.cancel'), 'Reportar'],
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (result === null) return;

    try {
      await apiRequest('question-reports', {
        authenticated: true,
        method: 'POST',
        json: { question_id: questionId, reason: result }
      });
      swal({
        title: t('feedback.reported'),
        text: t('copy.your_report_was_sent_successfully'),
        icon: 'success',
        className: theme === 'dark' ? 'swal-dark' : '',
        timer: 2000
      });
    } catch {
      swal({
        title: t('feedback.error'),
        text: t('copy.something_went_wrong_while_sending_your_report_please_try_again'),
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('copy.discussion')}</h2>
      </div>

      {!session.user ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            <Link href="/register" className="font-semibold text-primary hover:underline">
              {t('copy.create_an_account')}
            </Link>{' '}
            {t('copy.or_2')}{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {t('copy.sign_in_2')}
            </Link>{' '}
            {t('copy.to_comment_and_report_possible_errors')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <Textarea
            ref={inputRef}
            rows={3}
            id="comment"
            name="comment"
            placeholder={t('copy.write_your_comment_here')}
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
              {t('copy.report_question')}
            </Button>
            <Button onClick={handleSubmit}>{t('copy.comment_2')}</Button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {comments !== undefined ? (
          comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('copy.no_comments_for_this_question_yet')}
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
