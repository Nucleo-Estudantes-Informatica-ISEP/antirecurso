<form wire:submit.prevent="submit">
    <button class="rounded bg-primary py-3 px-5 text-white text-xs font-semibold uppercase">
        {{ $user->is_admin ? 'Revocar admin' : 'Tornar admin' }}
    </button>
</form>
