'use client';

import React, { useCallback, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import moment from 'moment';
import useSWR from 'swr';
import 'moment/locale/pt';

import { fetchSubjects } from '@/services/fetchSubjects';
import useSession from '@/hooks/useSession';
import Note from '@/types/Note';
import NoteModal from '@/components/NoteModal';
import SelectInput, { InputSelectOption } from '@/components/SelectInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Add, Eye, Pencil } from '@/styles/Icons';
import { BASE_URL } from '@/services/api';
import Pagination from '@/types/Pagination';

const NotesPage: React.FC = () => {
  const { theme } = useTheme();

  const [subjects, setSubjects] = useState<InputSelectOption[]>();
  const [selectedSubject, setSelectedSubject] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editNote, setEditNote] = useState<Note | undefined>();

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

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  const fetcher = (url: RequestInfo | URL) => {
    if (!selectedSubject) return;
    return fetch(url, { headers: { Authorization: 'Bearer ' + session.token } }).then((res) =>
      res.json()
    );
  };

  const { data, isLoading, mutate } = useSWR(
    `${BASE_URL}/subjects/${selectedSubject}/notes?limit=999`,
    fetcher
  );
  const notes: Pagination<Note> = data;

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  const handleEdit = (note: Note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  moment.locale('pt');

  return (
    <>
      <div className="">
        <h1 className="text-4xl font-bold mb-4">Resumos</h1>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 shadow-md">
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
              className="rounded-md text-white bg-primary p-1 ml-auto text-2xl hover:bg-opacity-80 transition-colors"
              onClick={handleUploadClick}>
              <Add />
            </button>
          </div>

          {isLoading ? (
            <div>
              <LoadingSpinner className="text-xl" />
            </div>
          ) : !selectedSubject ? (
            <p>Seleciona uma disciplina.</p>
          ) : !notes || !notes.meta.total ? (
            <p>Não existem resumos para a disciplina selecionada.</p>
          ) : (
            <>
              <div className="overflow-x-scroll">
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
                    {notes.data.map((n) => (
                      <tr
                        key={n.id}
                        className="odd:bg-gray-200 hover:bg-gray-300 dark:odd:bg-gray-600 dark:hover:bg-gray-500 transition-colors">
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
                          <span title={moment(n.created_at).format('LLLL')}>
                            {moment(n.created_at).fromNow()}
                          </span>
                        </th>
                        <th>
                          <button
                            className="hover:text-primary transition-colors p-3"
                            onClick={() => handleOpenPreview(n.id)}>
                            <Eye />
                          </button>
                        </th>
                        <th onClick={() => handleEdit(n)}>
                          <button className="hover:text-primary transition-colors p-3">
                            <Pencil />
                          </button>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-4">
                <span>
                  {notes?.meta.total} item{notes?.meta.total !== 1 && 's'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NoteModal
          setIsVisible={setIsModalOpen}
          subjects={subjects}
          mutate={mutate}
          edit={editNote}
          setEdit={setEditNote}
        />
      )}
    </>
  );
};

export default NotesPage;
