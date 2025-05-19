import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/store/useUserStore'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [telegram, setTelegram] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const setUser = useUserStore((s) => s.setUser)
    const router = useRouter()

    const passwordStrength = password.length >= 8 ? 'Сильный' : password.length >= 4 ? 'Средний' : 'Слабый'

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (mode === 'register') {
            if (password !== confirmPassword) {
                return setError('Пароли не совпадают')
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        telegram
                    }
                }
            })
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
            router.push('/')
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

                    {mode === 'register' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Имя</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Павел"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telegram">Telegram (опционально)</Label>
                                <Input
                                    id="telegram"
                                    value={telegram}
                                    onChange={(e) => setTelegram(e.target.value)}
                                    placeholder="@username"
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                        {mode === 'register' && (
                            <div className="text-xs text-muted-foreground">Сложность пароля: {passwordStrength}</div>
                        )}
                    </div>

                    {mode === 'register' && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                    )}

                    <Button type="submit" className="w-full">
                        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        {mode === 'login' ? (
                            <>
                                Нет аккаунта?{' '}
                                <a href="/signup" className="underline">
                                    Зарегистрироваться
                                </a>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{' '}
                                <a href="/signin" className="underline">
                                    Войти
                                </a>
                            </>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
