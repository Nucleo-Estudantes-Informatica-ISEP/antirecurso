'use client';

import { useMessages } from '@/i18n/client';

import { useTheme } from 'next-themes';
import EventModal from '@/components/admin/EventModal';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import { apiRequest } from '@/services/apiClient';
import { Add, Pencil, Trash } from '@/styles/Icons';
import Event from '@/types/Event';
import Pagination from '@/types/Pagination';
import React, { useState } from 'react';
import swal from 'sweetalert';
import useSWR from 'swr';

const EventsPage: React.FC = () => {
  const t = useMessages();

  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const session = useSession();
  const [editEvent, setEditEvent] = useState<Event | undefined>();

  const fetcher = async (url: RequestInfo | URL): Promise<Pagination<Event> | null> => {
    if (!session.token) return null;

    return apiRequest<Pagination<Event>>(url.toString(), { authenticated: true });
  };

  const { data, isLoading, mutate } = useSWR<Pagination<Event> | null>(
    session.token ? `${PROTECTED_API_BASE_URL}/events` : null,
    fetcher
  );
  const events = data ?? undefined;

  const handleAddEventClick = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event: Event) => {
    const confirmed = await swal({
      title: t('copy.are_you_sure'),
      text: `Vais remover o evento "${event.name}".`,
      icon: 'warning',
      buttons: [t('copy.cancel'), t('copy.remove')],
      dangerMode: true,
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (!confirmed) return;

    try {
      await apiRequest(`events/${event.id}`, { authenticated: true, method: 'DELETE' });
    } catch {
      return swal(t('copy.error_2'), t('copy.could_not_remove_the_event'), 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }

    await mutate();

    swal(t('copy.success'), t('copy.event_removed_successfully'), 'success', {
      className: theme === 'dark' ? 'swal-dark' : ''
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{t('copy.events')}</h1>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 shadow-md">
        <div className="flex items-center mb-4">
          <button
            className="rounded-md text-white bg-primary p-1 ml-auto text-2xl hover:bg-primary/80 transition-colors"
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
          <p>{t('copy.no_events_available')}</p>
        ) : (
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">{t('copy.id')}</th>
                <th className="px-4 py-2">{t('copy.name')}</th>
                <th className="px-4 py-2">{t('copy.description')}</th>
                <th className="px-4 py-2">{t('copy.start_date')}</th>
                <th className="px-4 py-2">{t('copy.end_date')}</th>
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
