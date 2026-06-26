'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import Note from '@/types/Note';
import { motion } from 'framer-motion';
import { Eye, ExternalLink, FileText, Heart } from 'lucide-react';
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
    const res = await fetch(PROTECTED_API_BASE_URL + '/notes/' + id + '/like', {
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
    const res = await fetch(PROTECTED_API_BASE_URL + '/notes/' + note.id + '/view', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) swal('Erro', 'Não foi possível registar a visita ao resumo', 'error');

    const data = await res.json();
    window.open(data.url, '_blank');
  }

  const userInitials = note.user.name
    ? note.user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
    >
      <Card className="h-full flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
        <CardContent className="p-5 md:p-6 flex flex-col gap-4 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-bold leading-tight truncate">
                  {note.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(note.created_at).toLocaleDateString('pt-PT', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>
            {note.n_pages && (
              <Badge variant="outline" className="shrink-0 font-medium">
                {note.n_pages} pág
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {note.description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-3 border-t">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-7">
                <AvatarImage
                  src={`https://gravatar.com/avatar/${note.user.avatar}?s=64&d=identicon`}
                  alt={note.user.name}
                />
                <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium truncate">
                {note.user.name}
                {note.user.email === user?.email && (
                  <span className="text-muted-foreground"> (Tu)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeNote(note.id)}
                className="h-8 px-2 text-muted-foreground"
              >
                <Heart
                  className={`size-4 ${isLiked ? 'fill-primary text-primary' : ''}`}
                />
                <span className="text-xs tabular-nums">{likes}</span>
              </Button>
              <div className="inline-flex items-center gap-1 px-2 text-muted-foreground">
                <Eye className="size-4" />
                <span className="text-xs tabular-nums">{note.views}</span>
              </div>
            </div>
          </div>

          <Button onClick={() => handleVisitNote(note)} className="w-full">
            <ExternalLink className="size-4" />
            Ver resumo
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NoteCard;
