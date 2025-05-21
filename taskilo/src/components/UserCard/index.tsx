import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User; // User object passed as a prop
};


/**
 * UserCard component - Displays basic user information
 * Shows profile picture, username, and email
 */
const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center rounded border p-4 shadow bg-white dark:bg-dark-secondary dark:text-white">
      {/* Profile picture - shown if URL is available */}
      {user.profilePictureUrl && (
        <Image
          src={`/p13.jpeg`}
          alt="profile picture"
          width={30}
          height={30}
          className="rounded-full object-cover"
        />
      )}
      {/* Username and email display */}
      <div className="ml-3">
        <h3 className="font-semibold">{user.username}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
