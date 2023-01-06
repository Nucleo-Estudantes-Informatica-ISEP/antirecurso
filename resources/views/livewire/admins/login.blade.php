<form wire:submit.prevent="submit">
    <!-- Input[ype="email"] -->
    <div class="mt-4">
        <x-input-label :value="__('Email')" />
        <x-text-input type="email" wire:model="email" id="email" name="email" value="{{ old('email') }}" class="block w-full" required
            autofocus />
        @error('email')
            <p class="text-xs text-red-600 mt-2">{{ $message }}</p>
        @enderror
    </div>

    <!-- Input[ype="password"] -->
    <div class="mt-4">
        <x-input-label for="password" :value="__('Password')" />
        <x-text-input type="password" wire:model="password" id="password" name="password" class="block w-full" />
        @error('password')
            <p class="text-xs text-red-600 mt-2">{{ $message }}</p>
        @enderror
    </div>

    <div class="flex mt-6 text-sm">
        <label class="flex items-center dark:text-gray-400">
            <input type="checkbox" name="remember"
                class="text-primary form-checkbox focus:border-primary focus:outline-none focus:shadow-outline-primary">
            <span class="ml-2">{{ __('Lembrar-me') }}</span>
        </label>
    </div>

    <div class="mt-4">
        <x-primary-button class="block w-full">
            {{ __('Entrar') }}
        </x-primary-button>
    </div>
</form>
