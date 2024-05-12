import useLoginModal from "@/hooks/useLoginModal";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";
import toast from "react-hot-toast";
import {signIn} from "next-auth/react";
import Button from "../Button";
//import { error } from "console";

const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal, isLoading]);

  const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const onSubmit = useCallback(async () => {
    const emailError = document.querySelector('#email-error');
    const nameError = document.querySelector('#name-error');
    const usernameError = document.querySelector('#username-error');
    const passwordError = document.querySelector('#password-error');
    
    if ((emailError as HTMLElement).style.display !== 'none') {
      if(emailError){
        emailError.textContent = '';
      (emailError as HTMLElement).style.display = 'none';
      }
    }

    if ((nameError as HTMLElement).style.display !== 'none') {
      if(nameError){
        nameError.textContent = '';
      (nameError as HTMLElement).style.display = 'none';
      }
    }

    if ((usernameError as HTMLElement).style.display !== 'none') {
      if(usernameError){
        usernameError.textContent = '';
      (usernameError as HTMLElement).style.display = 'none';
      }
    }

    if ((passwordError as HTMLElement).style.display !== 'none') {
      if(passwordError){
        passwordError.textContent = '';
      (passwordError as HTMLElement).style.display = 'none';
      }
    }

    //on regarde si champs vides
    if(!email){
      if(emailError){
        (emailError as HTMLElement).style.display = '';
        emailError.textContent = 'Please enter an email.';
      }
      return;
    }
    if(!name){
      if(nameError){
        (nameError as HTMLElement).style.display = '';
        nameError.textContent = 'Please enter a name.';
      }
      return;
    }
    if(!username){
      if(usernameError){
        (usernameError as HTMLElement).style.display = '';
        usernameError.textContent = 'Please enter a username.';
      }
      return;
    }
    if(!password){
      if(passwordError){
        (passwordError as HTMLElement).style.display = '';
        passwordError.textContent = 'Please enter a password.';
      }
      return;
    }
    
    if (!isPasswordValid(password)) {
      if (passwordError) {
        (passwordError as HTMLElement).style.display = '';
        if(password.length < 8) {
          passwordError.textContent = 'Password must contain at least 8 characters.';
          return;
        }
        if (!/[a-zA-Z]/.test(password)) {
          passwordError.textContent = 'Password must contain at least one letter.';
          return;
        }
        if (!/[0-9]/.test(password)) {
          passwordError.textContent = 'Password must contain at least one number.';
          return;
        }
        if (!/[!@#$%^&*()_+]/.test(password)) {
          passwordError.textContent = 'Password must contain at least one special character.';
          return;
        }
      }
      //return;
    }
    try {
      setIsLoading(true);
      
      await axios.post('/api/register', {
        email,
        password,
        username,
        name,
      });
      
      //setIsLoading(false);

      toast.success('Account created.');
      
      signIn('credentials', {
        email,
        password,
      });

      registerModal.onClose();
    } catch (error:any) {
      if(error.response.data.message === "Invalid Email") {
        
    if (emailError) {
      (emailError as HTMLElement).style.display = '';
      emailError.textContent = error.response.data.message;
    }
      }

    if(error.response.data.message === "Invalid Username") {
        
    if (usernameError) {
      (usernameError as HTMLElement).style.display = '';
      usernameError.textContent = error.response.data.message;
    }
      }
      //toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, [registerModal, email, password, username, name]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
      />
      <span id="email-error" style={{ color: "red", display: "none", fontFamily: "Arial, sans-serif", fontSize: "14px" }}></span>
      <Input
        disabled={isLoading}
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <span id="name-error" style={{ color: "red", display: "none" }}></span>
      <Input
        disabled={isLoading}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <span id="username-error" style={{ color: "red", display: "none" }}></span>
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
      <span id="password-error" style={{ color: "red", display: "none" }}></span>
    </div>
    
  );
  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an account?
        <span
          onClick={onToggle}
          className="
            text-white 
            cursor-pointer 
            hover:underline
          "
        >
          {" "}
          Sign in
        </span>
      </p>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create account"
      actionLabel="Register"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;