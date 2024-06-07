import { useState, FormEvent } from "react";
import { Editor } from "primereact/editor";
import { useMutation } from "@tanstack/react-query";
import { addNewComment } from "@/lib/api/comments";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";

interface NewCommentFormProps {
    postId: number
}

export default function NewCommentForm({postId }: NewCommentFormProps) {

    const [newCommentInput, setNewCommentInput] = useState("");
    const client = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (context: string) => addNewComment(postId, context),
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ["postComments"]
            });
            setNewCommentInput("");
        }
    });

    const sendNewComment = (e: FormEvent) => {
        e.preventDefault();
        mutate(newCommentInput);
    }

    return (
        <form className="space-y-5" onSubmit={sendNewComment}>
            <Editor
                value={newCommentInput}
                onTextChange={(e) => setNewCommentInput(e.htmlValue ?? "")}
                style={{ height: '110px' }}
            />
            <Button type="submit" label="Send comment" loading={isPending} />
        </form>
    );
}