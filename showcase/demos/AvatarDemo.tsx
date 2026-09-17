import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Button } from "../../src/index";
export function AvatarDemo() {
  const [showImage, setShowImage] = useState(true);
  return <div style={{ display: "grid", gap: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar>{showImage && <AvatarImage src="./avatars/ava.jpg" alt="Ava 的头像" />}<AvatarFallback>AV</AvatarFallback></Avatar><Avatar style={{ width: 48, height: 48 }}><AvatarFallback>TP</AvatarFallback></Avatar><Avatar style={{ width: 64, height: 64 }}><AvatarFallback>AC</AvatarFallback></Avatar></div><Button onClick={() => setShowImage(!showImage)}>{showImage ? "展示回退内容" : "展示图片"}</Button></div>;
}
