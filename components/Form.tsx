import axios from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '@/hooks/useRegisterModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import usePosts from '@/hooks/usePosts';
import usePost from '@/hooks/usePost';

import Avatar from './Avatar';
import Button from './Button';

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string);

  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';

      await axios.post(url, { body });

      toast.success('Post created');
      setBody('');
      mutatePosts();
      mutatePost();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [body, mutatePosts, isComment, postId, mutatePost]);

  return (
    <div className="border-b-[1px] border-neutral-600 px-5 py-2 bg-zinc-800 w-full" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
      {currentUser ? (
        <div className="flex flex-row items-center">
          <div className="mr-4">
            <Avatar userId={currentUser?.id} />
          </div>
          <div className="flex-grow flex-shrink w-full">
            <div className="flex flex-row items-center">
              <textarea
                disabled={isLoading}
                onChange={(event) => setBody(event.target.value)}
                value={body}
                className="
                  disabled:opacity-80
                  peer
                  resize-none 
                  mt-2.5
                  w-full 
                  bg-zinc-800 
                  ring-0 
                  outline-none 
                  text-[18px]
                  placeholder-neutral-500 
                  text-white
                "
                placeholder={placeholder}
              />
              <Button disabled={isLoading || !body} onClick={onSubmit} label="Post" />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <h1 className="text-white text-xl text-center mb-2 font-bold">Welcome to Adjma</h1>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button label="Login" onClick={loginModal.onOpen} />
            <Button label="Register" onClick={registerModal.onOpen} secondary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
