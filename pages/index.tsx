import PostFeed from "@/components/posts/PostFeed";
import Form from "@/components/Form";
import ToggleSidebar from "@/components/ToggleSidebar";

export default function Home() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <ToggleSidebar />
        <Form placeholder="What's happening?" />
      </div>
      <PostFeed />
    </>
  );
}
