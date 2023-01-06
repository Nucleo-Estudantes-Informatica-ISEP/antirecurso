<?php

namespace App\Http\Livewire\Admins\Users;

use App\Models\User;
use Livewire\Component;

class ChangeRole extends Component
{

    public User $user;

    public function mount(User $user) {
        $this->user = $user;
    }

    public function submit() {
        $this->user->update([
            'is_admin' => !$this->user->is_admin
        ]);

        return redirect()->route('admins.users.index');
    }

    public function render()
    {
        return view('livewire.admins.users.change-role');
    }
}
