import React, { useState } from "react";
import { NoProfile } from "../assets";
import { Link } from "react-router-dom";
import moment from "moment";
import { BiComment, BiLike, BiSolidLike, BiSolidReport } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdatePost } from "../redux/postSlice";
import { useDispatch, useSelector } from "react-redux";
import EditPostModal from "./EditPostModal";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { apiRequest } from "../utils";

const getPostComments = async (id) => {
  try {
    const res = await apiRequest({
      url: "/posts/comments/" + id,
      method: "GET",
    });
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

const ReplyCard = ({ reply, user, handleLike }) => {
  return (
    <div className="w-full py-3">
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/profile/" + reply?.userId?._id}>
          <img
            src={reply?.userId?.profileUrl ?? NoProfile}
            alt={reply?.userId?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={"/profile/" + reply?.userId?._id}>
            <p className="font-medium text-base text-ascent-1">
              {reply?.userId?.firstName} {reply?.userId?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply?.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <div className="ml-12">
        <p className="text-ascent-2 ">{reply?.comment}</p>
        <div className="mt-2 flex gap-6">
          <p
            className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
            onClick={handleLike}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({ user, id, replyAt, getComments }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    setLoading(true);
    setErrMsg("");
    try {
      const URL = !replyAt
        ? "/posts/comment/" + id
        : "/posts/reply-comment/" + id;
      const newData = {
        comment: data?.comment,
        from: user?.firstName + " " + user.lastName,
        replyAt: replyAt,
      };
      const res = apiRequest({
        url: URL,
        data: newData,
        token: user?.token,
        method: "POST",
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        reset({
          comment: "",
        });
        setErrMsg("");
        await getComments();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-b border-[#66666645]"
    >
      <div className="w-full flex items-center gap-2 py-4">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
        />
        <TextInput
          name="comment"
          styles="w-full rounded-full py-3"
          placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
          register={register("comment", {
            required: "Comment can not be empty",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />
      </div>
      {errMsg?.message && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg?.status === "failed"
              ? "text-[#f64949fe]"
              : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}
      <div className="flex items-end justify-end pb-2">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            title="Submit"
            type="Submit"
            containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"
          />
        )}
      </div>
    </form>
  );
};

function PostCard({ post, user, deletePost, fetchPost, like }) {


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(post?.status === "pending");

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const [showall, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const hasOneImage =
    post?.image && Array.isArray(post.image) && post.image.length === 1;
  const hasMultiImage =
    post?.image && Array.isArray(post.image) && post.image.length > 1;

  // for post comment
  const dispatch = useDispatch();

  const getComments = async (id) => {
    setReplyComments(0);
    const result = await getPostComments(id);
    setComments(result);
    setLoading(false);
  };

  // for post like
  const handleLike = async (uri) => {
    await like(uri);
    await getComments(post?._id);
  };
  const handleReport = async () => {
    if (reported) {
      return;
    }
    const result = await Swal.fire({
      title: "Report Post",
      text: "Are you sure you want to report this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, report it",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      // User confirmed the report, proceed with reporting
      try {
        const response = await fetch(
          `http://localhost:8800/posts/reportPost/${post._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "pending" }),
          }
        );

        if (response.ok) {
          // The report was successful, update the UI or take appropriate action
          console.log("Post reported successfully.");
          setReported(true);
          // You can also update the UI to reflect the reported status if needed
        } else {
          // Handle/report the error
          console.error("Report failed.");
        }
      } catch (error) {
        console.error("An error occurred while reporting:", error);
      }
    }
  };
 const handleDeleteComment = async (commentId) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this comment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const response = await fetch(`http://localhost:8800/posts/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        console.log('Comment deleted successfully.');
       
        const updatedComments = comments.filter(comment => comment._id !== commentId);
        setComments(updatedComments);
       
        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
        
      } else {
        console.error('Comment deletion failed.');
        Swal.fire('Error!', 'Failed to delete the comment.', 'error');
      }
    }
  } catch (error) {
    console.error('An error occurred while deleting the comment:', error);
    Swal.fire('Error!', 'An error occurred while deleting the comment.', 'error');
  }
};


  return (
    <div className="mb-2 bg-primary p-4 rounded-xl">
      <div className="flex gap-3 items-center mb-2">
        <Link to={"/profile/" + post?.userId?._id}>
          <img
            src={post?.userId?.profileUrl ?? NoProfile}
            alt={post?.userId?.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>
        <div className="w-full flex justify-between">
          <div className="">
            <Link to={"/profile/" + post?.userId?._id}>
              <p className="font-medium text-lg text-ascent-1">
                {post?.userId?.firstName} {post?.userId?.lastName}
              </p>
            </Link>
            <span className="text-ascent-2">{post?.userId?.location}</span>
          </div>
          <span className="text-ascent-2">
            {moment(post?.createdAt ?? "2023-10-23").fromNow()}
          </span>
        </div>
      </div>
      <div>
        <p className="text-ascent-2">
          {showall === post?._id
            ? post?.description
            : post?.description?.slice(0, 300)}
          {post?.description?.length > 301 &&
            (showall === post?._id ? (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show less
              </span>
            ) : (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(post?._id)}
              >
                show more
              </span>
            ))}
        </p>
        {hasMultiImage && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {post.image.map((url, index) => (
              <div key={index} className="w-full">
                {url.toLowerCase().endsWith(".mp4") ? (
                  <video
                    controls
                    width="100%"
                    height="auto"
                    autoPlay
                    muted
                    className="w-full h-40 rounded-lg"
                  >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={url}
                    alt={`post image ${index}`}
                    className="w-full h-40 rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {hasOneImage &&
          post.image.map((url, index) => (
            <div key={index} className="w-full">
              {url.toLowerCase().endsWith(".mp4") ? (
                <video
                  controls
                  width="100%"
                  height="auto"
                  autoPlay
                  muted
                  className="w-full"
                >
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={url}
                  alt={`post image ${index}`}
                  className="w-full rounded-lg"
                />
              )}
            </div>
          ))}
      </div>
      <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent text-base border-t border-[#66666645]">
        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => handleLike("/posts/like/" + post?._id)}
        >
          {post?.likes?.includes(user?._id) ? (
            <BiSolidLike size={20} color="blue" />
          ) : (
            <BiLike size={20} />
          )}
          {post?.likes?.length} Likes
        </p>
        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            setShowComments(showComments === post._id ? null : post._id);
            getComments(post?._id);
          }}
        >
          <BiComment size={20} />
          {post?.comments?.length} Comments
        </p>
        <p>
          {user?._id === post?.userId?._id ? (
            <div className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer">
              <FaEdit size={20} onClick={openEditModal} />
              <span>Edit</span>
            </div>
          ) : (
            <div className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer">
              {reported ? (
                // Show "Reported" if the post has been reported
                <span>Reported</span>
              ) : (
                // Show "Report" if the post has not been reported
                <BiSolidReport size={20} onClick={handleReport} />
              )}
            </div>
          )}
          {isEditModalOpen && (
            <EditPostModal
              post={post} // Pass the post data to the EditPostModal
              onClose={closeEditModal}
              fetchPost={fetchPost} // Pass a callback to close the modal
            />
          )}
        </p>

        {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post?._id)}
          >
            <MdOutlineDeleteOutline size={20} />
            <span>Delete</span>
          </div>
        )}
      </div>

      {/* comments */}
      {showComments === post?._id && (
        <div className="w-full mt-4 border-t border-[#66666645] pt-4 ">
          <CommentForm
            user={user}
            id={post?._id}
            getComments={() => getComments(post?._id)}
          />

          {loading ? (
            <Loading />
          ) : comments?.length > 0 ? (
            comments?.map((comment) => (
              <div className="w-full py-2" key={comment?._id}>
                <div className="flex gap-3 items-center mb-1">
                  <Link to={"/profile/" + comment?.userId?._id}>
                    <img
                      src={comment?.userId?.profileUrl ?? NoProfile}
                      alt={comment?.userId?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={"/profile/" + comment?.userId?._id}>
                      <p className="font-medium text-base text-ascent-1">
                        {comment?.userId?.firstName} {comment?.userId?.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2 text-sm">
                      {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                    </span>
                  </div>
                </div>

                <div className="ml-12">
                  <p className="text-ascent-2">{comment?.comment}</p>

                  <div className="mt-2 flex gap-6">
                    <p
                      className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer "
                      onClick={() => {
                        handleLike("/posts/like-comment/" + comment?._id);
                      }}
                    >
                      {comment?.likes?.includes(user?._id) ? (
                        <BiSolidLike size={20} color="blue" />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {comment?.likes?.length} Likes
                    </p>
                    <span
                      className="text-blue cursor-pointer"
                      onClick={() => setReplyComments(comment?._id)}
                    >
                      Reply
                    </span>
                        <span
                      className="text-blue cursor-pointer"
                      onClick={() => handleDeleteComment(comment?._id)}
                    >
                      Delete
                    </span>
                  </div>

                  {replyComments === comment?._id && (
                    <CommentForm
                      user={user}
                      id={comment?._id}
                      replyAt={comment?.from}
                      getComments={() => getComments(post?._id)}
                    />
                  )}
                </div>

                {/* REPLIES */}

                <div className="py-2 px-8 mt-6">
                  {comment?.replies?.length > 0 && (
                    <p
                      className="text-base text-ascent-1 cursor-pointer"
                      onClick={() =>
                        setShowReply(
                          showReply === comment?.replies?._id
                            ? 0
                            : comment?.replies?._id
                        )
                      }
                    >
                      Show Replies ({comment?.replies?.length})
                    </p>
                  )}

                  {showReply === comment?.replies?._id &&
                    comment?.replies?.map((reply) => (
                      <ReplyCard
                        reply={reply}
                        user={user}
                        key={reply?._id}
                        handleLike={() =>
                          handleLike(
                            "/posts/like-comment/" +
                              comment?._id +
                              "/" +
                              reply?._id
                          )
                        }
                      />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <span className="flex text-sm py-4 text-ascent-2 text-center">
              No Comments, be first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
