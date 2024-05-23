import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineClose, AiFillLike, AiOutlineLike } from "react-icons/ai";
import { RiShareForwardLine, RiFileCopyLine, RiEmotionLaughLine, RiEmotionLaughFill } from "react-icons/ri";
import { FaRegSurprise, FaSurprise, FaSadTear, FaRegSadTear } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

import useLoginModal from "@/hooks/useLoginModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import useLove from "@/hooks/useLove";
import useLaugh from "@/hooks/useLaugh";
import useSurprise from "@/hooks/useSurprise";
import useSaded from "@/hooks/useSaded";
import Avatar from "../Avatar";

import { RiShareForwardFill } from "react-icons/ri";

interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const { data: currentUser } = useCurrentUser();
  
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });
  const { hasLoved, toggleLove } = useLove({ postId: data.id, userId });
  const { hasLaughed, toggleLaugh } = useLaugh({ postId: data.id, userId });
  const { hasSurprised, toggleSurprise } = useSurprise({ postId: data.id, userId });
  const { hasSaded, toggleSad } = useSaded({ postId: data.id, userId });

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isThreeDotsOpen, setThreeDotsOpen] = useState(false);

  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/users/${data.user.id}`);
  }, [router, data.user.id]);

  const goToPost = useCallback(() => {
    router.push(`/posts/${data.id}`);
  }, [router, data.id]);

  const handleReaction = useCallback((ev: any, action: () => void) => {
    ev.stopPropagation();
    if (!currentUser) {
      return loginModal.onOpen();
    }
    action();
  }, [loginModal, currentUser]);

  const handlePopupToggle = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setPopupOpen((prev) => !prev);
  };

  const handleThreeDotsToggle = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setThreeDotsOpen((prev) => !prev);
  };

  const copyToClipboard = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
    ev.stopPropagation();
    const textToCopy = `https://www.adjma.com/posts/${data.id}`;

    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand("copy");

    document.body.removeChild(textArea);
    toast.success('Post link copied', { duration: 3000 });
    setPopupOpen(false);
  };

  const LikeIcon = hasLiked ? AiFillLike : AiOutlineLike;
  const LovedIcon = hasLoved ? AiFillHeart : AiOutlineHeart;
  const LaughedIcon = hasLaughed ? RiEmotionLaughFill : RiEmotionLaughLine;
  const SurprisedIcon = hasSurprised ? FaSurprise : FaRegSurprise;
  const SadedIcon = hasSaded ? FaSadTear : FaRegSadTear;

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);

  return (
    <div
      onClick={goToPost}
      className="
        border-b-[0.5px] 
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
                maxWidth: "100%",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
              className="flex-grow"
            >
              {data.body}
            </div>
          </div>
        </div>
        <div id="threeDots" className="ml-auto relative" onClick={handleThreeDotsToggle}>
          <BsThreeDotsVertical color="rgb(115 115 115)" size={20} />
          {isThreeDotsOpen && (
            <div onClick={handlePopupToggle} className="absolute top-0 right-full mr-0 bg-zinc-700 text-white p-1 rounded-md flex flex-col" style={{ width: "fit-content", height: "fit-content" }}>
            <span className="cursor-pointer p-2 flex-1"><div
          id="sharePostButton"
          //onClick={handlePopupToggle}
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-100
            gap-0
            cursor-pointer 
            transition 
            
        "
        >
        Share <RiShareForwardFill size={22} />
        </div></span>
            {/*<span className="cursor-pointer p-0 flex-1">Signal</span>*/}
          </div>
          )}
        </div>
      </div>
      <div id="reactions" className="flex flex-row items-center mt-3 gap-3 w-full" style={{ paddingLeft: "57px" }}>
        <div
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-0.5
            cursor-pointer 
            transition 
            hover:text-[#29ab87]
        "
        >
          <AiOutlineMessage size={20} />
          <p>{data.comments?.length || 0}</p>
        </div>
        <div
          onClick={(ev) => handleReaction(ev, toggleLike)}
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-0.5
            cursor-pointer 
            transition 
          hover:text-[#29ab87]
        "
        >
          <LikeIcon color={hasLiked ? "#29ab87" : ""} size={20} />
          <p>{data.likedIds.length}</p>
        </div>
        <div
          onClick={(ev) => handleReaction(ev, toggleLove)}
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-0.5
            cursor-pointer 
            transition 
            hover:text-red-500
        "
        >
          <LovedIcon color={hasLoved ? "red" : ""} size={20} />
          <p>{data.lovedIds.length}</p>
        </div>
        <div
          onClick={(ev) => handleReaction(ev, toggleLaugh)}
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-0.5
            cursor-pointer 
            transition 
            hover:text-[#ffcb4c]
        "
        >
          <LaughedIcon color={hasLaughed ? "#ffcb4c" : ""} size={20} />
          <p>{data.laughedIds.length}</p>
        </div>
        <div
          onClick={(ev) => handleReaction(ev, toggleSurprise)}
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-0.5
            cursor-pointer 
            transition 
            hover:text-[#ffcb4c]
        "
        >
          <SurprisedIcon color={hasSurprised ? "#ffcb4c" : ""} size={17.5} />
          <p>{data.surprisedIds.length}</p>
        </div>
        <div
          onClick={(ev) => handleReaction(ev, toggleSad)}
          className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-0.5
            cursor-pointer 
            transition 
            hover:text-[#ffcb4c]
        "
        >
          <SadedIcon color={hasSaded ? "#ffcb4c" : ""} size={17.5} />
          <p>{data.sadedIds.length}</p>
        </div>
        
      </div>

      {isPopupOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-default"
          onClick={(ev) => ev.stopPropagation()}
        >
          <div className="bg-zinc-800 text-white p-5 rounded-md relative w-full max-w-xs sm:max-w-md">
            <button
              onClick={handlePopupToggle}
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
