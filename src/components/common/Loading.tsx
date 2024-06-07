import { ProgressSpinner } from "primereact/progressspinner";

interface LoadingProps {
    className?: string
}

export default function Loading({ className }: LoadingProps) {
    return (
        <div className={`flex justify-center py-20 ${className ?? ""}`}>
            <ProgressSpinner />
        </div>
    );
}