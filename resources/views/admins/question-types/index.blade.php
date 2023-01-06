<x-app-layout>
    <x-slot name="header">
        {{ __('Tipos de perguntas') }}
    </x-slot>

    <div class="p-4 bg-white rounded-lg shadow-xs">
        <div class="overflow-hidden mb-8 w-full rounded-lg border shadow-xs">
            <div class="overflow-x-auto w-full">
                <table class="w-full whitespace-no-wrap">
                    <thead>
                        <tr
                            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase bg-gray-50 border-b">
                            <th class="px-4 py-3">Nome</th>
                            <th class="px-4 py-3">Cadeira</th>
                            <th class="px-4 py-3">Opções</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y">
                        @foreach($question_types as $question_type)
                        <tr class="text-gray-700">
                            <td class="px-4 py-3 text-sm">
                                {{ $question_type->name }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                {{ $question_type->subject->name }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                <a href="{{ route('admins.question-types.edit', ['questionType' => $question_type]) }}"
                                    class="text-yellow-400">Editar</a>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div
                class="px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase bg-gray-50 border-t sm:grid-cols-9">
                {{ $question_types->links() }}
            </div>
        </div>

        <form action="{{ route('admins.question-types.create') }}" class="mt-5">
            <x-primary-button>Criar tipo de pergunta</x-primary-button>
        </form>
    </div>
</x-app-layout>
