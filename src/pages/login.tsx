import { Button } from "primereact/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/users";
import { AxiosError } from "axios";
import Errors from "@/components/forms/Errors";
import Image from "next/image";
import { login } from "@/lib/api/auth";
import { useLocalStorage } from "usehooks-ts";
import { TokenLocalStorage } from "@/lib/interfaces";

const LoginFormSchema = z.object({   
    email: z.string().email().max(255),
    password: z.string().max(255),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

export default function Login() {
    
    const [_, saveToken] = useLocalStorage<TokenLocalStorage>("token", null);

    const toastRef = useRef<Toast>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(LoginFormSchema)
    });
    
    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            saveToken({
                token: data.token
            });
            toastRef.current?.show({ severity: "success", summary: "Success", detail: "Login successful" });
        },
        onError: (error: AxiosError) => {
            
        }
    });

    const doLogin: SubmitHandler<LoginForm> = (data) => {
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
                    <h1 className="font-bold text-3xl mb-10">Login</h1>
                    <Errors error={error} />
                    <form onSubmit={handleSubmit(doLogin)} className="space-y-8">
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
                        <Button className="w-full" label={isPending ? "Logging in..." : "Login"} type="submit" disabled={isPending} />
                    </form>
                </div>
            </div>
        </div>
    );
}