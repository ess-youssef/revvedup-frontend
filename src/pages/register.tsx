import { Button } from "primereact/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/users";
import { AxiosError } from "axios";
import Errors from "@/components/forms/Errors";
import Image from "next/image";

const RegisterFormSchema = z.object({
    username: z.string().max(255),
    firstname: z.string().max(255),
    lastname: z.string().max(255),
    email: z.string().email().max(255),
    password: z.string().max(255),
    password_confirmation: z.string().max(255)
}).superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords should match"
        });
    }
});

type RegisterForm = z.infer<typeof RegisterFormSchema>;

export default function Register() {

    const toastRef = useRef<Toast>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(RegisterFormSchema)
    });

    const { mutate, isPending, error } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: "Registration successful" });
        },
        onError: (error: AxiosError) => {

        }
    });

    const doRegisterUser: SubmitHandler<RegisterForm> = (data) => {
        mutate(data);
    }

    return (
        <div>
            <div className="p-10 mx-auto w-11/12 max-w-6xl flex items-center gap-32">
                <div>
                    <Image className="text-primary" src="/logo.svg" width={500} height={500} alt="RevvedUp" />    
                </div>    
                <div className="grow">
                    <Toast ref={toastRef} />
                    <h1 className="font-bold text-3xl mb-10">Register</h1>
                    <Errors error={error} />
                    <form onSubmit={handleSubmit(doRegisterUser)} className="space-y-8">
                        <div>
                            <FloatLabel>
                                <InputText className="w-full" {...register("username")} />
                                <label htmlFor="username">Username</label>
                            </FloatLabel>
                            { errors.username?.message && <p className="mt-2 text-xs text-red-400">{errors.username?.message}</p>}
                        </div>
                        <div className="flex gap-5">
                            <FloatLabel>
                                <InputText className="w-full" {...register("firstname")} />
                                <label htmlFor="firstname">First name</label>
                            </FloatLabel>
                            { errors.firstname?.message && <p className="mt-2 text-xs text-red-400">{errors.firstname?.message}</p>}
                            <FloatLabel>
                                <InputText className="w-full" {...register("lastname")} />
                                <label htmlFor="lastname">Last name</label>
                            </FloatLabel>
                            { errors.lastname?.message && <p className="mt-2 text-xs text-red-400">{errors.lastname?.message}</p>}
                        </div>
                        <div>
                            <FloatLabel>
                                <InputText className="w-full" type="email" {...register("email")} />
                                <label htmlFor="email">Email</label>
                            </FloatLabel>
                            { errors.email?.message && <p className="mt-2 text-xs text-red-400">{errors.email?.message}</p>}
                        </div>
                        <div>
                            <FloatLabel>
                                <InputText className="w-full" {...register("password")} type="password" />
                                <label htmlFor="password">Password</label>
                            </FloatLabel>
                            { errors.password?.message && <p className="mt-2 text-xs text-red-400">{errors.password?.message}</p>}
                        </div>
                        <div>
                            <FloatLabel>
                                <InputText className="w-full" {...register("password_confirmation")} type="password" />
                                <label htmlFor="password_confirmation">Confirm password</label>
                            </FloatLabel>
                            { errors.password_confirmation?.message && <p className="mt-2 text-xs text-red-400">{errors.password_confirmation?.message}</p>}
                        </div>
                        <Button className="w-full" label={isPending ? "Registering..." : "Register"} type="submit" disabled={isPending} />
                    </form>
                </div>
            </div>
        </div>
    );
}