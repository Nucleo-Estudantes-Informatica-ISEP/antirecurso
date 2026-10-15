'use client';

import { useLanguage, useMessages } from '@/i18n/client';

import { useTheme } from 'next-themes';
import { PDFDocument } from 'pdf-lib';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import { KeyedMutator } from 'swr';

import FileInput from '@/components/utils/FileInput';
import PrimaryButton from '@/components/utils/PrimaryButton';
import SelectInput, { InputSelectOption } from '@/components/utils/SelectInput';
import UserSelector from '@/components/utils/UserSelector';
import { getSignedUrl, uploadToBucket } from '@/lib/upload';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import { apiRequest } from '@/services/apiClient';
import { Pdf } from '@/styles/Icons';
import Note from '@/types/Note';
import Pagination from '@/types/Pagination';
import { UploadedFile } from '@/types/UploadedFile';
import User from '@/types/User';
import { readFile } from '@/utils/files';
import LoadingSpinner from '../../utils/LoadingSpinner';

interface ModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  subjects?: InputSelectOption[];
  mutate: KeyedMutator<Pagination<Note>>;
  edit?: Note;
  setEdit: Dispatch<SetStateAction<Note | undefined>>;
}

const NoteModal: React.FC<ModalProps> = ({ setIsVisible, subjects, mutate, edit, setEdit }) => {
  const t = useMessages();
  const lang = useLanguage();

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
      return swal('Oops!', t('copy.invalid_title'), 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!subject || subject === '')
      return swal('Oops!', t('copy.invalid_subject'), 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!edit && (isFileLoading || !uploadedFile))
      return swal('Oops!', t('copy.you_must_upload_a_file'), 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    if (!author)
      return swal('Oops!', t('copy.invalid_author'), 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });

    setIsSubmitting(true);

    const url = !edit
      ? `${PROTECTED_API_BASE_URL}/subjects/${subject}/notes`
      : `${PROTECTED_API_BASE_URL}/notes/${edit.id}`;
    try {
      await apiRequest(url, {
        authenticated: true,
        method: !edit ? 'POST' : 'PATCH',
        json: {
          upload_id: uploadedFile?.id,
          author_id: author.id,
          title,
          description,
          n_pages: uploadedFile?.pages,
          subject_id: subject
        }
      });
    } catch {
      swal(
        'Oops!',
        t('copy.an_error_occurred_while_adding_the_study_notes_please_try_again'),
        'error',
        { className: theme === 'dark' ? 'swal-dark' : '' }
      );
      return setIsSubmitting(false);
    }

    swal({
      title: t('copy.success'),
      text: t('copy.study_notes_added_successfully'),
      icon: 'success',
      className: theme === 'dark' ? 'swal-dark' : '',
      timer: 2000
    });
    handleClose();
  }, [author, subject, uploadedFile, isFileLoading, edit, theme, handleClose, t]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setIsFileLoading(true);

      try {
        const signed = await getSignedUrl('notes', file.type, lang);
        if (!signed) throw new Error(t('copy.an_error_occurred_while_preparing_the_upload'));

        if (file.size > signed.maxSize) throw new Error(t('copy.the_file_is_too_large'));

        const res = await uploadToBucket(signed, file, lang);
        if (!res.ok) {
          const errorBody = await res.text();
          const details = errorBody ? ` ${errorBody}` : '';
          throw new Error(`${t('error.upload')} (${res.status})${details}`);
        }

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
            msg = t('copy.could_not_read_the_pdf_check_whether_the_file_is_corrupted');

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
      <div className="fixed left-0 z-40 flex h-screen w-full outline-hidden items-center justify-center overflow-y-auto">
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
            {!edit ? t('copy.add_study_notes') : t('copy.edit_study_notes')}
          </span>
          <div className="h-full w-full">
            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">{t('copy.title')}</h2>
              <input
                type="text"
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                ref={titleRef}
                defaultValue={edit?.title}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">
                {t('copy.description')}
              </h2>
              <textarea
                className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
                rows={2}
                ref={descRef}
                defaultValue={edit?.description}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">{t('copy.subject_2')}</h2>
              <SelectInput
                options={subjects?.sort((a, b) => a.label.localeCompare(b.label))}
                onChange={handleSubjectChange}
                placeholder={t('copy.select_a_subject')}
                defaultValue={edit?.subject.id}
              />
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">{t('copy.document')}</h2>
              <FileInput
                name="Insere um ficheiro"
                placeholder={t('copy.study_notes_pdf')}
                accept="application/pdf"
                onChange={handleFileChange}
                file={uploadedFile}
                icon={<Pdf />}
                isLoading={isFileLoading}
                onClear={() => setUploadedFile(undefined)}
              />
              {uploadedFile?.pages && (
                <span className="text-sm mt-2">
                  {uploadedFile.pages} {t('copy.pages_2')}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-3 text-lg md:text-left">{t('copy.author')}</h2>
              <UserSelector selected={author} setSelected={setAuthor} />
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
                  t('copy.add')
                ) : (
                  t('copy.save_2')
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
