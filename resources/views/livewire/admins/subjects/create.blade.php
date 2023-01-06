<form wire:submit.prevent="submit">
    <div class="overflow-hidden w-full rounded-lg shadow-xs">
        <div class="overflow-x-auto w-full space-y-5">
            <div>
                <x-input-label for="name" :value="__('Nome')" />
                <x-text-input type="text" wire:model="name" id="name" name="name" class="block w-1/3" />
                @error('name')
                <p class="text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-input-label for="year" :value="__('Ano (1 / 2 / 3)')" />
                <x-text-input type="text" wire:model="year" id="year" name="year" class="block w-1/3" />
                @error('year')
                <p class="text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-input-label for="slug" :value="__('Abreviatura')" />
                <x-text-input type="text" wire:model="slug" id="slug" name="slug" class="block w-1/3" />
                @error('year')
                <p class="text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>
    </div>

    <x-primary-button class="mt-5">Criar cadeira</x-primary-button>
</form>
