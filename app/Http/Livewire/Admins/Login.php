<?php

namespace App\Http\Livewire\Admins;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Livewire\Component;

class Login extends Component
{

    public string $email = "";
    public string $password = "";

    protected $rules = [
        'email' => 'required|email',
        'password' => 'required|min:8'
    ];

    public function submit() {
        $data = $this->validate($this->rules);
        $user = User::where(['email' => $this->email])->first();

        if(!$user || !Hash::check($this->password, $user->password) || !$user->is_admin) {
            return $this->addError('email', 'As credenciais não correspondem às da base de dados');
        }

        Auth::login($user);

        return redirect()->route('admins.index');
    }

    public function render()
    {
        return view('livewire.admins.login');
    }
}
