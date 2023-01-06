<x-app-layout>
    <x-slot name="header">
        {{ __('Tipos de perguntas') }}
    </x-slot>

    <div class="p-4 bg-white rounded-lg shadow-xs">
        <livewire:admins.question-types.create />
    </div>
</x-app-layout>
