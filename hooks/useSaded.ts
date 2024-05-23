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

  const hasSaded = useMemo(() => {
    const list = fetchedPost?.sadedIds || [];

    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.sadedIds]);

  const toggleSad = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasSaded) {
        request = () => axios.delete('/api/sad', {
          headers: {
            'x-api-key': apiKey,
          },
          params: {
            postId: postId,
          },
        });
      } else {
        request = () => axios.post('/api/sad', { postId }, {
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
  }, [currentUser, hasSaded, postId, mutateFetchedPosts, mutateFetchedPost, loginModal]);

  return {
    hasSaded,
    toggleSad,
  }
}

export default useLove;