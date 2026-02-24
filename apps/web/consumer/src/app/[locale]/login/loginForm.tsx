'use client';

import React, { useState } from 'react';
import { login, loginUsername } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from '@packages/ui-components';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ChevronLeft, Eye, EyeOff, Mail } from 'lucide-react';

const createSigninSchema = (tCommon: (key: string) => string) =>
	z.object({
		email: z.string().min(1, tCommon('email.errors.required')),

		password: z.string().min(1, tCommon('password.errors.required')),
	});

export type SigninInputs = z.infer<ReturnType<typeof createSigninSchema>>;

export const LoginForm = () => {
	const t = useTranslations('common.login');
	const searchParams = useSearchParams();
	const code = searchParams.get('code') ?? '';
	const tCommon = useTranslations('fields');
	const [showPassword, setShowPassword] = useState(false);

	const signinSchema = createSigninSchema(tCommon);

	const form = useForm<SigninInputs>({
		resolver: zodResolver(signinSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<SigninInputs> = async (data) => {
		const { error } = data.email.includes('@')
			? await login({ ...data, code })
			: await loginUsername({ username: data.email, ...data });
		if (error) {
			form.setError('email', { message: '' });
			form.setError('password', { message: error });
			return toast.error(error, {
				id: error,
			});
		}
		return;
	};
	return (
		<div className="flex min-h-screen flex-col gap-1">
			<div className="flex justify-between px-7 pt-5 sm:px-10">
				<Link href="/" className="flex items-center gap-1">
					<ChevronLeft width={14} height={14} />
					Voltar
				</Link>
			</div>
			<div className="flex flex-1 items-center justify-center">
				<div className="flex w-80 flex-col justify-between gap-4 sm:w-1/3">
					<h1 className="text-3xl font-extrabold text-black dark:text-white">
						{t('title')}
					</h1>
					<p className="text-sm text-gray-500">{t('description')}</p>
					<div className="flex flex-col gap-2">
						<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{tCommon('email_or_username.label')}</FormLabel>
											<FormControl>
												<Input
													placeholder={tCommon('email_or_username.placeholder')}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<div className="flex text-sm w-full justify-between">
												<FormLabel>{tCommon('password.label')}</FormLabel>
												<Link
													href="/forgot-password"
													className="hover:underline mx-1"
												>
													{t('forgot-password')}
												</Link>
											</div>
											<FormControl>
												<div className="relative">
													<Input
														placeholder="•••••••••"
														type={showPassword ? 'text' : 'password'}
														{...field}
													/>
													<button
														type="button"
														onClick={() => setShowPassword((prev) => !prev)}
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
														tabIndex={-1}
													>
														{showPassword ? (
															<EyeOff size={18} />
														) : (
															<Eye size={18} />
														)}
													</button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex items-center justify-center gap-2 ">
									<Mail size={14} />
									<Link href="/login-email" className="text-sm">
										{t('login-with-code')}
									</Link>
								</div>

								<Button type="submit" className="w-full">
									{t('submit')}
								</Button>
							</form>
						</FormProvider>
						<div className="flex flex-col justify-center gap-2 text-center text-sm sm:flex-row">
							{t('dont-have-account')}
							<Link href="/signup" className="tracking-wide underline">
								{t('signup')}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
