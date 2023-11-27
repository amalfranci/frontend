import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";
import { UpdatePost } from "../redux/postSlice";
import { apiRequest, handleFileUpload } from "../utils";

function EditPostModal({ post, fetchPost, onClose }) {
  // Assuming you only need the user from the store
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState([]);
  useEffect(() => {
    fetchPost();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { description: post.description }, 
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");
    try {
      const uri = file.length > 0 && (await handleFileUpload(file[0]));
      const { description } = data;
      const res = await apiRequest({
        url: "/posts/update-post/" + post._id, 
        data: {
          description,
          // image: uri ? uri : post.image,
        },
        method: "PUT",
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        
        await fetchPost();
        onClose();
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    dispatch(onClose(true));
  };

  const handleSelect = (e) => {
    setFile(e.target.files);
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:block sm:align-middle sm:h-screen"></span>
          <div
            className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform
            transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Edit Post
              </label>
              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="description"
                placeholder="Description"
                label="Description"
                type="text"
                styles="w-full rounded-full py-5"
                register={register("description", {
                  required:
                    file.length === 0
                      ? "Write something about the post"
                      : false,
                })}
                error={errors.description ? errors.description.message : ""}
              />
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                {/* <input
                  type="file"
                  name="image"
                  className=""
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg,.png,.jpeg,.mp4"
                /> */}
              </label>
              {errMsg?.message && (
                <span
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}{" "}
                </span>
              )}
              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles={`inline-flex justify-center rounded-md 
                        bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                    title="Submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPostModal;
