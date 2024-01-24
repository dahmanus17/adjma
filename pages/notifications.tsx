import Header from "@/components/Header";
import NotificationsFeed from "@/components/NotificationsFeed";
import { NextPageContext, NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import ToggleSidebar from "@/components/ToggleSidebar";

export async function getServerSideProps(context: NextPageContext) {
  let req: NextApiRequest = context.req as NextApiRequest;
  let res: NextApiResponse = context.res as NextApiResponse;

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

const Notifications = () => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <ToggleSidebar />
        <Header showBackArrow label="Notifications" />
      </div>
      <NotificationsFeed />
    </>
  );
};

export default Notifications;
