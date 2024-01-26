"use client";

import { BASE_URL } from 'src/services/api';
import useSession from '@/hooks/useSession';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import Report from '@/types/Report';
import ReportTable from '..';
import swal from 'sweetalert';


type TableProps = {
    reports: Report[];
};


const ReportSection: React.FC<TableProps> = ({ reports }) => {
    const { theme } = useTheme();
    const session = useSession();

    const [selectedReports, setSelectedReports] = useState<number[]>([]);

    const handleMarkAsResolve = async () => {

        const res = await fetch(BASE_URL + '/question-reports/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.token}`
            },
            body: JSON.stringify({
                question_ids: selectedReports,
            })
        });

        if (res.status === 200)
            swal({
                title: 'Resolvido!',
                text: `${selectedReports.length > 1 ? 'Os reports foram marcados como resolvidos' : 'O report foi marcado como resolvido'}.`,
                icon: 'success',
                className: theme === 'dark' ? 'swal-dark' : '',
                timer: 2000
            });
        else
            swal({
                title: 'Erro!',
                text: 'Algo correu mal ao marcar o(s) teu(s) report(s). Por favor, tenta novamente.',
                icon: 'error',
                className: theme === 'dark' ? 'swal-dark' : ''
            });
        console.log(selectedReports);
    };

    const handleDelete = async () => {
        if (selectedReports.length === 0) return;
    };

    return (
        <>
            <div className="flex gap-x-2">
                <button
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
                    onClick={handleMarkAsResolve}
                >
                    Resolver
                </button>
                <button className="bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
                    onClick={handleDelete}
                >
                    Apagar
                </button>
            </div>
            <div className="flex flex-col w-3/4">
                <ReportTable reports={reports} selectedReports={selectedReports} setSelectedReports={setSelectedReports} />
            </div>
        </>
    );
};

export default ReportSection;
