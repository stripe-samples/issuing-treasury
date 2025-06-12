import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="/assets/rocket-rides-logo.png"
      alt="Llama Llama Credit Logo"
      width={40}
      height={40}
      style={{
        objectFit: "contain",
      }}
    />
  );
};
