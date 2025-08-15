import Link from 'next/link';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/providers/supabase'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/utils/css'
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
import { Loader } from '@/components/ui/loader'

import { GoogleIcon } from '@/components/icons'
import { ThemeToggle } from '@/components/ui/themetoggle'
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useLogger } from '@/lib/utils/logger'

interface AuthFormProps extends React.ComponentPropsWithoutRef<'div'> {
    mode: 'login' | 'register'
}

export function AuthForm({ className, mode, ...props }: AuthFormProps) {
    const { t, i18n } = useTranslation()
    const logger = useLogger('AuthForm')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [, forceUpdate] = useState({})
    const setUser = useUserStore((s) => s.setUser)
    const router = useRouter()

    const isRegister = mode === 'register'

    // Принудительная перерисовка при смене языка
    useEffect(() => {
        const handleLanguageChange = () => {
            forceUpdate({})
        }

        i18n.on('languageChanged', handleLanguageChange)
        return () => i18n.off('languageChanged', handleLanguageChange)
    }, [i18n])

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
                    logger.validation.error(t('ui.password'), t('notifications.auth.passwordMismatch'))
                    setError(t('notifications.auth.passwordMismatch'))
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
                if (error) {
                    // Безопасные сообщения об ошибках - не раскрываем информацию о пользователях
                    let safeMessage = t('notifications.auth.generalError')
                    
                    if (error.message.includes('already registered') || error.message.includes('already exists')) {
                        safeMessage = t('notifications.auth.registrationSuccess')
                    } else if (error.message.includes('password')) {
                        safeMessage = t('notifications.auth.passwordMinLength')
                    } else if (error.message.includes('email')) {
                        safeMessage = t('notifications.auth.invalidEmail')
                    }
                    
                    logger.user.error(t('signUp'), safeMessage)
                    setError(safeMessage)
                    return
                }
                logger.user.success(t('signUp'), t('notifications.auth.registrationSuccess'))
                router.push('/check-email')
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) {
                    // Безопасные сообщения об ошибках - не уточняем что именно неверно
                    let safeMessage = t('notifications.auth.loginError')
                    
                    if (error.message.includes('not confirmed')) {
                        safeMessage = t('notifications.auth.emailNotConfirmed')
                    } else if (error.message.includes('too many requests')) {
                        safeMessage = t('notifications.auth.tooManyAttempts')
                    }
                    
                    logger.user.error(t('signIn'), safeMessage)
                    setError(safeMessage)
                    return
                }
                logger.user.success(t('signIn'), t('notifications.auth.loginSuccess'))
                setUser(data.user)
                router.push('/')
            }
        } catch (err) {
            logger.user.error(t('signIn'), t('notifications.auth.generalError'))
            setError(t('notifications.auth.generalError'))
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
                logger.user.error(t('signInWithGoogle'), t('notifications.auth.oauthError'))
                setError(t('notifications.auth.oauthError'));
            } else {
                logger.info(t('signInWithGoogle'), 'Перенаправление на Google...')
            }
        } catch (err) {
            logger.user.error(t('signInWithGoogle'), t('notifications.auth.oauthError'))
            setError(t('notifications.auth.oauthError'));
        }
    }

    return (
        <div className={cn('relative flex flex-col gap-6 min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-brand-darker dark:to-brand-dark smooth-transition', className)} {...props}>
            {/* Переключатели темы и языка */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-10">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>

            {/* Логотип и название */}
            <div className="text-center mb-4 px-4">
                <Link href="/" className="inline-block">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-yellow to-yellow-400 bg-clip-text text-transparent smooth-transition">
                        Everloop
                    </h1>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
                    PWA & Spy Service Platform
                </p>
            </div>

            <Card className="w-full max-w-md mx-4 bg-white/90 dark:bg-brand-accent/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 shadow-2xl dark:shadow-dark rounded-xl smooth-transition">{/* Card content */}
                <CardHeader className="text-center px-4 sm:px-6">
                    <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {isRegister ? t('createAccount') : t('welcome')}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                        {isRegister ? t('enterRegistrationData') : t('signInWith')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-6">
                        {/* Уведомления теперь показываются через логгер в правом верхнем углу */}
                        <div className="flex flex-col gap-3 sm:gap-4">
                        <Button
                            variant="outline"
                            className="w-full h-11 sm:h-12 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 smooth-transition text-sm sm:text-base"
                            onClick={(e) => {
                                e.preventDefault();
                                handleGoogleSignIn();
                            }}
                        >
                            <GoogleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>
                                {isRegister ? t('signUpWithGoogle') : t('signInWithGoogle')}
                            </span>
                        </Button>
        </div>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                {t('orWithEmail')}
              </span>
                        </div>
                        <div className="grid gap-3 sm:gap-4">
                            {isRegister && (
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium">{t('name')}</Label>
                                    <Input 
                                        id="fullName" 
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)} 
                                        className="h-11 sm:h-12 text-base"
                                        required 
                                    />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    className="bg-background border border-border placeholder:text-muted-foreground h-11 sm:h-12 text-base"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background border border-border placeholder:text-muted-foreground h-11 sm:h-12 text-base"
                                    required
                                />
                            </div>
                            {!isRegister && (
                                <div className="text-left text-xs">
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary hover:underline"
                                    >
                                        {t('forgotPassword')}
                                    </Link>
                                </div>
                            )}
                            {isRegister && (
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('confirmPassword')}</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-background border border-border placeholder:text-muted-foreground h-11 sm:h-12 text-base"
                                        required
                                    />
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 sm:h-12 bg-brand-yellow text-black hover:bg-yellow-400 transition font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader size="sm" variant="spinner" color="default" />
                                        {t('loading')}
                                    </>
                                ) : (
                                    isRegister ? t('signUp') : t('signIn')
                                )}
                            </Button>
                            <div className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
                                {isRegister ? (
                                    <p>
                                        {t('alreadyHaveAccount')}{' '}
                                        <Link href="/signin" className="text-primary hover:underline font-medium">
                                            {t('signIn')}
                                        </Link>
                                    </p>
                                ) : (
                                    <p>
                                        {t('noAccount')}{' '}
                                        <Link href="/signup" className="text-brand-yellow hover:text-yellow-400 hover:underline font-medium smooth-transition">
                                            {t('signUp')}
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-slate-600 dark:text-slate-400 mt-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-brand-yellow">
                {t('termsAndPrivacy')} <a href="#">{t('termsOfService')}</a> {t('and')} <a href="#">{t('privacyPolicy')}</a>.
            </div>
        </div>
    )
}