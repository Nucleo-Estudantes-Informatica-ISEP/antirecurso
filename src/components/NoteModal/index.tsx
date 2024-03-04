'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { PDFDocument } from 'pdf-lib';
import swal from 'sweetalert';

import useSession from '@/hooks/useSession';
import PrimaryButton from '@/components/PrimaryButton';
import SelectInput, { InputSelectOption } from '@/components/SelectInput';
import FileInput from '@/components/FileInput';
import { Pdf } from '@/styles/Icons';
import { getSignedUrl, uploadToBucket } from '@/lib/upload';
import { UploadedFile } from '@/types/UploadedFile';
import UserSelector from '@/components/UserSelector';
import User from '@/types/User';
import { readFile } from '@/utils/files';
import { BASE_URL } from '@/services/api';

interface ModalProps {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  subjects?: InputSelectOption[];
}

const NoteModal: React.FC<ModalProps> = ({ isVisible, setIsVisible, subjects }) => {
  const session = useSession();
  const { theme } = useTheme();

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [subject, setSubject] = useState<string>();

  const [isFileLoading, setIsFileLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>();

  const [author, setAuthor] = useState<User | null>(null);

  const handleSubmit = async () => {
    const title = titleRef.current?.value;
    const description = descRef.current?.value;

    if (!title || title.length < 2)
      return swal('Oops!', 'Título inválido.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!description || description.length < 2)
      return swal('Oops!', 'Descrição inválida.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!subject || subject === '')
      return swal('Oops!', 'Disciplina inválida.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (isFileLoading || !uploadedFile)
      return swal('Oops!', 'Tens de carregar um ficheiro.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!author)
      return swal('Oops!', 'Autor inválido.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    const res = await fetch(BASE_URL + '/subjects/' + subject + '/notes', {
      method: 'POST',
      body: JSON.stringify({
        upload_id: uploadedFile.id,
        author_id: author.id,
        title,
        description,
        n_pages: uploadedFile.pages
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
      return;
    }

    swal({
      title: 'Sucesso',
      text: 'Resumo adicionado com sucesso.',
      icon: 'success',
      className: theme === 'dark' ? 'swal-dark' : '',
      timer: 2000
    });
    setIsVisible(false);

    // clear
    titleRef.current.value = '';
    descRef.current.value = '';
    setSubject(undefined);
    setUploadedFile(undefined);
    setAuthor(null);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setIsFileLoading(true);

      const signed = await getSignedUrl('notes', file.type, session.token as string);
      if (!signed) {
        swal('Oops!', 'Ocorreu um erro no upload (getSignedUrl).', 'error', {
          className: theme === 'dark' ? 'swal-dark' : ''
        });
        return setIsFileLoading(false);
      }

      if (file.size > signed.maxSize) {
        swal('Oops!', 'O ficheiro é demasiado grande.', 'error', {
          className: theme === 'dark' ? 'swal-dark' : ''
        });
        return setIsFileLoading(false);
      }

      const res = await uploadToBucket(signed, file);

      if (res.status !== 200) {
        swal('Oops!', 'Ocorreu um erro no upload (bucket).', 'error', {
          className: theme === 'dark' ? 'swal-dark' : ''
        });
        return setIsFileLoading(false);
      }

      const previewUrl = URL.createObjectURL(file);

      try {
        console.time('readpdf');
        const arrayBuffer = await readFile(file);
        const document = await PDFDocument.load(arrayBuffer);
        const pages = document.getPageCount();
        console.timeEnd('readpdf');

        setUploadedFile({
          id: signed.id,
          name: file.name,
          preview: previewUrl,
          pages
        });
      } catch (error) {
        swal(
          'Oops!',
          'Não foi possível ler o pdf, verifica se o ficheiro está corrompido.',
          'error',
          {
            className: theme === 'dark' ? 'swal-dark' : ''
          }
        );
        console.log(error);
      }

      setIsFileLoading(false);
    }
  };

  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', closeWithEsc);

    return () => window.removeEventListener('keydown', closeWithEsc);
  }, [setIsVisible]);

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-full bg-gray-500/60 z-40 items-center justify-center ${
        isVisible ? 'fixed' : 'hidden'
      }`}>
      <div className="fixed left-0 z-40 flex h-screen w-full outline-none items-center justify-center overflow-y-auto">
        <div
          className={`flex flex-col w-full md:w-1/2 rounded-lg lg:px-32 bg-gray-200 dark:bg-gray-700 items-center justify-around relative overflow-x-hidden overflow-y-scroll`}>
          <button
            onClick={() => setIsVisible(false)}
            className="text-2xl font-black text-red-500 hover:text-red-600 z-20 absolute top-10 right-10">
            X
          </button>
          <span className="w-full text-center text-xl lg:text-3xl font-black mb-6 px-2 pt-10">
            Add Note
          </span>
          <div className="h-full w-full">
            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Título</h2>
              <input
                type="text"
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                ref={titleRef}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Descrição</h2>
              <textarea
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                rows={2}
                ref={descRef}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">Disciplina</h2>
              <SelectInput
                options={subjects?.sort((a, b) => a.label.localeCompare(b.label))}
                onChange={handleSubjectChange}
                placeholder="Select a subject."
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
              <PrimaryButton onClick={handleSubmit} className="w-full text-xl !font-bold">
                Adicionar
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
