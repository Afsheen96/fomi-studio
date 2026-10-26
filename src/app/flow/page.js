import FlowWorkspace from "@/components/flow/FlowWorkspace";

export const metadata = {
  title: "Fomi Flow — version-based image workspace",
  description: "My redesign of the image generation workspace: every image is a version you can compare, branch and restore.",
};

export default function FlowPage() {
  return <FlowWorkspace />;
}
