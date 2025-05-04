import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center rounded border p-4 shadow bg-white dark:bg-dark-secondary dark:text-white">
      {user.profilePictureUrl && (
        <Image
          src={`/p1.jpeg`}
          alt="profile picture"
          width={30}
          height={30}
          className="rounded-full object-cover"
        />
      )}
      <div className="ml-3">
        <h3 className="font-semibold">{user.username}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
