import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import { signIn } from 'next-auth/react';
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = useCallback(async () => {
    const loginError = document.querySelector('#login-error');
    try {
      setIsLoading(true);

      //on regarde si email valide
    //si champ vide
    if(!email){
      toast.error('Please enter an email.');
      return;
    }
    //si email valide
    if (!/^(?=.{1,256})(?=.{1,64}@.{1,255}$)[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/.test(email)) {
      toast.error('Please enter a valid email.');
      return;
    }

    //on regarde si mot de passe valide
    //si champ vide
    if(!password){
      toast.error('Please enter a password.');
      return;
    }
    //si mot de passe valide
    if (!/^(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,50}$/.test(password)) {
      toast.error('Please enter a valid password.');
      return;
    }


      setError("");

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.reload();
        loginModal.onClose();
      }
    } catch (error) {
      //toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [loginModal, email, password, router]);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal, isLoading]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
      />
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
      {error && (
        <span id="login-error" style={{color: "red", fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
          {/*{error}*/}
          Invalid credentials
        </span>
      )}
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        First time using Adjma?
        <span
          onClick={onToggle}
          className="
            text-white 
            cursor-pointer 
            hover:underline
          "
        >
          {" "}
          Create an account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Sign in"
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
