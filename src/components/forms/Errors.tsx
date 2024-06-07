import { AxiosError } from "axios";

interface ErrorsProps {
    error?: AxiosError<any> | null
}

export default function Errors({ error }: ErrorsProps) {
    if (error && error.response) {
        return (     
            <ul className="mb-10 text-white p-5 bg-red-400 rounded-md list-disc">
                {/* @ts-ignore */}
                { error.response?.data?.message
                    ? <li className="ml-5">{error.response?.data?.message}</li>
                    : Object.keys(error.response?.data?.errors).map((key) => {
                        return error.response?.data.errors[key].map((error: string) => (
                            <li className="ml-5">{error}</li>
                        ))
                    })
                }
            </ul>
        );
    } else {
        return <></>;
    }
}