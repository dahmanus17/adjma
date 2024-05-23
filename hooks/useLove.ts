import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useLove = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);
  const apiKey = 'jdktplshdjkqpalcnzmdgtopsbcgHATncmdlKlpasituqixbcmagdlpqoeutidnWgfhEUndjfPLCYAJDLAPQbcghfltpoaudhtkdlpaofhdlshKSkdlfpKbchfdKATQREPALCVmdhfjased';

  const loginModal = useLoginModal();

  const hasLoved = useMemo(() => {
    const list = fetchedPost?.lovedIds || [];

    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.lovedIds]);

  const toggleLove = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasLoved) {
        request = () => axios.delete('/api/love', {
          headers: {
            'x-api-key': apiKey,
          },
          params: {
            postId: postId,
          },
        });
      } else {
        request = () => axios.post('/api/love', { postId }, {
          headers: {
            'x-api-key': apiKey,
          },
        });
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();

      //toast.success('Success');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, hasLoved, postId, mutateFetchedPosts, mutateFetchedPost, loginModal]);

  return {
    hasLoved,
    toggleLove,
  }
}

export default useLove;