import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useSurprise = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);
  const apiKey = 'jdktplshdjkqpalcnzmdgtopsbcgHATncmdlKlpasituqixbcmagdlpqoeutidnWgfhEUndjfPLCYAJDLAPQbcghfltpoaudhtkdlpaofhdlshKSkdlfpKbchfdKATQREPALCVmdhfjased';

  const loginModal = useLoginModal();

  const hasSurprised = useMemo(() => {
    const list = fetchedPost?.surprisedIds || [];

    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.surprisedIds]);

  const toggleSurprise = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasSurprised) {
        request = () => axios.delete('/api/surprised', {
          headers: {
            'x-api-key': apiKey,
          },
          params: {
            postId: postId,
          },
        });
      } else {
        request = () => axios.post('/api/surprised', { postId }, {
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
  }, [currentUser, hasSurprised, postId, mutateFetchedPosts, mutateFetchedPost, loginModal]);

  return {
    hasSurprised,
    toggleSurprise,
  }
}

export default useSurprise;