"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { loginSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import z from "zod"

const SignInPage = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        console.log(values);
    }

    onSubmit({ email: "sherzadartikbayev@gmail.com", password: "123" })

    return (
        <Card className="w-1/2 p-4">
            <h2 className="text-xl font-bold">Sign In</h2>
            <p className="text-sm text-muted-foreground">
                Welcome back! Please sign in to your account.
            </p>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label>Email</Label>
                                <FormControl>
                                    <Input
                                        placeholder="example@mail.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label>Password</Label>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>

            <div className='mt-4'>
                <div className='text-sm text-muted-foreground'>
                    Don&apos;t have an account?{' '}
                    <Button variant={'link'} className='cursor-pointer'>
                        <Link href='/sign-up'>Sign up</Link>
                    </Button>
                </div>
            </div >
        </Card >
    )
}

export default SignInPage