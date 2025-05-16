'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/store/useUserStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'

export function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mode, setMode] = useState<'login' | 'register'>('register')
    const [error, setError] = useState('')
    const setUser = useUserStore((s) => s.setUser)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (mode === 'register') {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })
            console.log(data);
            if (error) return setError(error.message)

            alert('Проверь почту — нужно подтвердить регистрацию')
        }

        if (mode === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) return setError(error.message)

            setUser(data.user)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-xl">
                    {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Пароль</Label>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
                    </div>
                    <Button className="w-full" type="submit">
                        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <div className="text-sm text-muted-foreground text-center">
                        {mode === 'login' ? (
                            <>
                                Нет аккаунта?{' '}
                                <button className="underline" type="button" onClick={() => setMode('register')}>
                                    Зарегистрироваться
                                </button>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{' '}
                                <button className="underline" type="button" onClick={() => setMode('login')}>
                                    Войти
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
