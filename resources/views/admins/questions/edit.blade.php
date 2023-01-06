<x-app-layout>
    <x-slot name="header">
        {{ __('Perguntas') }}
    </x-slot>

    <livewire:admins.questions.edit :question="$question" />
</x-app-layout>
