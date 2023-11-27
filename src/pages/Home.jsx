import React, { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {

  useToast,

} from "@chakra-ui/react";

import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
 

import { Link, useNavigate } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";

import {
  apiRequest,
  deletePost,
  fetchPosts,
  getUserInfo,
  handleFileUpload,
  likePost,
  sendFriendRequest,
} from "../utils";
import { useDispatch } from "react-redux";
import { UserLogin } from "../redux/userSlice";

function Home() {
  const navigate = useNavigate()
   const toast = useToast();
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [files, setFiles] = useState([]);
  const [friendRe,setFriendRe]=useState(false)
  const pendingFriendRequestsStorageKey = "pendingFriendRequests";

  const storedPendingFriendRequests =
    JSON.parse(localStorage.getItem(pendingFriendRequestsStorageKey)) || {};
  const [pendingFriendRequests, setPendingFriendRequests] = useState(
    storedPendingFriendRequests
  );

  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const allowedExtensions = ["png", "jpg", "jpeg", "mp4", "avi"];
  
  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg("");

    try {
      const imageUris = [];
    for (const file of files) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        setErrMsg("Please upload files with allowed extensions: png, jpg, jpeg, mp4, avi");
        setPosting(false);
        return;
      }
      const uri = await handleFileUpload(file);
      imageUris.push(uri);
   
    }

      const newData = { ...data, images: imageUris };

       if (!newData.description.trim() && imageUris.length === 0) {
    toast({
        title: "Write something about post",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setPosting(false);
      return;
    }
      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST",
      });

      if (res?.status === "failed") {
 alert("You have been blocked by admin")
      
        navigate("/login")
      } else {
        reset({
          description: "",
        });
        setFiles([]);
        setErrMsg("");
        await fetchPost();
      }
      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPost();
  };

  const handleDelete = async (id) => {
    // Display a confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // User confirmed the delete action
        try {
          await deletePost(id, user.token);
          await fetchPost();
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the post.",
            "error"
          );
        }
      }
    });
  };

  const fetchSuggestedFriend = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: "/users/get-friend-request",
        token: user?.token,
        method: "POST",
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
      if (res.success) {
        const updatedPendingFriendRequests = { ...pendingFriendRequests };
        updatedPendingFriendRequests[id] = true;
        setPendingFriendRequests(updatedPendingFriendRequests);
        localStorage.setItem(
          pendingFriendRequestsStorageKey,
          JSON.stringify(updatedPendingFriendRequests)
        );
      }

      await fetchSuggestedFriend();
    } catch (error) {
      console.error(error.message);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: "/users/accept-request",
        token: user?.token,
        method: "POST",
        data: { rid: id, status },
      });
      setFriendRequest(res?.data);
      setFriendRe(true)
      getUser()
      fetchSuggestedFriend()
    } catch (error) {
      console.log(error);
    }
  };
  // delete friend request
  const handleDeleteFriendRequest = async (requestId) => {
    try {
      // Send an API request to delete the friend request
      const res = await apiRequest({
        url: "/users/delete-friend-request",
        token: user?.token,
        method: "POST",
        data: { requestId },
      });

      if (res.success) {
        // Update the local state to remove the friend request
        const updatedFriendRequests = friendRequest.filter(
          (request) => request._id !== requestId
        );
        setFriendRequest(updatedFriendRequests);

        // Update the icon status
        const updatedPendingFriendRequests = { ...pendingFriendRequests };
        updatedPendingFriendRequests[requestId] = false;
        setPendingFriendRequests(updatedPendingFriendRequests);
        localStorage.setItem(
          pendingFriendRequestsStorageKey,
          JSON.stringify(updatedPendingFriendRequests)
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUser = async () => {
    const res = await getUserInfo(user?.token);

    const newdData = { token: user?.token, ...res };
    dispatch(UserLogin(newdData));
  };

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchSuggestedFriend();
    fetchFriendRequests();
    

  }, []);

  

  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar user={user} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* center */}
          <div className="flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="w-14 h-14 rounded-full object-cover"
                ></img>
                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="what's on your mind..."
                  name="description"
                
                   register={register("description", {
                    required: files.length===0  ?  "Write something about post":false,
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
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

              <div className="flex items-center justify-between py-4 ">
                <label
                  htmlFor="img"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFiles([...e.target.files])}
                    className="hidden"
                    id="img"
                    data-max-size="5120"
                    accept=".jpg,.png,.jpeg"
                    multiple
                  />

                  <BiImages />
                  <span>Image</span>
                </label>
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="video"
                >
                  <input
                    type="file"
                    onChange={(e) => setFiles([...e.target.files])}
                    className="hidden"
                    id="video"
                    data-max-size="5120"
                    accept=".mp4,.wav"
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      title="post"
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    />
                  )}
                </div>
              </div>
            </form>
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  fetchPost={fetchPost}
                  deletePost={handleDelete}
                  like={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No post Available</p>
              </div>
            )}
          </div>

          {/* right */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* Friend Request */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={"/profile/" + from._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />

                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <CustomButton
                        title="Accept"
                        onclick={() => {
                          acceptFriendRequest(_id, "Accepted");
                        
                        }}
                        containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full "
                      />
                      <CustomButton
                        title="Deny"
                        onclick={() => acceptFriendRequest(_id, "Denied")}
                        containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* suggested friends */}

            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Suggeted Friend</span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />

                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      {pendingFriendRequests[friend._id] ? (
                        <button className="bg-[#0444a430] text-sm text-white p-1 rounded">
                          <AiOutlineCloseCircle
                            onClick={() =>
                              handleDeleteFriendRequest(friend._id)
                            }
                          />
                        </button>
                      ) : (
                        <button
                          className="bg-[#0444a430] text-sm text-white p-1 rounded"
                          onClick={() => handleFriendRequest(friend._id)}
                        >
                          <BsPersonFillAdd />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  );
}

export default Home;
