'use client';

import { useTheme } from 'next-themes';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import { KeyedMutator } from 'swr';

import PrimaryButton from '@/components/utils/PrimaryButton';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import Event from '@/types/Event';
import LoadingSpinner from '../../utils/LoadingSpinner';

interface ModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  edit?: Event;
  mutate: KeyedMutator<Event[]>;
  setEdit: Dispatch<SetStateAction<Event | undefined>>;
}

const EventModal: React.FC<ModalProps> = ({ setIsVisible, edit, mutate, setEdit }) => {
  const session = useSession();
  const { theme } = useTheme();

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setEdit(undefined);
    mutate();
  }, [setIsVisible, setEdit, mutate]);

  const formatDateToMySQL = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = useCallback(async () => {
    const title = titleRef.current?.value;
    const description = descRef.current?.value;
    const startDate = new Date(startDateRef.current?.value || '01-01-2000');
    const endDate = new Date(endDateRef.current?.value || '01-01-2000');

    if (!title || title.length < 2)
      return swal('Oops!', 'Título inválido.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (startDate > endDate)
      return swal('Oops!', 'Data de início não pode ser maior que a data de fim.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (startDate < new Date())
      return swal('Oops!', 'Data de início não pode ser menor que a data atual.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    setIsSubmitting(true);

    const eventData = {
      name: title,
      description: description,
      start_date: formatDateToMySQL(startDate),
      end_date: formatDateToMySQL(endDate)
    };

    const url = !edit
      ? `${PROTECTED_API_BASE_URL}/events/new`
      : `${PROTECTED_API_BASE_URL}/events/${edit.id}`;
    const res = await fetch(url, {
      method: !edit ? 'POST' : 'PATCH',
      body: JSON.stringify(eventData),
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + session.token
      }
    });

    if (!res.ok) {
      swal(
        'Oops!',
        'Ocorreu um erro ao tentar adicionar o evento. Por favor, tente novamente.',
        'error',
        { className: theme === 'dark' ? 'swal-dark' : '' }
      );
      return setIsSubmitting(false);
    }

    swal({
      title: 'Sucesso',
      text: 'Evento adicionado com sucesso.',
      icon: 'success',
      className: theme === 'dark' ? 'swal-dark' : '',
      timer: 2000
    });
    handleClose();
  }, [edit, session.token, theme, handleClose]);

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      else if (e.key === 'Enter' && !isSubmitting) handleSubmit();
    };
    window.addEventListener('keydown', keydownEvent);

    return () => window.removeEventListener('keydown', keydownEvent);
  }, [handleClose, handleSubmit, isSubmitting]);

  useEffect(() => {
    titleRef.current?.focus();
  }, [edit]);

  return (
    <div className="fixed left-0 top-0 h-screen w-full bg-gray-500/60 z-40 items-center justify-center">
      <div className="fixed left-0 z-40 flex h-screen w-full outline-none items-center justify-center overflow-y-auto">
        <div
          className={`flex flex-col w-full md:w-1/2 rounded-lg lg:px-32 bg-gray-200 dark:bg-gray-700 items-center justify-around relative overflow-x-hidden overflow-y-scroll`}
        >
          <button
            onClick={handleClose}
            className="text-2xl font-black text-red-500 hover:text-red-600 z-20 absolute top-10 right-10"
          >
            X
          </button>
          <span className="w-full text-center text-xl lg:text-3xl font-black mb-6 px-2 pt-10">
            {!edit ? 'Adicionar Evento' : 'Editar Evento'}
          </span>
          <div className="h-full w-full">
            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Título</h2>
              <input
                type="text"
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                ref={titleRef}
                defaultValue={edit?.name}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Descrição</h2>
              <textarea
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                rows={2}
                ref={descRef}
                defaultValue={edit?.description}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Data de Início</h2>
              <input
                type="date"
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                ref={startDateRef}
                defaultValue={edit ? new Date(edit.start_date).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Data de Fim</h2>
              <input
                type="date"
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                ref={endDateRef}
                defaultValue={edit ? new Date(edit.end_date).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="flex items-left mb-12">
              <PrimaryButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full text-xl !font-bold"
              >
                {isSubmitting ? (
                  <LoadingSpinner className="mx-auto" />
                ) : !edit ? (
                  'Adicionar'
                ) : (
                  'Guardar'
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
