import Link from 'next/link';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/utils'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { GoogleIcon } from '@/components/icons'

interface AuthFormProps extends React.ComponentPropsWithoutRef<'div'> {
    mode: 'login' | 'register'
}

export function AuthForm({ className, mode, ...props }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const setUser = useUserStore((s) => s.setUser)
    const router = useRouter()

    const isRegister = mode === 'register'

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data?.session?.user) {
                router.push('/')
            }
        })
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isRegister) {
                if (password !== confirmPassword) {
                    setError('Пароли не совпадают')
                    return
                }
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                })
                if (error) return setError(error.message)
                router.push('/check-email')
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) return setError(error.message)
                setUser(data.user)
                router.push('/')
            }
        } catch (err) {
            setError('Ошибка')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError('Ошибка при авторизации через Google');
        }
    }

    return (
        <div className={cn('flex flex-col gap-6 min-h-screen items-center justify-center px-4', className)} {...props}>
            <Card className="w-full max-w-md bg-background border border-border shadow-xl rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold text-primary">
                        {isRegister ? 'Создайте аккаунт' : 'Добро пожаловать'}
                    </CardTitle>
                    <CardDescription>
                        {isRegister ? 'Введите данные для регистрации' : 'Войдите через Telegram, Google или email'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Ошибка</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="flex flex-col gap-4">
                        <Button
                            variant="outline"
                            className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            {isRegister ? 'Регистрация через Telegram' : 'Войти через Telegram'}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                            onClick={(e) => {
                                e.preventDefault();
                                handleGoogleSignIn();
                            }}
                        >
                            <GoogleIcon className="h-5 w-5" />
                            <span>
                                {isRegister ? 'Регистрация через Google' : 'Войти через Google'}
                            </span>
                        </Button>
        </div>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Или с помощью email
              </span>
                        </div>
                        <div className="grid gap-4">
                            {isRegister && (
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Имя</Label>
                                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    className="bg-background border border-border placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background border border-border placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                            {!isRegister && (
                                <div className="text-left text-xs">
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary hover:underline"
                                    >
                                        Забыли пароль?
                                    </Link>
                                </div>
                            )}
                            {isRegister && (
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-background border border-border placeholder:text-muted-foreground"
                                        required
                                    />
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-yellow text-black hover:bg-yellow-400 transition"
                            >
                                {loading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
                            </Button>
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                {isRegister ? (
                                    <p>
                                        Уже есть аккаунт?{' '}
                                        <Link href="/signin" className="text-primary hover:underline font-medium">
                                            Войти
                                        </Link>
                                    </p>
                                ) : (
                                    <p>
                                        Нет аккаунта?{' '}
                                        <Link href="/signup" className="text-primary hover:underline font-medium">
                                            Зарегистрироваться
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground mt-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                Нажимая продолжить, вы соглашаетесь с <a href="#">условиями сервиса</a> и <a href="#">политикой конфиденциальности</a>.
            </div>
        </div>
    )
}