import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { useSelector } from "react-redux";
import { useState } from "react";
import { apiRequest } from "../utils";

function MutalFriends({ friends, currentId }) {
  const { user } = useSelector((state) => state.user);
  const [mutualFriends, setMutualFriends] = useState([]);
  const user1Id = user._id;
  const user2Id = currentId;
  useEffect(() => {
    async function fetchMutualFriends() {
      try {
        const result = await apiRequest({
          url: `/users/mutual-friends/${user1Id}/${user2Id}`,
          token: user.token, // Pass your authentication token if required
          method: "GET",
        });

        setMutualFriends(result.mutualFriends);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMutualFriends();
  }, [user1Id, user2Id]);

  return (
    <>
      <div>
        <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
          <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
            <span>Mutual Friends</span>
            <span>{mutualFriends?.length}</span>
          </div>
          <div className="w-full flex flex-col gap-4 pt-4">
            {mutualFriends?.map((friend) => (
              <Link
                to={"/profile/" + friend?._id}
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MutalFriends;
