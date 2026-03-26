'use client';

import { useTheme } from 'next-themes';
import EventModal from '@/components/admin/EventModal';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import { Add, Pencil, Trash } from '@/styles/Icons';
import Event from '@/types/Event';
import Pagination from '@/types/Pagination';
import React, { useState } from 'react';
import swal from 'sweetalert';
import useSWR from 'swr';

const EventsPage: React.FC = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const session = useSession();
  const [editEvent, setEditEvent] = useState<Event | undefined>();

  const fetcher = async (url: RequestInfo | URL) => {
    if (!session.token) return null;

    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + session.token } });
    if (!res.ok) return null;

    return res.json();
  };

  const { data, isLoading, mutate } = useSWR(
    session.token ? `${PROTECTED_API_BASE_URL}/events` : null,
    fetcher
  );
  const events: Pagination<Event> = data;

  const handleAddEventClick = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event: Event) => {
    const confirmed = await swal({
      title: 'Tens a certeza?',
      text: `Vais remover o evento "${event.name}".`,
      icon: 'warning',
      buttons: ['Cancelar', 'Remover'],
      dangerMode: true,
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (!confirmed) return;

    const res = await fetch(`${PROTECTED_API_BASE_URL}/events/${event.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` }
    });

    if (!res.ok) {
      return swal('Erro', 'Não foi possível remover o evento.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }

    await mutate();

    swal('Sucesso', 'Evento removido com sucesso.', 'success', {
      className: theme === 'dark' ? 'swal-dark' : ''
    });
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
                  <td className="border px-4 py-2">
                    <button
                      className="hover:text-red-500 transition-colors p-3"
                      onClick={() => handleDelete(event)}
                    >
                      <Trash />
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
