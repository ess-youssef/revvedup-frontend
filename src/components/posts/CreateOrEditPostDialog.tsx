import { createPost, getPostDetails, editPost, deletePost } from "@/lib/api/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { BlockUI } from "primereact/blockui";
import { zodResolver } from "@hookform/resolvers/zod";

const PostSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
});

type PostForm = z.infer<typeof PostSchema>;

interface PostDialogProps {
    id?: number;
    closeDialog: () => void;
}

export default function CreateOrEditPostDialog({ id, closeDialog }: PostDialogProps) {
    const client = useQueryClient();
    const toastRef = useRef<Toast>(null);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<PostForm>({
        resolver: zodResolver(PostSchema)
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ["editPost", id],
        queryFn: () => getPostDetails(id ?? 0),
        enabled: !!id
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (context: PostForm) => id ? editPost(id, context) : createPost(context),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: `${id ? "Edited" : "Created"} successfully` });
            client.invalidateQueries({
                queryKey: ["myPosts"]
            });
            client.invalidateQueries({
                queryKey: ["posts"]
            });
            closeDialog();
        }
    });

    const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
        mutationFn: () => deletePost(id ?? 0),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: "Post deleted successully" });
            client.invalidateQueries({
                queryKey: ["myPosts"]
            });
            client.invalidateQueries({
                queryKey: ["posts"]
            });
            closeDialog();
        }
    });

    const doSendPostForm: SubmitHandler<PostForm> = (data) => {
        mutate(data);
    }

    const doDelete = () => {
        deleteMutate()
    }

    useEffect(() => {
        if (data) {
            setValue("title", data.title);
            setValue("content", data.content);
        }
    }, [data]);

    return (
        <BlockUI blocked={!!id && isLoading}>
            <form className="space-y-5 mt-5" onSubmit={handleSubmit(doSendPostForm)}>
                <div>
                    <FloatLabel>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id={field.name}
                                    className="w-full"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            )}
                        />
                        <label htmlFor="title">Title</label>
                    </FloatLabel>
                    {errors.title?.message && <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>}
                </div>
                <div>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <Editor
                                value={field.value}
                                onTextChange={(e) => field.onChange(e.htmlValue ?? "")}
                                style={{ height: '320px' }}
                            />
                        )}
                    />
                    {errors.content?.message && <p className="text-red-500 text-sm mt-1">{errors.content?.message}</p>}
                </div>
                <div className="flex items-center gap-5">
                    <Button label="Create" type="submit" loading={isPending} />
                    { id && <Button label="Delete" loading={isDeletePending} severity="danger" onClick={doDelete} text /> }
                </div>
            </form>
        </BlockUI>
    );
}