<x-app-layout>
    <x-slot name="header">
        {{ __('Cadeiras') }}
    </x-slot>

    <div class="p-4 bg-white rounded-lg shadow-xs">
        <div class="overflow-hidden mb-8 w-full rounded-lg border shadow-xs">
            <div class="overflow-x-auto w-full">
                <table class="w-full whitespace-no-wrap">
                    <thead>
                        <tr
                            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase bg-gray-50 border-b">
                            <th class="px-4 py-3">Nome</th>
                            <th class="px-4 py-3">Ano (1 / 2 / 3)</th>
                            <th class="px-4 py-3">Slug (abreviatura)</th>
                            <th class="px-4 py-3">Opções</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y">
                        @foreach($subjects as $subject)
                            <tr class="text-gray-700">
                                <td class="px-4 py-3 text-sm">
                                    {{ $subject->name }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    {{ $subject->year }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    {{ $subject->slug }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    <a href="{{ route('admins.subjects.edit', ['subject' => $subject]) }}" class="text-yellow-400">Editar</a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div
                class="px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase bg-gray-50 border-t sm:grid-cols-9">
                {{ $subjects->links() }}
            </div>
        </div>

        <div class="flex space-x-5">
            <form action="{{ route('admins.subjects.create') }}" class="mt-5">
                <x-primary-button>Criar cadeira</x-primary-button>
            </form>
            <form action="{{ route('admins.subjects.questions-parser') }}" class="mt-5">
                <x-primary-button>Parser de perguntas</x-primary-button>
            </form>
        </div>
    </div>
</x-app-layout>
