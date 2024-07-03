'use client';

import { useTheme } from 'next-themes';
import { PDFDocument } from 'pdf-lib';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import { KeyedMutator } from 'swr';

import FileInput from '@/components/utils/FileInput';
import PrimaryButton from '@/components/utils/PrimaryButton';
import SelectInput, { InputSelectOption } from '@/components/utils/SelectInput';
import UserSelector from '@/components/utils/UserSelector';
import useSession from '@/hooks/useSession';
import { getSignedUrl, uploadToBucket } from '@/lib/upload';
import { BASE_URL } from '@/services/api';
import { Pdf } from '@/styles/Icons';
import Note from '@/types/Note';
import { UploadedFile } from '@/types/UploadedFile';
import User from '@/types/User';
import { readFile } from '@/utils/files';
import LoadingSpinner from '../../utils/LoadingSpinner';

interface ModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  subjects?: InputSelectOption[];
  mutate: KeyedMutator<string>;
  edit?: Note;
  setEdit: Dispatch<SetStateAction<Note | undefined>>;
}

const NoteModal: React.FC<ModalProps> = ({ setIsVisible, subjects, mutate, edit, setEdit }) => {
  const session = useSession();
  const { theme } = useTheme();

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [subject, setSubject] = useState<string>();

  const [isFileLoading, setIsFileLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>();

  const [author, setAuthor] = useState<User | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setUploadedFile(undefined);
    setAuthor(null);
    setEdit(undefined);
    mutate();
  }, [setIsVisible, setEdit, mutate]);

  const handleSubmit = useCallback(async () => {
    const title = titleRef.current?.value;
    const description = descRef.current?.value;

    if (!title || title.length < 2)
      return swal('Oops!', 'Título inválido.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!subject || subject === '')
      return swal('Oops!', 'Disciplina inválida.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!edit && (isFileLoading || !uploadedFile))
      return swal('Oops!', 'Tens de carregar um ficheiro.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!author)
      return swal('Oops!', 'Autor inválido.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    setIsSubmitting(true);

    const url = !edit ? `${BASE_URL}/subjects/${subject}/notes` : `${BASE_URL}/notes/${edit.id}`;
    const res = await fetch(url, {
      method: !edit ? 'POST' : 'PATCH',
      body: JSON.stringify({
        upload_id: uploadedFile?.id,
        author_id: author.id,
        title,
        description,
        n_pages: uploadedFile?.pages,
        subject_id: subject
      }),
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + session.token
      }
    });

    if (!res.ok) {
      swal(
        'Oops!',
        'Ocorreu um erro ao tentar adicionar o resumo. Por favor, tente novamente.',
        'error',
        { className: theme === 'dark' ? 'swal-dark' : '' }
      );
      return setIsSubmitting(false);
    }

    swal({
      title: 'Sucesso',
      text: 'Resumo adicionado com sucesso.',
      icon: 'success',
      className: theme === 'dark' ? 'swal-dark' : '',
      timer: 2000
    });
    handleClose();
  }, [author, subject, uploadedFile, isFileLoading, edit, session.token, theme, handleClose]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setIsFileLoading(true);

      try {
        const signed = await getSignedUrl('notes', file.type, session.token as string);
        if (!signed) throw new Error('Ocorreu um erro no upload (getSignedUrl).');

        if (file.size > signed.maxSize) throw new Error('O ficheiro é demasiado grande.');

        const res = await uploadToBucket(signed, file);
        if (res.status !== 200) throw new Error('Ocorreu um erro no upload (bucket).');

        const previewUrl = URL.createObjectURL(file);

        const arrayBuffer = await readFile(file);
        const document = await PDFDocument.load(arrayBuffer);
        const pages = document.getPageCount();

        setUploadedFile({
          id: signed.id,
          name: file.name,
          preview: previewUrl,
          pages
        });
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          let msg = error.message;
          if (msg === '_this.catalog is undefined')
            msg = 'Não foi possível ler o pdf, verifica se o ficheiro está corrompido.';

          swal('Oops!', msg, 'error', {
            className: theme === 'dark' ? 'swal-dark' : ''
          });
        }
      }

      setIsFileLoading(false);
    }
  };

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      else if (e.key === 'Enter' && !isSubmitting) handleSubmit();
    };
    window.addEventListener('keydown', keydownEvent);

    return () => window.removeEventListener('keydown', keydownEvent);
  }, [handleClose, handleSubmit, isSubmitting]);

  useEffect(() => {
    if (edit) {
      setAuthor(edit.user);
      setSubject(edit.subject.id.toString());
    }

    titleRef.current?.focus();
  }, [edit]);

  return (
    <div className="fixed left-0 top-0 h-screen w-full bg-gray-500/60 z-40 items-center justify-center">
      <div className="fixed left-0 z-40 flex h-screen w-full outline-none items-center justify-center overflow-y-auto">
        <div
          className={`flex flex-col w-full md:w-1/2 rounded-lg lg:px-32 bg-gray-200 dark:bg-gray-700 items-center justify-around relative overflow-x-hidden overflow-y-scroll`}>
          <button
            onClick={handleClose}
            className="text-2xl font-black text-red-500 hover:text-red-600 z-20 absolute top-10 right-10">
            X
          </button>
          <span className="w-full text-center text-xl lg:text-3xl font-black mb-6 px-2 pt-10">
            {!edit ? 'Adicionar Resumo' : 'Editar Resumo'}
          </span>
          <div className="h-full w-full">
            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Título</h2>
              <input
                type="text"
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                ref={titleRef}
                defaultValue={edit?.title}
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
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Disciplina</h2>
              <SelectInput
                options={subjects?.sort((a, b) => a.label.localeCompare(b.label))}
                onChange={handleSubjectChange}
                placeholder="Seleciona uma disciplina."
                defaultValue={edit?.subject.id}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Documento</h2>
              <FileInput
                name="Insere um ficheiro"
                placeholder="PDF Resumo"
                accept="application/pdf"
                onChange={handleFileChange}
                file={uploadedFile}
                icon={<Pdf />}
                isLoading={isFileLoading}
                onClear={() => setUploadedFile(undefined)}
              />
              {uploadedFile?.pages && (
                <span className="text-sm mt-2">{uploadedFile.pages} páginas</span>
              )}
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Autor</h2>
              <UserSelector selected={author} setSelected={setAuthor} />
            </div>

            <div className="flex items-left mb-12">
              <PrimaryButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full text-xl !font-bold">
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

export default NoteModal;
