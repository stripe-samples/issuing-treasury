import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="/assets/furever_logo.png"
      alt="Furever Logo"
      width={40}
      height={40}
      style={{
        objectFit: "contain",
      }}
    />
  );
};
