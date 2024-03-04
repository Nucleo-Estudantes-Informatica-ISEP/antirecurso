'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import { useTheme } from 'next-themes';

import { fetchSubjects } from '@/services/fetchSubjects';
import fetchNotes from '@/services/fetchNotes';
import useSession from '@/hooks/useSession';
import Note from '@/types/Note';
import NoteCard from '@/components/NoteCard';
import PrimaryButton from '@/components/PrimaryButton';
import NoteModal from '@/components/NoteModal';
import SelectInput, { InputSelectOption } from '@/components/SelectInput';
import LoadingSpinner from '@/components/LoadingSpinner';

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
      const options = rawSubjects.map((s) => ({ value: s.id, label: s.name }));
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

  return (
    <>
      <div className="h-full mt-4 flex flex-col items-center justify-center flex-1">
        <h2 className="text-4xl font-black">Notes</h2>
        <PrimaryButton className="mb-2" onClick={handleUploadClick}>
          Upload
        </PrimaryButton>
        {!subjects ? (
          <div>
            <LoadingSpinner className="text-xl" />
          </div>
        ) : (
          <SelectInput
            placeholder="Select a subject."
            options={subjects}
            className="w-full mb-4"
            onChange={handleSubjectChange}
          />
        )}

        {isLoading ? (
          <div>
            <LoadingSpinner className="text-xl" />
          </div>
        ) : (
          selectedSubject &&
          (!notes || !notes.length ? (
            <p>Notes not found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center w-full items-center gap-16">
              {notes?.map((n) => (
                <NoteCard note={n} key={n.id} />
              ))}
            </div>
          ))
        )}
      </div>

      <NoteModal isVisible={isModalOpen} setIsVisible={setIsModalOpen} subjects={subjects} />
    </>
  );
};

export default NotesPage;
