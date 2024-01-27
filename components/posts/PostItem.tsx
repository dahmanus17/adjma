// Import necessary modules and components
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { formatDistanceToNowStrict } from "date-fns";
import useLoginModal from "@/hooks/useLoginModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import Avatar from "../Avatar";

import { RiShareForwardLine } from "react-icons/ri";
import { RiFileCopyLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'react-hot-toast';


interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      router.push(`/users/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const goToPost = useCallback(() => {
    router.push(`/posts/${data.id}`);
  }, [router, data.id]);

  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const openPopup = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    setPopupOpen(true);
  
  };

  const closePopup = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setPopupOpen(false);
  };

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);

  const [isPopupOpen, setPopupOpen] = useState(false);

  const copyToClipboard = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
    ev.stopPropagation();
    const textToCopy = `https://www.adjma.com/posts/${data.id}`;

    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand("copy");

    document.body.removeChild(textArea);
    toast.success('Post link copied',{duration:3000});
    closePopup(ev);
  };

  const preventPropagation = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
  };

  return (
    <div
      onClick={goToPost}
      className="
        border-b-[1px] 
        border-neutral-600 
        p-5 
        cursor-pointer
        bg-zinc-800
        hover:bg-neutral-900 
        transition
      "
    >
      <div className="flex flex-row items-start gap-3">
        <div className="flex-shrink-0">
          <Avatar userId={data.user.id} />
        </div>
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={goToUser}
              className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            "
            >
              {data.user.name}
            </p>
            <span
              onClick={goToUser}
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            "
            >
              @{data.user.username}
            </span>
            <span className="text-neutral-500 text-sm">{createdAt}</span>
          </div>

          <div className="text-white mt-1 flex">
            <div
              style={{
                maxWidth: "300px",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
              className="flex-grow"
            >
              {data.body}
            </div>
          </div>

          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-[#29ab87]
            "
            >
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            "
            >
              <LikeIcon color={hasLiked ? "red" : ""} size={20} />
              <p>{data.likedIds.length}</p>
            </div>

            <div
              id="sharePostButton"
              onClick={openPopup}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-[#29ab87]
            "
            >
              <RiShareForwardLine size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Popup content */}
      {isPopupOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-default"
          onClick={preventPropagation}
        >
          <div className="bg-gray-800 text-white p-5 rounded-md relative w-full max-w-xs sm:max-w-md">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500"
            >
              <AiOutlineClose size={20} />
            </button>
            <div className="flex items-center mt-8 mb-5">
              <p className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis">
                https://www.adjma.com/posts/{data.id}
              </p>
              <RiFileCopyLine
                onClick={copyToClipboard}
                className="cursor-pointer"
                size={30}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;
