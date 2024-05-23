import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useLaugh = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);
  const apiKey = 'jdktplshdjkqpalcnzmdgtopsbcgHATncmdlKlpasituqixbcmagdlpqoeutidnWgfhEUndjfPLCYAJDLAPQbcghfltpoaudhtkdlpaofhdlshKSkdlfpKbchfdKATQREPALCVmdhfjased';

  const loginModal = useLoginModal();

  const hasLaughed = useMemo(() => {
    const list = fetchedPost?.laughedIds || [];

    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.laughedIds]);

  const toggleLaugh = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasLaughed) {
        request = () => axios.delete('/api/laugh', {
          headers: {
            'x-api-key': apiKey,
          },
          params: {
            postId: postId,
          },
        });
      } else {
        request = () => axios.post('/api/laugh', { postId }, {
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
  }, [currentUser, hasLaughed, postId, mutateFetchedPosts, mutateFetchedPost, loginModal]);

  return {
    hasLaughed,
    toggleLaugh,
  }
}

export default useLaugh;