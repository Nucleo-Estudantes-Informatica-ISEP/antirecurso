<x-app-layout>
    <x-slot name="header">
        {{ __('Cadeiras - Parser de perguntas') }}
    </x-slot>

    <div class="p-4 bg-white rounded-lg shadow-xs">
        <livewire:admins.subjects.questions-parser />
    </div>
</x-app-layout>
