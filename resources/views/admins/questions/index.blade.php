<x-app-layout>
    <x-slot name="header">
        {{ __('Perguntas') }}
    </x-slot>

    <div class="p-4 bg-white rounded-lg shadow-xs mb-5">
        <div class="overflow-hidden mb-8 w-full rounded-lg border shadow-xs">
            <div class="overflow-x-auto w-full">
                <table class="w-full whitespace-no-wrap">
                    <thead>
                        <tr
                            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase bg-gray-50 border-b">
                            <th class="px-4 py-3">Questão</th>
                            <th class="px-4 py-3">Exame</th>
                            <th class="px-4 py-3">Cadeira</th>
                            <th class="px-4 py-3">Tipo de pergunta</th>
                            <th class="px-4 py-3">Opções</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y">
                        @foreach($questions as $question)
                        <tr class="text-gray-700">
                            <td class="px-4 py-3 text-sm">
                                {{ Str::limit($question->question, 20, '...') }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                {{ $question->exam }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                {{ $question->subject->name }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                {{ $question->question_type->name }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                <a href="{{ route('admins.questions.edit', ['question' => $question]) }}"
                                    class="text-yellow-400">Editar</a>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div
                class="px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase bg-gray-50 border-t sm:grid-cols-9">
                {{ $questions->links() }}
            </div>
        </div>

        <form action="{{ route('admins.questions.create') }}" class="mt-5">
            <x-primary-button>Criar pergunta</x-primary-button>
        </form>
    </div>
</x-app-layout>
