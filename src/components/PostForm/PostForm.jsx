import React, { useCallback, useEffect } from "react";
import { Input, Select, Button, RTE } from "../index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import appwriteFile from "../../appwrite/file";
import { useForm } from "react-hook-form";

const PostForm = ({ post }) => {
  console.log(post);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      slug: post?.slug || "",
      status: post?.status || "active",
    },
  });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    // console.log(data);
    if (post) {
      // update the edited data

      const file = data.image[0]
        ? await appwriteFile.uploadFile(data.image[0])
        : null;
      if (file) {
        await appwriteFile.deleteFile(post.featuredImage);
      }
      const uploadPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : null,
      });
      if (uploadPost) navigate(`/post/${uploadPost.$id}`);
    } else {
      // create a new one
      console.log(data.image[0]);
      const file = data.image[0]
        ? await appwriteFile.uploadFile(data.image[0])
        : null;

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const uploadPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });

        if (uploadPost) navigate(`/post/${uploadPost.$id}`);
      }
    }
  };

  const transformSlug = useCallback((value) => {
    // Replace special characters with a space
    if (value && typeof value === "string") {
      const replacedSpecialChars = value.replace(/[^\w\s]/gi, " ");
      return replacedSpecialChars.trim().replace(/\s+/g, "-").toLowerCase();
    }

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", transformSlug(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe;
  }, [watch, transformSlug, setValue]);
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title: "
          type="text"
          placeholder="Title"
          {...register("title", {
            required: "Title is required",
          })}
          className="mb-4"
        />
        {errors.title && (
          <p className="text-red-600 mt-1 text-center">
            {errors.title.message}
          </p>
        )}

        <Input
          label="Slug: "
          type="text"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", {
            required: true,
          })}
          onInput={(e) => {
            setValue("slug", transformSlug(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />

        <RTE
          name="content"
          label="Content: "
          control={control}
          defaultValue={getValues("content")}
        />
        {errors.content && (
          <p className="text-red-600 mt-1 text-center">
            {errors.content.message}
          </p>
        )}

        <div className="w-1/3 px-2">
          <Input
            label="Featured Image: "
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            className="mb-4"
            {...register("image", {
              required: !post,
            })}
          />

          {post && (
            <div className="w-full mb-4">
              <img
                src={appwriteFile.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-lg"
              />
            </div>
          )}

          <Select
            label="Status: "
            options={["active", "inactive"]}
            className="mb-4"
            {...register("status", {
              required: true,
            })}
          />

          <Button
            type="submit"
            bgColor={post && "bg-green-500"}
            className="w-full"
          >
            {post ? "Edit" : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
