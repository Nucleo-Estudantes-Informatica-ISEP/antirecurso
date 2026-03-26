'use client';

import EventModal from '@/components/admin/EventModal';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import { Add, Pencil } from '@/styles/Icons';
import Event from '@/types/Event';
import Pagination from '@/types/Pagination';
import React, { useState } from 'react';
import useSWR from 'swr';

const EventsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const session = useSession();
  const [editEvent, setEditEvent] = useState<Event | undefined>();

  const fetcher = async (url: RequestInfo | URL) => {
    return fetch(url, { headers: { Authorization: 'Bearer ' + session.token } }).then((res) =>
      res.json()
    );
  };

  const { data, isLoading, mutate } = useSWR(`${BASE_URL}/events`, fetcher);
  const events: Pagination<Event> = data;

  const handleAddEventClick = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Eventos</h1>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 shadow-md">
        <div className="flex items-center mb-4">
          <button
            className="rounded-md text-white bg-primary p-1 ml-auto text-2xl hover:bg-opacity-80 transition-colors"
            onClick={handleAddEventClick}
          >
            <Add />
          </button>
        </div>

        {isLoading ? (
          <div>
            <LoadingSpinner className="text-xl" />
          </div>
        ) : !events || !events.meta.total ? (
          <p>Não existem eventos disponíveis</p>
        ) : (
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Descrição</th>
                <th className="px-4 py-2">Data de início</th>
                <th className="px-4 py-2">Data de fim</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {events.data.map((event) => (
                <tr key={event.id}>
                  <td className="border px-4 py-2">{event.id}</td>
                  <td className="border px-4 py-2">{event.name}</td>
                  <td className="border px-4 py-2">{event.description}</td>
                  <td className="border px-4 py-2">{new Date(event.start_date).toDateString()}</td>
                  <td className="border px-4 py-2">{new Date(event.end_date).toDateString()}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="hover:text-primary transition-colors p-3"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <EventModal
          setIsVisible={setIsModalOpen}
          edit={editEvent}
          setEdit={setEditEvent}
          mutate={mutate}
        />
      )}
    </>
  );
};

export default EventsPage;
