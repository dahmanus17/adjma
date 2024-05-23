import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoPeopleCircle } from "react-icons/io5";
import { useSidebar } from "@/components/SidebarContext";
import useUsers from "@/hooks/useUsers";

const ToggleSidebar: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const { data: users = [] } = useUsers();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closePopupModal = () => {
    const modal = document.querySelector("#mobileFollowbar");
    const overlay = document.querySelector("#modalOverlay");
    if (modal) {
      modal.remove();
    }
    if (overlay) {
      overlay.remove();
    }
    document.body.querySelectorAll("*").forEach((el) => {
      (el as HTMLElement).style.filter = "none";
    });
  };

  const openPopupModal = () => {
    if (users.length === 0) return;

    const overlay = document.createElement("div");
    overlay.setAttribute("id", "modalOverlay");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    overlay.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const followUsersModal = document.createElement("div");
    followUsersModal.setAttribute("id", "mobileFollowbar");
    const modalContent = `
      <div>
        <div id="closeArrow" style="text-align: right; padding: 10px 10px 0 10px; height: 40px; cursor: pointer; position: sticky; top: 0; background-color: rgb(38, 38, 38); z-index: 1001;">
          <svg fill="white" viewBox="0 0 16 16" height="1em" width="1em">
            <path d="M15 8a.5.5 0 00-.5-.5H2.707l3.147-3.146a.5.5 0 10-.708-.708l-4 4a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708L2.707 8.5H14.5A.5.5 0 0015 8z" />
          </svg>
        </div>
        ${users
          .map(
            (user: Record<string, any>) => `
            <a href="/users/${user.id}">
            <div key=${user.id} style="margin: 15px;">
              <div style="display: flex; align-items: center; gap: 7px">
                <img src=${user.profileImage} style="width: 30px; height: 30px; border-radius: 50%;" />
                <div>
                  <p style="color: white">${user.name}</p>
                  <p style="color: gray; font-size: 12px">@${user.username}</p>
                </div>
                
              </div>
            </div>
            </a>`
          )
          .join("")}
      </div>
    `;
    followUsersModal.innerHTML = modalContent;
    followUsersModal.style.overflowY = "scroll";
    followUsersModal.style.position = "fixed";
    followUsersModal.style.top = "50%";
    followUsersModal.style.left = "50%";
    followUsersModal.style.transform = "translate(-50%, -50%)";
    followUsersModal.style.width = "77%";
    followUsersModal.style.height = "77vh";
    followUsersModal.style.borderRadius = "10px";
    followUsersModal.style.backgroundColor = "rgb(38, 38, 38)";
    followUsersModal.style.zIndex = "1000";
    followUsersModal.style.padding = "0";
    followUsersModal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    //followUsersModal.style.scrollbarWidth = "none";
    (followUsersModal.style as any).msOverflowStyle = "none";
    (followUsersModal.style as any).webkitOverflowScrolling = "none";

    const closeButton = followUsersModal.querySelector("#closeArrow");
    if (closeButton) {
      closeButton.addEventListener("click", closePopupModal);
    }

    document.body.appendChild(overlay);
    document.body.appendChild(followUsersModal);

    document.body.querySelectorAll("body > *:not(#mobileFollowbar):not(#modalOverlay)").forEach((el) => {
      (el as HTMLElement).style.filter = "blur(7px)";
    });
  };

  return (
    <div className="flex flex-row items-center justify-between h-full border-b-[1px] border-neutral-600 p-2 bg-zinc-800">
      <div className="flex flex-row items-center gap-2">
        <CiMenuFries
          onClick={toggleSidebar}
          color="white"
          size={20}
          className="cursor-pointer hover:opacity-70 transition"
        />
      </div>
      {isMobile && (
        <IoPeopleCircle
          id="peopleIcon"
          onClick={openPopupModal}
          color="white"
          size={40}
          className="cursor-pointer hover:opacity-70 transition max-h-full"
        />
      )}
    </div>
  );
};

export default ToggleSidebar;
