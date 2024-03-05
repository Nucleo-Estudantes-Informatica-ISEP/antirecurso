'use client';

import React, { useCallback, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/pt';

import { fetchSubjects } from '@/services/fetchSubjects';
import fetchNotes from '@/services/fetchNotes';
import useSession from '@/hooks/useSession';
import Note from '@/types/Note';
import PrimaryButton from '@/components/PrimaryButton';
import NoteModal from '@/components/NoteModal';
import SelectInput, { InputSelectOption } from '@/components/SelectInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Add, Eye, Pencil } from '@/styles/Icons';
import { BASE_URL } from '@/services/api';

const NotesPage: React.FC = () => {
  const { theme } = useTheme();

  const [subjects, setSubjects] = useState<InputSelectOption[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>();
  const [notes, setNotes] = useState<Note[]>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const session = useSession();

  const getSubjects = useCallback(async () => {
    try {
      const rawSubjects = await fetchSubjects();
      const options = rawSubjects
        .map((s) => ({ value: s.id, label: s.name }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setSubjects(options);
    } catch (error) {
      swal('Oops!', 'Não foi possível obter as disciplinas.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  }, [theme]);

  const getNotes = useCallback(async () => {
    if (!selectedSubject) return;
    setNotes(undefined);

    try {
      const n = await fetchNotes(selectedSubject?.toString(), session.token as string);
      setNotes(n);
      setIsLoading(false);
    } catch (error) {
      swal('Oops!', 'Não foi possível obter os resumos da disciplina.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  }, [selectedSubject, session.token, theme]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    setSelectedSubject(e.target.value);
  };

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const handleOpenPreview = async (id: number) => {
    const res = await fetch(`${BASE_URL}/notes/${id}/view`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` }
    });
    if (!res.ok) swal('Erro', 'Não foi abrir a pré-visualização', 'error');
    const data = await res.json();
    window.open(data.url, '_blank');
  };

  moment.locale('pt');

  return (
    <>
      <div className="">
        <h1 className="text-4xl font-bold mb-4">Notes</h1>

        <div className="bg-gray-700 rounded-md p-4 drop-shadow-md">
          <div className="flex items-center mb-4">
            <span className="mr-2">Filtrar: </span>
            {!subjects ? (
              <div>
                <LoadingSpinner className="text-xl" />
              </div>
            ) : (
              <div className="w-72 mr-4">
                <SelectInput
                  placeholder="Disciplina"
                  options={subjects}
                  className="flex w-full"
                  onChange={handleSubjectChange}
                />
              </div>
            )}
            <button
              className="rounded-md bg-primary p-1 ml-auto text-2xl"
              onClick={handleUploadClick}>
              <Add />
            </button>
          </div>

          <div className="overflow-x-scroll">
            {isLoading ? (
              <div>
                <LoadingSpinner className="text-xl" />
              </div>
            ) : !selectedSubject ? (
              <p>Seleciona uma disciplina.</p>
            ) : !notes || !notes.length ? (
              <p>Não existem resumos para a disciplina selecionada.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="font-bold">
                  <tr>
                    <th className="p-3">
                      <span>Título</span>
                    </th>
                    <th className="p-3">
                      <span>Autor</span>
                    </th>
                    <th className="p-3">
                      <span>Páginas</span>
                    </th>
                    <th className="p-3">
                      <span>Likes</span>
                    </th>
                    <th className="p-3">
                      <span>Views</span>
                    </th>
                    <th className="p-3">
                      <span>Criado</span>
                    </th>
                    <th className="p-3"></th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="[&_span]:font-normal">
                  {notes?.map((n) => (
                    <tr key={n.id} className="odd:bg-gray-600 hover:bg-gray-500 transition-colors">
                      <th className="p-3 truncate">
                        <span>{n.title}</span>
                      </th>
                      <th className="p-3 truncate text-ellipsis">
                        <div className="flex flex-row gap-2 items-center">
                          <Image
                            className="w-6 md:w-8 rounded-full aspect-square"
                            src={`https://gravatar.com/avatar/${n.user.avatar}?s=64&d=identicon`}
                            alt={n.user.name}
                            loading="lazy"
                            width={24}
                            height={24}
                            title={n.user.name}
                          />
                          <span>{n.user.name}</span>
                        </div>
                      </th>
                      <th className="p-3">
                        <span>{n.n_pages || '-'}</span>
                      </th>
                      <th className="p-3">
                        <span>{n.likes}</span>
                      </th>
                      <th className="p-3">
                        <span>{n.views}</span>
                      </th>
                      <th className="p-3">
                        <span>{moment(n.created_at).fromNow()}</span>
                      </th>
                      <th>
                        <button
                          className="hover:text-primary transition-colors p-3"
                          onClick={() => handleOpenPreview(n.id)}>
                          <Eye />
                        </button>
                      </th>
                      <th>
                        {/* onClick={() => handleEdit(n.id)}> */}
                        <button className="hover:text-primary transition-colors p-3">
                          <Pencil />
                        </button>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <NoteModal isVisible={isModalOpen} setIsVisible={setIsModalOpen} subjects={subjects} />
    </>
  );
};

export default NotesPage;
